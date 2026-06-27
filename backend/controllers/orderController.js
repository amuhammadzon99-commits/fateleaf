import Order from '../models/Order.js';
import { logAudit } from '../utils/auditLogger.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import bot from '../telegramBot.js';

export const addOrderItems = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    totalPrice,
    pointsUsed = 0,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400).json({ message: 'Нет товаров в заказе' });
    return;
  } else {
    try {
      // Calculate points earned (5% of what they actually pay)
      const pointsEarned = Math.floor(totalPrice * 0.05);

      const order = new Order({
        orderItems: orderItems.map((x) => {
          const item = {
            ...x,
            image: x.images && x.images.length > 0 ? x.images[0] : (x.image || '/placeholder.svg'),
            _id: undefined,
          };
          if (!x.isGiftBox) {
            item.product = x._id;
          }
          return item;
        }),
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        totalPrice,
      });

      const createdOrder = await order.save();

      // Update user points
      const user = await User.findById(req.user._id);
      if (user) {
        if (pointsUsed > 0) {
          user.teaPoints -= pointsUsed;
        }
        user.teaPoints += pointsEarned;
        await user.save();

        if (user.telegramChatId && bot) {
          try {
            bot.sendMessage(user.telegramChatId, `✅ **Ваш заказ #${createdOrder._id.toString().slice(-6).toUpperCase()} успешно оформлен!**\nСумма: ${totalPrice} ₽\nНачислено баллов: ${pointsEarned} 🍃`, { parse_mode: 'Markdown' });
          } catch (e) {
            console.error('Ошибка отправки уведомления в TG:', e);
          }
        }
      }

      res.status(201).json(createdOrder);
    } catch (error) {
      console.error('Ошибка при создании заказа:', error);
      res.status(500).json({ message: 'Ошибка сервера при создании заказа' });
    }
  }
};

export const getAdminDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // 1. Продажи за месяц (только доставленные заказы в текущем месяце)
    const monthlySalesAggr = await Order.aggregate([
      {
        $match: {
          isDelivered: true,
          createdAt: { $gte: startOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalPrice" }
        }
      }
    ]);
    const monthlySales = monthlySalesAggr.length > 0 ? monthlySalesAggr[0].totalSales : 0;

    // 2. Новые заказы за текущий месяц
    const newOrders = await Order.countDocuments({
      createdAt: { $gte: startOfMonth }
    });

    // 3. Всего товаров
    const totalProducts = await Product.countDocuments();

    // 4. Пользователи
    const totalUsers = await User.countDocuments();

    // 5. Последние 5 заказов
    const recentOrders = await Order.find({})
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      monthlySales,
      newOrders,
      totalProducts,
      totalUsers,
      recentOrders
    });
  } catch (error) {
    console.error('Ошибка получения статистики:', error);
    res.status(500).json({ message: 'Ошибка сервера при получении статистики' });
  }
};

// GET /api/orders — все заказы (для админа), с фильтрацией и пагинацией
export const getOrders = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 15;
    const skip = (page - 1) * limit;

    // Фильтры
    const filter = {};
    if (req.query.status === 'processing') {
      filter.isDelivered = false;
      filter.isCancelled = { $ne: true };
    } else if (req.query.status === 'delivered') {
      filter.isDelivered = true;
    } else if (req.query.status === 'cancelled') {
      filter.isCancelled = true;
    }

    // Поиск по имени клиента или ID заказа
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      // Сначала ищем пользователей по имени
      const users = await User.find({ name: searchRegex }).select('_id');
      const userIds = users.map(u => u._id);
      
      filter.$or = [
        { _id: req.query.search.length === 24 ? req.query.search : undefined },
        { user: { $in: userIds } },
      ].filter(f => Object.values(f)[0] !== undefined);

      if (filter.$or.length === 0) delete filter.$or;
    }

    // Сортировка
    const sortOrder = req.query.sort === 'oldest' ? 1 : -1;

    const total = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: sortOrder })
      .skip(skip)
      .limit(limit);

    res.json({
      orders,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    console.error('Ошибка получения заказов:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// PUT /api/orders/:id — обновление статуса заказа
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Заказ не найден' });
    }

    const beforeState = order.toObject();
    const { status } = req.body;

    if (status === 'delivered') {
      order.isDelivered = true;
      order.deliveredAt = new Date();
      order.isPaid = true;
      order.paidAt = new Date();
      order.isCancelled = false;
    } else if (status === 'cancelled') {
      order.isCancelled = true;
      order.isDelivered = false;
    } else if (status === 'processing') {
      order.isDelivered = false;
      order.isCancelled = false;
    }

    const updatedOrder = await order.save();
    const populated = await Order.findById(updatedOrder._id).populate('user', 'name email telegramChatId');
    
    // Log the change
    let statusStr = status === 'delivered' ? 'Доставлен' : status === 'cancelled' ? 'Отменен' : 'В обработке';
    await logAudit(
      req,
      'Изменение статуса заказа',
      'Заказы',
      `Изменен статус заказа #${populated._id.toString().slice(-6).toUpperCase()} на "${statusStr}"`,
      { before: beforeState, after: updatedOrder.toObject() }
    );

    if (status === 'delivered' && populated.user.telegramChatId && bot) {
      try {
        bot.sendMessage(populated.user.telegramChatId, `🚚 **Отличные новости!**\nВаш заказ #${populated._id.toString().slice(-6).toUpperCase()} был успешно доставлен.\nСпасибо, что выбираете FateLeaf! 🍃`, { parse_mode: 'Markdown' });
      } catch(e) {
        console.error(e);
      }
    }

    res.json(populated);
  } catch (error) {
    console.error('Ошибка обновления заказа:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// DELETE /api/orders/:id — удаление заказа
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Заказ не найден' });
    }

    await Order.deleteOne({ _id: req.params.id });
    res.json({ message: 'Заказ удален' });
  } catch (error) {
    console.error('Ошибка удаления заказа:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Ошибка получения заказов пользователя:', error);
    res.status(500).json({ message: 'Ошибка сервера при получении заказов' });
  }
};

// @desc    Get analytics stats for admin
// @route   GET /api/orders/analytics
// @access  Private/Admin
export const getAnalyticsStats = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // 1. Sales over time (last 30 days)
    const salesData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
          isDelivered: true
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalSales: { $sum: "$totalPrice" },
          ordersCount: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // 2. Order Status Breakdown
    const orderStatuses = await Order.aggregate([
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$isCancelled", true] },
              "cancelled",
              {
                $cond: [{ $eq: ["$isDelivered", true] }, "delivered", "processing"]
              }
            ]
          },
          count: { $sum: 1 }
        }
      }
    ]);

    // 3. Top Products (By Quantity Sold)
    const topProducts = await Order.aggregate([
      { $match: { isDelivered: true } },
      { $unwind: "$orderItems" },
      {
        $group: {
          _id: "$orderItems.name",
          totalQuantity: { $sum: "$orderItems.qty" },
          totalRevenue: { $sum: { $multiply: ["$orderItems.price", "$orderItems.qty"] } }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 }
    ]);

    // 4. Overall KPIs
    const totalOrdersCount = await Order.countDocuments();
    const totalRevenueAggr = await Order.aggregate([
      { $match: { isDelivered: true } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } }
    ]);
    const totalRevenue = totalRevenueAggr.length > 0 ? totalRevenueAggr[0].totalRevenue : 0;
    const avgOrderValue = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0;

    // Formatting for Frontend
    const last30Days = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      last30Days.push(d.toISOString().split('T')[0]);
    }
    
    const formattedSalesData = last30Days.map(dateStr => {
      const found = salesData.find(item => item._id === dateStr);
      return {
        date: dateStr,
        revenue: found ? found.totalSales : 0,
        orders: found ? found.ordersCount : 0
      };
    });

    const statusCounts = { processing: 0, delivered: 0, cancelled: 0 };
    orderStatuses.forEach(status => {
      statusCounts[status._id] = status.count;
    });

    res.json({
      salesData: formattedSalesData,
      orderStatuses: [
        { name: 'В обработке', value: statusCounts.processing },
        { name: 'Доставлено', value: statusCounts.delivered },
        { name: 'Отменено', value: statusCounts.cancelled }
      ],
      topProducts: topProducts.map(p => ({
        name: p._id,
        quantity: p.totalQuantity,
        revenue: p.totalRevenue
      })),
      kpis: {
        totalRevenue,
        totalOrders: totalOrdersCount,
        averageOrderValue: Math.round(avgOrderValue)
      }
    });
  } catch (error) {
    console.error('Ошибка получения аналитики:', error);
    res.status(500).json({ message: 'Ошибка сервера при получении аналитики' });
  }
};
