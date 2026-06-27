import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight, X,
  Package, Truck, CheckCircle2, XCircle, Eye, Trash2, Loader2, MapPin, CreditCard, Clock
} from 'lucide-react';






const AdminOrders = () => {
  const { t, i18n } = useTranslation();

  const STATUS_MAP = {
    processing: { label: t('adminOrders.filterProcessing'), color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Clock },
    delivered: { label: t('adminOrders.filterDelivered'), color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle2 },
    cancelled: { label: t('adminOrders.filterCancelled'), color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle },
  };

  const getOrderStatus = (order) => {
    if (order.isCancelled) return 'cancelled';
    if (order.isDelivered) return 'delivered';
    return 'processing';
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat(i18n.language === 'ru' ? i18n.language === 'ru' ? 'ru-RU' : 'en-US' : 'en-US').format(price) + ' ' + (i18n.language === 'uz' ? "so'm" : (i18n.language === 'en' ? 'rub' : '₽'));
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(i18n.language === 'ru' ? i18n.language === 'ru' ? 'ru-RU' : 'en-US' : 'en-US', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
      ', ' + d.toLocaleTimeString(i18n.language === 'ru' ? i18n.language === 'ru' ? 'ru-RU' : 'en-US' : 'en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatShortId = (id) => {
    return '#FL-' + id.slice(-6).toUpperCase();
  };
  const { userInfo } = useSelector((state) => state.auth);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const config = {
    headers: { Authorization: `Bearer ${userInfo?.token}` },
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', 15);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      if (sortOrder === 'oldest') params.append('sort', 'oldest');

      const { data } = await axios.get(`/api/orders?${params.toString()}`, config);
      setOrders(data.orders);
      setPages(data.pages);
      setTotal(data.total);
    } catch (err) {
      console.error('Ошибка загрузки заказов:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter, sortOrder]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchOrders();
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const { data } = await axios.put(`/api/orders/${orderId}`, { status: newStatus }, config);
      setOrders(prev => prev.map(o => o._id === orderId ? data : o));
      if (selectedOrder?._id === orderId) setSelectedOrder(data);
    } catch (err) {
      console.error('Ошибка обновления статуса:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm(t('adminOrders.deleteConfirm'))) return;
    try {
      await axios.delete(`/api/orders/${orderId}`, config);
      setOrders(prev => prev.filter(o => o._id !== orderId));
      if (selectedOrder?._id === orderId) setSelectedOrder(null);
      setTotal(prev => prev - 1);
    } catch (err) {
      console.error('Ошибка удаления заказа:', err);
    }
  };

  const filters = [
    { key: 'all', label: t('adminOrders.filterAll') },
    { key: 'processing', label: t('adminOrders.filterProcessing') },
    { key: 'delivered', label: t('adminOrders.filterDelivered') },
    { key: 'cancelled', label: t('adminOrders.filterCancelled') },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2 text-tea-dark dark:text-tea-light">{t('adminOrders.title')}</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">{t('adminOrders.totalOrders')}: {total}</p>

      {/* Верхняя панель: Фильтры + Поиск */}
      <div className="bg-white dark:bg-[#23312B] rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-[#3A5243] p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Поиск */}
          <div className="relative flex-grow max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t('adminOrders.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-[#1A2421] border border-gray-200 dark:border-[#3A5243] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-tea-gold/40 focus:border-tea-gold transition"
            />
          </div>

          {/* Фильтры по статусу */}
          <div className="flex bg-gray-100 p-1 rounded-xl">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => { setStatusFilter(f.key); setPage(1); }}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                  statusFilter === f.key
                    ? 'bg-white dark:bg-[#23312B] shadow-sm text-tea-dark dark:text-tea-light'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:text-gray-300'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Сортировка */}
          <button
            onClick={() => setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-[#1A2421] border border-gray-200 dark:border-[#3A5243] rounded-xl text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 transition"
          >
            <ArrowUpDown size={16} />
            {sortOrder === 'newest' ? t('adminOrders.sortNewest') : t('adminOrders.sortOldest')}
          </button>
        </div>
      </div>

      {/* Таблица заказов */}
      <div className="bg-white dark:bg-[#23312B] rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-[#3A5243] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-tea-gold" />
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Package size={48} className="mb-4 opacity-40" />
            <p className="text-lg font-medium">{t('adminOrders.notFound')}</p>
            <p className="text-sm mt-1">{t('adminOrders.tryFilters')}</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-[#3A5243] bg-gray-50 dark:bg-[#1A2421]/50">
                    <th className="text-left px-6 py-3.5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('adminOrders.colId')}</th>
                    <th className="text-left px-6 py-3.5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('adminOrders.colDate')}</th>
                    <th className="text-left px-6 py-3.5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('adminOrders.colClient')}</th>
                    <th className="text-left px-6 py-3.5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('adminOrders.colItems')}</th>
                    <th className="text-right px-6 py-3.5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('adminOrders.colAmount')}</th>
                    <th className="text-center px-6 py-3.5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('adminOrders.colStatus')}</th>
                    <th className="text-center px-6 py-3.5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('adminOrders.colActions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => {
                    const status = getOrderStatus(order);
                    const statusInfo = STATUS_MAP[status];
                    const StatusIcon = statusInfo.icon;
                    return (
                      <tr
                        key={order._id}
                        className="hover:bg-tea-light dark:bg-[#1A2421]/20 transition cursor-pointer"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <td className="px-6 py-4">
                          <span className="font-mono font-bold text-tea-dark dark:text-tea-light text-sm">{formatShortId(order._id)}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600 dark:text-gray-400">{formatDate(order.createdAt)}</span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-tea-dark dark:text-tea-light">{order.user?.name || t('adminOrders.unknown')}</p>
                          <p className="text-xs text-gray-400">{order.user?.email || ''}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5">
                            {order.orderItems.slice(0, 3).map((item, idx) => (
                              <div key={idx} className="w-8 h-8 rounded-lg border border-gray-200 dark:border-[#3A5243] overflow-hidden flex-shrink-0 bg-gray-50 dark:bg-[#1A2421]">
                                <img src={item.image || '/placeholder.svg'} alt={item.name} className="w-full h-full object-cover" />
                              </div>
                            ))}
                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                              {order.orderItems.reduce((acc, i) => acc + i.qty, 0)} {t('adminOrders.pcs')}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="font-bold text-tea-dark dark:text-tea-light text-sm">{formatPrice(order.totalPrice)}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${statusInfo.color}`}>
                            <StatusIcon size={13} />
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-tea-light dark:bg-[#1A2421] text-gray-500 dark:text-gray-400 hover:text-tea-dark dark:text-tea-light transition"
                              title={t('adminOrders.details')}
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteOrder(order._id)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-red-50 text-gray-500 dark:text-gray-400 hover:text-red-500 transition"
                              title={t('adminOrders.delete')}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Пагинация */}
            {pages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-[#3A5243] bg-gray-50 dark:bg-[#1A2421]/30">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('adminOrders.pageOf').replace('{{page}}', page).replace('{{pages}}', pages).replace('{{total}}', total)}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                    className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-[#3A5243] bg-white dark:bg-[#23312B] hover:bg-gray-50 dark:bg-[#1A2421] text-gray-600 dark:text-gray-400 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  {Array.from({ length: Math.min(pages, 5) }, (_, i) => {
                    let pageNum;
                    if (pages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= pages - 2) {
                      pageNum = pages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition ${
                          page === pageNum
                            ? 'bg-tea-dark text-white'
                            : 'border border-gray-200 dark:border-[#3A5243] bg-white dark:bg-[#23312B] hover:bg-gray-50 dark:bg-[#1A2421] text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setPage(prev => Math.min(prev + 1, pages))}
                    disabled={page === pages}
                    className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-[#3A5243] bg-white dark:bg-[#23312B] hover:bg-gray-50 dark:bg-[#1A2421] text-gray-600 dark:text-gray-400 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Модальное окно «Детали заказа» */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-[#23312B] rounded-3xl shadow-2xl w-full max-w-2xl relative max-h-[90vh] overflow-y-auto"
            >
              {/* Заголовок модалки */}
              <div className="sticky top-0 bg-white dark:bg-[#23312B] rounded-t-3xl border-b border-gray-100 dark:border-[#3A5243] px-6 py-5 flex items-center justify-between z-10">
                <div>
                  <h2 className="text-xl font-bold text-tea-dark dark:text-tea-light">
                    {t('adminOrders.orderTitle')} {formatShortId(selectedOrder._id)}
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">{formatDate(selectedOrder.createdAt)}</p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 dark:text-gray-400 transition"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Статус + Управление */}
                <div className="bg-gray-50 dark:bg-[#1A2421] rounded-2xl p-5 border border-gray-100 dark:border-[#3A5243]">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-3">{t('adminOrders.statusLabel')}</p>
                  <div className="flex items-center gap-3">
                    {['processing', 'delivered', 'cancelled'].map((s) => {
                      const info = STATUS_MAP[s];
                      const Icon = info.icon;
                      const isCurrent = getOrderStatus(selectedOrder) === s;
                      return (
                        <button
                          key={s}
                          onClick={() => handleStatusChange(selectedOrder._id, s)}
                          disabled={updatingId === selectedOrder._id}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border-2 transition ${
                            isCurrent
                              ? `${info.color} border-current`
                              : 'border-gray-200 dark:border-[#3A5243] bg-white dark:bg-[#23312B] text-gray-400 hover:border-gray-300 hover:text-gray-600 dark:text-gray-400'
                          } ${updatingId === selectedOrder._id ? 'opacity-50 cursor-wait' : ''}`}
                        >
                          <Icon size={16} />
                          {info.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Клиент */}
                <div className="bg-gray-50 dark:bg-[#1A2421] rounded-2xl p-5 border border-gray-100 dark:border-[#3A5243]">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-3">{t('adminOrders.colClient')}</p>
                  <p className="text-base font-bold text-tea-dark dark:text-tea-light">{selectedOrder.user?.name || t('adminOrders.unknown')}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{selectedOrder.user?.email || ''}</p>
                </div>

                {/* Адрес доставки */}
                <div className="bg-gray-50 dark:bg-[#1A2421] rounded-2xl p-5 border border-gray-100 dark:border-[#3A5243]">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-3">{t('adminOrders.shippingAddress')}</p>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-tea-light dark:bg-[#1A2421] rounded-lg flex items-center justify-center text-tea-dark dark:text-tea-light flex-shrink-0 mt-0.5">
                      <MapPin size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-tea-dark dark:text-tea-light">{selectedOrder.shippingAddress?.address}</p>
                      <p className="text-xs text-gray-400">
                        {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.country}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Способ оплаты */}
                <div className="bg-gray-50 dark:bg-[#1A2421] rounded-2xl p-5 border border-gray-100 dark:border-[#3A5243]">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-3">{t('adminOrders.paymentLabel')}</p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500 flex-shrink-0">
                      <CreditCard size={16} />
                    </div>
                    <p className="text-sm font-medium text-tea-dark dark:text-tea-light">
                      {selectedOrder.paymentMethod === 'online' ? t('adminOrders.payOnline') : t('adminOrders.payOnDelivery')}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      selectedOrder.isPaid ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      {selectedOrder.isPaid ? 'Оплачен' : 'Не оплачен'}
                    </span>
                  </div>
                </div>

                {/* Состав заказа */}
                <div className="bg-gray-50 dark:bg-[#1A2421] rounded-2xl p-5 border border-gray-100 dark:border-[#3A5243]">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-4">
                    {t('adminOrders.orderContents')} ({selectedOrder.orderItems.reduce((a, i) => a + i.qty, 0)} {t('adminOrders.pcs')})
                  </p>
                  <div className="space-y-3">
                    {selectedOrder.orderItems.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 bg-white dark:bg-[#23312B] rounded-xl p-3 border border-gray-100 dark:border-[#3A5243]">
                        <div className="w-14 h-14 rounded-xl overflow-hidden border border-gray-200 dark:border-[#3A5243] flex-shrink-0 bg-white dark:bg-[#23312B]">
                          <img src={item.image || '/placeholder.svg'} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-grow min-w-0">
                          <p className="text-sm font-bold text-tea-dark dark:text-tea-light truncate">{item.name}</p>
                          <p className="text-xs text-gray-400">{item.qty} × {formatPrice(item.price)}</p>
                        </div>
                        <p className="text-sm font-bold text-tea-dark dark:text-tea-light flex-shrink-0">
                          {formatPrice(item.qty * item.price)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Итого */}
                <div className="bg-tea-dark rounded-2xl p-5 text-white">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">{t('adminOrders.total')}</span>
                    <span className="text-2xl font-bold text-tea-gold">{formatPrice(selectedOrder.totalPrice)}</span>
                  </div>
                </div>

                {/* Кнопки действий */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleDeleteOrder(selectedOrder._id)}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-white dark:bg-[#23312B] border border-red-200 hover:bg-red-50 text-red-500 font-bold rounded-xl transition"
                  >
                    <Trash2 size={16} />
                    {t('adminOrders.deleteOrder')}
                  </button>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="flex-1 py-3.5 bg-tea-dark hover:bg-tea-gold text-white font-bold rounded-xl transition shadow-md dark:shadow-black/40"
                  >
                    {t('adminOrders.close')}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminOrders;
