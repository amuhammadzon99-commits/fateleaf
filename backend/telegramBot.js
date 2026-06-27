import TelegramBot from 'node-telegram-bot-api';
import Product from './models/Product.js';
import Order from './models/Order.js';
import User from './models/User.js';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const API_URL = 'http://localhost:5000';

let bot;
const sessions = {};

function getSession(chatId) {
  if (!sessions[chatId]) {
    sessions[chatId] = {
      state: 'IDLE',
      cart: [],
      category: null,
      products: [],
      currentIndex: 0,
      checkoutData: {}
    };
  }
  return sessions[chatId];
}

function renderMainMenu() {
  return {
    reply_markup: {
      inline_keyboard: [
        [{ text: '🌐 Web App (Нужен HTTPS)', web_app: { url: 'https://example.com' } }],
        [{ text: '🛍 Каталог', callback_data: 'menu_catalog' }, { text: '🛒 Корзина', callback_data: 'menu_cart' }],
        [{ text: '📦 Мои заказы', callback_data: 'menu_orders' }, { text: '💳 Баланс', callback_data: 'menu_balance' }],
        [{ text: '🧠 Подбор чая', callback_data: 'menu_quiz' }, { text: '💬 Поддержка', callback_data: 'menu_support' }]
      ]
    }
  };
}

async function getOrCreateTgUser(chatId, name) {
  const email = `tg_${chatId}@fateleaf.local`;
  let user = await User.findOne({ email });
  if (!user) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(chatId.toString(), salt);
    user = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
      role: 'user',
      telegramChatId: chatId.toString()
    });
  } else if (!user.telegramChatId) {
    user.telegramChatId = chatId.toString();
    await user.save();
  }
  return user;
}

if (token && token !== 'your_telegram_bot_token') {
  bot = new TelegramBot(token, { polling: true });
  console.log('Telegram Bot (Native Ordering) is running...');

  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const session = getSession(chatId);
    session.state = 'IDLE';
    
    bot.sendMessage(
      chatId, 
      `Привет, ${msg.from.first_name || 'друг'}! 🌿\nДобро пожаловать в FateLeaf.\nЗдесь вы можете заказать лучший премиальный чай.`,
      renderMainMenu()
    );
  });

  bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;
    const messageId = query.message.message_id;
    const session = getSession(chatId);

    try {
      if (data === 'menu_catalog') {
        const categories = await Product.distinct('category');
        const buttons = categories.map(cat => [{ text: cat, callback_data: `cat_${cat}` }]);
        buttons.push([{ text: '🔙 Назад', callback_data: 'main_menu' }]);

        await bot.editMessageText('Выберите категорию:', {
          chat_id: chatId,
          message_id: messageId,
          reply_markup: { inline_keyboard: buttons }
        });
        bot.answerCallbackQuery(query.id);
      }

      else if (data === 'main_menu') {
        session.state = 'IDLE';
        await bot.editMessageText('Главное меню:', {
          chat_id: chatId,
          message_id: messageId,
          ...renderMainMenu()
        });
        bot.answerCallbackQuery(query.id);
      }

      else if (data.startsWith('cat_')) {
        const category = data.substring(4);
        const products = await Product.find({ category });
        if (products.length === 0) {
          bot.answerCallbackQuery(query.id, { text: 'В этой категории пока нет товаров.', show_alert: true });
          return;
        }

        session.category = category;
        session.products = products;
        session.currentIndex = 0;
        
        await sendProduct(chatId, session, query.id);
        // We delete the category list message to send a photo message
        bot.deleteMessage(chatId, messageId).catch(()=>{});
      }

      else if (data === 'nav_next') {
        if (session.currentIndex < session.products.length - 1) {
          session.currentIndex++;
          await updateProductMessage(chatId, messageId, session, query.id);
        } else {
          bot.answerCallbackQuery(query.id);
        }
      }

      else if (data === 'nav_prev') {
        if (session.currentIndex > 0) {
          session.currentIndex--;
          await updateProductMessage(chatId, messageId, session, query.id);
        } else {
          bot.answerCallbackQuery(query.id);
        }
      }

      else if (data === 'add_to_cart') {
        const product = session.products[session.currentIndex];
        const existingItem = session.cart.find(item => item.product._id.toString() === product._id.toString());
        if (existingItem) {
          existingItem.qty++;
        } else {
          session.cart.push({ product, qty: 1 });
        }
        bot.answerCallbackQuery(query.id, { text: `✅ ${product.name} добавлен в корзину!`, show_alert: false });
      }

      else if (data === 'menu_orders') {
        const user = await getOrCreateTgUser(chatId, query.from.first_name);
        const orders = await Order.find({ user: user._id }).sort({ createdAt: -1 }).limit(5);

        if (orders.length === 0) {
          bot.answerCallbackQuery(query.id, { text: 'У вас пока нет заказов.', show_alert: true });
          return;
        }

        let text = '📦 **Ваши последние заказы:**\n\n';
        orders.forEach((o, i) => {
          let status = 'В обработке';
          if (o.isDelivered) status = '✅ Доставлен';
          else if (o.isCancelled) status = '❌ Отменен';
          
          text += `**Заказ #${o._id.toString().slice(-6).toUpperCase()}** от ${new Date(o.createdAt).toLocaleDateString('ru-RU')}\n`;
          text += `Сумма: ${o.totalPrice} ₽\nСтатус: ${status}\n\n`;
        });

        const buttons = [[{ text: '🔙 Главное меню', callback_data: 'main_menu' }]];

        try {
          await bot.editMessageText(text, {
            chat_id: chatId, message_id: messageId, parse_mode: 'Markdown',
            reply_markup: { inline_keyboard: buttons }
          });
        } catch (e) {
          bot.deleteMessage(chatId, messageId).catch(()=>{});
          bot.sendMessage(chatId, text, {
            parse_mode: 'Markdown', reply_markup: { inline_keyboard: buttons }
          });
        }
        bot.answerCallbackQuery(query.id);
      }

      else if (data === 'menu_cart') {
        if (session.cart.length === 0) {
          bot.answerCallbackQuery(query.id, { text: 'Ваша корзина пуста!', show_alert: true });
          return;
        }

        let text = '🛒 **Ваша корзина:**\n\n';
        let total = 0;
        session.cart.forEach((item, index) => {
          const sum = item.qty * item.product.price;
          total += sum;
          text += `${index + 1}. ${item.product.name} (x${item.qty}) - ${sum} ₽\n`;
        });
        text += `\n**Итого: ${total} ₽**`;

        const buttons = [
          [{ text: '✅ Оформить заказ', callback_data: 'checkout_start' }],
          [{ text: '🗑 Очистить корзину', callback_data: 'cart_clear' }],
          [{ text: '🔙 Главное меню', callback_data: 'main_menu' }]
        ];

        // Delete photo message if coming from product view, or edit text
        try {
          await bot.editMessageText(text, {
            chat_id: chatId,
            message_id: messageId,
            parse_mode: 'Markdown',
            reply_markup: { inline_keyboard: buttons }
          });
        } catch (e) {
          bot.deleteMessage(chatId, messageId).catch(()=>{});
          bot.sendMessage(chatId, text, {
            parse_mode: 'Markdown',
            reply_markup: { inline_keyboard: buttons }
          });
        }
        bot.answerCallbackQuery(query.id);
      }

      else if (data === 'cart_clear') {
        session.cart = [];
        bot.answerCallbackQuery(query.id, { text: 'Корзина очищена' });
        bot.editMessageText('Корзина пуста. Возвращаемся в меню...', {
          chat_id: chatId, message_id: messageId, ...renderMainMenu()
        });
      }

      else if (data === 'checkout_start') {
        session.state = 'CHECKOUT_NAME';
        bot.answerCallbackQuery(query.id);
        bot.sendMessage(chatId, 'Отлично! Давайте оформим заказ.\n\nВведите ваше **ФИО**:', { parse_mode: 'Markdown' });
      }

      else if (data === 'menu_balance') {
        const user = await getOrCreateTgUser(chatId, query.from.first_name);
        bot.answerCallbackQuery(query.id);
        bot.sendMessage(chatId, `🍃 **Ваш баланс:** ${user.teaPoints || 0} Чайных баллов.\n\nИспользуйте их для оплаты до 50% от стоимости заказа на сайте!`, { parse_mode: 'Markdown', reply_markup: { inline_keyboard: [[{ text: '🔙 Назад', callback_data: 'main_menu' }]] } });
      }

      else if (data === 'menu_quiz') {
        bot.answerCallbackQuery(query.id);
        bot.sendMessage(chatId, 'Какой эффект от чая вы ищете?', {
          reply_markup: {
            inline_keyboard: [
              [{ text: '⚡ Бодрость', callback_data: 'quiz_effect_energy' }, { text: '🧘 Расслабление', callback_data: 'quiz_effect_relax' }],
              [{ text: '🌟 Баланс и Гармония', callback_data: 'quiz_effect_balance' }]
            ]
          }
        });
      }

      else if (data.startsWith('quiz_effect_')) {
        bot.answerCallbackQuery(query.id);
        bot.sendMessage(chatId, 'Отлично! А какие ноты вкуса предпочитаете?', {
          reply_markup: {
            inline_keyboard: [
              [{ text: '🌸 Цветочные', callback_data: 'quiz_final' }, { text: '🌲 Древесные / Землистые', callback_data: 'quiz_final' }],
              [{ text: '🌿 Травянистые', callback_data: 'quiz_final' }]
            ]
          }
        });
      }

      else if (data === 'quiz_final') {
        bot.answerCallbackQuery(query.id);
        // Simple mock recommendation
        const products = await Product.find({}).limit(2);
        let text = 'Вот идеальные сорта чая для вас:\n\n';
        products.forEach(p => text += `🍵 **${p.name}** - ${p.price} ₽\n`);
        bot.sendMessage(chatId, text, { parse_mode: 'Markdown', ...renderMainMenu() });
      }

      else if (data === 'menu_support') {
        session.state = 'SUPPORT';
        bot.answerCallbackQuery(query.id);
        bot.sendMessage(chatId, 'Напишите ваш вопрос, и наш менеджер ответит вам в ближайшее время:', { reply_markup: { inline_keyboard: [[{ text: 'Отмена', callback_data: 'main_menu' }]] } });
      }

    } catch (err) {
      console.error(err);
      bot.answerCallbackQuery(query.id, { text: 'Произошла ошибка :(' });
    }
  });

  bot.onText(/\/trigger_reminder/, (msg) => {
    bot.sendMessage(msg.chat.id, "🍃 Здравствуйте! Ваш любимый чай, кажется, заканчивается. Не хотите ли повторить прошлый заказ со скидкой 10%?", {
      reply_markup: {
        inline_keyboard: [[{ text: '🛒 Повторить заказ', callback_data: 'menu_catalog' }]]
      }
    });
  });

  bot.on('message', async (msg) => {
    if (msg.text === '/start' || msg.text === '/trigger_reminder' || !msg.text) return;
    const chatId = msg.chat.id;
    const session = getSession(chatId);

    if (session.state === 'SUPPORT') {
      bot.sendMessage(chatId, "Спасибо за обращение! Наши менеджеры уже получили ваше сообщение и скоро с вами свяжутся.", renderMainMenu());
      session.state = 'IDLE';
    }
    else if (session.state === 'CHECKOUT_NAME') {
      session.checkoutData.name = msg.text;
      session.state = 'CHECKOUT_PHONE';
      bot.sendMessage(chatId, 'Принято. Теперь введите ваш **номер телефона** (например, +79991234567):', { parse_mode: 'Markdown' });
    } 
    else if (session.state === 'CHECKOUT_PHONE') {
      session.checkoutData.phone = msg.text;
      session.state = 'CHECKOUT_ADDRESS';
      bot.sendMessage(chatId, 'Почти готово! Введите **адрес доставки** (город, улица, дом, квартира):', { parse_mode: 'Markdown' });
    }
    else if (session.state === 'CHECKOUT_ADDRESS') {
      session.checkoutData.address = msg.text;
      session.state = 'IDLE';

      bot.sendMessage(chatId, '⏳ Создаю заказ...');

      try {
        const user = await getOrCreateTgUser(chatId, session.checkoutData.name);
        
        const orderItems = session.cart.map(item => ({
          name: item.product.name,
          qty: item.qty,
          image: (item.product.images && item.product.images.length > 0) ? item.product.images[0] : '/images/placeholder.jpg',
          price: item.product.price,
          product: item.product._id
        }));

        const totalPrice = orderItems.reduce((acc, item) => acc + item.price * item.qty, 0);

        const order = new Order({
          user: user._id,
          orderItems,
          shippingAddress: {
            address: session.checkoutData.address,
            city: 'Telegram',
            postalCode: '000000',
            country: 'RU'
          },
          paymentMethod: 'Наличными при получении',
          totalPrice,
          isPaid: false,
          isDelivered: false
        });

        const createdOrder = await order.save();
        session.cart = []; // clear cart
        
        bot.sendMessage(chatId, `🎉 **Заказ #${createdOrder._id.toString().substring(18)} успешно оформлен!**\n\nСумма к оплате: ${totalPrice} ₽.\nНаш менеджер свяжется с вами по номеру ${session.checkoutData.phone} для подтверждения доставки.\n\nСпасибо за покупку! 🍵`, {
          parse_mode: 'Markdown',
          ...renderMainMenu()
        });

      } catch (err) {
        console.error('Order creation error:', err);
        bot.sendMessage(chatId, '❌ Произошла ошибка при создании заказа. Пожалуйста, попробуйте позже.', renderMainMenu());
      }
    }
    else {
      bot.sendMessage(chatId, 'Используйте кнопки меню для навигации.', renderMainMenu());
    }
  });

  // Helper function to generate caption
  function getProductCaption(product, index, total) {
    return `✨ **${product.name}** ✨\n\n💰 Цена: ${product.price} ₽ ${product.oldPrice ? `(~${product.oldPrice} ₽~)` : ''}\n📦 В наличии: ${product.countInStock > 0 ? 'Да' : 'Нет'}\n\n${product.description ? product.description.substring(0, 150) + '...' : ''}\n\nТовар ${index + 1} из ${total}`;
  }

  // Helper function to generate inline keyboard for product
  function getProductKeyboard(index, total) {
    const navButtons = [];
    if (index > 0) navButtons.push({ text: '⬅️ Пред', callback_data: 'nav_prev' });
    navButtons.push({ text: '🛒 В корзину', callback_data: 'add_to_cart' });
    if (index < total - 1) navButtons.push({ text: 'След ➡️', callback_data: 'nav_next' });

    return {
      inline_keyboard: [
        navButtons,
        [{ text: '🔙 К категориям', callback_data: 'menu_catalog' }]
      ]
    };
  }

  async function sendProduct(chatId, session, queryId) {
    const product = session.products[session.currentIndex];
    const caption = getProductCaption(product, session.currentIndex, session.products.length);
    const reply_markup = getProductKeyboard(session.currentIndex, session.products.length);

    let imageUrl = product.images && product.images.length > 0 ? product.images[0] : null;
    if (imageUrl && !imageUrl.startsWith('http')) {
      imageUrl = `${API_URL}${imageUrl}`;
    }

    try {
      if (imageUrl) {
        await bot.sendPhoto(chatId, imageUrl, { caption, parse_mode: 'Markdown', reply_markup });
      } else {
        await bot.sendMessage(chatId, caption, { parse_mode: 'Markdown', reply_markup });
      }
      bot.answerCallbackQuery(queryId);
    } catch (e) {
      console.error(e.message);
      // Fallback
      await bot.sendMessage(chatId, caption, { parse_mode: 'Markdown', reply_markup });
      bot.answerCallbackQuery(queryId);
    }
  }

  async function updateProductMessage(chatId, messageId, session, queryId) {
    const product = session.products[session.currentIndex];
    const caption = getProductCaption(product, session.currentIndex, session.products.length);
    const reply_markup = getProductKeyboard(session.currentIndex, session.products.length);

    let imageUrl = product.images && product.images.length > 0 ? product.images[0] : null;
    if (imageUrl && !imageUrl.startsWith('http')) {
      imageUrl = `${API_URL}${imageUrl}`;
    }

    try {
      if (imageUrl) {
        // Edit photo media
        await bot.editMessageMedia(
          { type: 'photo', media: imageUrl, caption, parse_mode: 'Markdown' },
          { chat_id: chatId, message_id: messageId, reply_markup }
        );
      } else {
        await bot.editMessageText(caption, { chat_id: chatId, message_id: messageId, parse_mode: 'Markdown', reply_markup });
      }
      bot.answerCallbackQuery(queryId);
    } catch (e) {
      console.error('Update message error:', e.message);
      // Usually fails if content is exactly the same, which shouldn't happen on page change
      bot.answerCallbackQuery(queryId);
    }
  }

} else {
  console.log('Telegram Bot Token not found. Bot is disabled.');
}

export default bot;
