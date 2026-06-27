import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Search, Users as UsersIcon, Shield, User as UserIcon, Trash2, 
  ChevronLeft, ChevronRight, X, Loader2, Eye, Tag, Phone, Key,
  MapPin, ShoppingBag, History, CheckCircle2, ShieldAlert
} from 'lucide-react';

const AdminUsers = () => {
  const { t, i18n } = useTranslation();
  const { userInfo } = useSelector((state) => state.auth);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [roleFilter, setRoleFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [tempPassword, setTempPassword] = useState('');

  const config = {
    headers: { Authorization: `Bearer ${userInfo?.token}` },
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', 15);
      if (roleFilter !== 'all') params.append('role', roleFilter);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());

      const { data } = await axios.get(`/api/users?${params.toString()}`, config);
      setUsers(data.users);
      setPages(data.pages);
      setTotal(data.total);
    } catch (err) {
      console.error(t('adminUsers.errorLoad'), err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, roleFilter]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchUsers();
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleRoleToggle = async (userId, currentRole) => {
    if (!window.confirm(`Изменить роль пользователя на ${currentRole === 'admin' ? t('adminUsers.roleUser') : 'Администратор'}?`)) return;
    
    setUpdatingId(userId);
    try {
      const newRole = currentRole === 'admin' ? 'user' : 'admin';
      const { data } = await axios.put(`/api/users/${userId}`, { role: newRole }, config);
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: data.role } : u));
    } catch (err) {
      console.error(t('adminUsers.errorRole'), err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm(t('adminUsers.deleteUserConfirm'))) return;
    try {
      await axios.delete(`/api/users/${userId}`, config);
      setUsers(prev => prev.filter(u => u._id !== userId));
      setTotal(prev => prev - 1);
      if (selectedUser?._id === userId) setSelectedUser(null);
    } catch (err) {
      console.error(t('adminUsers.errorDelete'), err);
      alert(t('adminUsers.errorDeleteAlert'));
    }
  };

  const handleResetPassword = async (userId) => {
    if (!window.confirm(`${t('adminUsers.generatePassword')} для этого пользователя?`)) return;
    try {
      const { data } = await axios.post(`/api/users/${userId}/reset-password`, {}, config);
      setTempPassword(data.tempPassword);
    } catch (err) {
      console.error(t('adminUsers.errorReset'), err);
      alert(t('adminUsers.errorResetAlert'));
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat(i18n.language === 'ru' ? 'ru-RU' : 'en-US').format(price) + ' ' + (i18n.language === 'uz' ? "so'm" : (i18n.language === 'en' ? 'rub' : '₽'));
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(i18n.language === 'ru' ? 'ru-RU' : 'en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <h1 className="text-3xl font-bold mb-2 text-tea-dark dark:text-tea-light">{t('adminUsers.title')}</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">{t('adminUsers.foundUsers').replace('{{total}}', total)}</p>

      {/* Верхняя панель: Фильтры + Поиск */}
      <div className="bg-white dark:bg-[#23312B] rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-[#3A5243] p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Поиск */}
          <div className="relative flex-grow max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t('adminUsers.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-[#1A2421] border border-gray-200 dark:border-[#3A5243] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-tea-gold/40 focus:border-tea-gold transition"
            />
          </div>

          {/* Фильтры ролей */}
          <div className="flex bg-gray-100 p-1 rounded-xl">
            {[
              { key: 'all', label: t('adminUsers.filterAll') },
              { key: 'user', label: t('adminUsers.filterUsers') },
              { key: 'admin', label: t('adminUsers.filterAdmins') },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => { setRoleFilter(f.key); setPage(1); }}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                  roleFilter === f.key
                    ? 'bg-white dark:bg-[#23312B] shadow-sm text-tea-dark dark:text-tea-light'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:text-gray-300'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Таблица пользователей */}
      <div className="bg-white dark:bg-[#23312B] rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-[#3A5243] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-tea-gold" />
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <UsersIcon size={48} className="mb-4 opacity-40" />
            <p className="text-lg font-medium">{t('adminUsers.notFound')}</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-[#3A5243] bg-gray-50 dark:bg-[#1A2421]/50">
                    <th className="text-left px-6 py-3.5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('adminUsers.colClient')}</th>
                    <th className="text-left px-6 py-3.5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('adminUsers.colContacts')}</th>
                    <th className="text-center px-6 py-3.5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('adminUsers.colRole')}</th>
                    <th className="text-center px-6 py-3.5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('adminUsers.colOrders')}</th>
                    <th className="text-right px-6 py-3.5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('adminUsers.colTotalSpent')}</th>
                    <th className="text-left px-6 py-3.5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('adminUsers.colRegistration')}</th>
                    <th className="text-center px-6 py-3.5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('adminUsers.colActions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-tea-light dark:bg-[#1A2421]/20 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-tea-light dark:bg-[#1A2421] text-tea-dark dark:text-tea-light flex items-center justify-center font-bold">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-tea-dark dark:text-tea-light">{user.name}</p>
                            {user.tags && user.tags.length > 0 && (
                              <div className="flex gap-1 mt-1">
                                {user.tags.map(tag => (
                                  <span key={tag} className="text-[10px] bg-gray-100 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded uppercase font-bold">{tag}</span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                        {user.phone && <p className="text-xs text-gray-400 mt-0.5">{user.phone}</p>}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${
                          user.role === 'admin' 
                            ? 'bg-red-50 text-red-600 border-red-100' 
                            : 'bg-green-50 text-green-600 border-green-100'
                        }`}>
                          {user.role === 'admin' ? <ShieldAlert size={13} /> : <UserIcon size={13} />}
                          {user.role === 'admin' ? t('adminUsers.roleAdmin') : t('adminUsers.roleUser')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-bold text-tea-dark dark:text-tea-light">{user.orderCount || 0}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-bold text-tea-dark dark:text-tea-light">{formatPrice(user.totalSpent || 0)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">{formatDate(user.createdAt)}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => { setSelectedUser(user); setTempPassword(''); }}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-tea-light dark:bg-[#1A2421] text-gray-500 dark:text-gray-400 hover:text-tea-dark dark:text-tea-light transition"
                            title={t('adminUsers.actionDossier')}
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleRoleToggle(user._id, user.role)}
                            disabled={updatingId === user._id || user._id === userInfo._id}
                            className={`w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 transition ${
                              user._id === userInfo._id ? 'opacity-30 cursor-not-allowed' : 'hover:bg-blue-50 text-gray-500 dark:text-gray-400 hover:text-blue-500'
                            }`}
                            title={t('adminUsers.actionChangeRole')}
                          >
                            <Shield size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            disabled={user._id === userInfo._id}
                            className={`w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 transition ${
                              user._id === userInfo._id ? 'opacity-30 cursor-not-allowed' : 'hover:bg-red-50 text-gray-500 dark:text-gray-400 hover:text-red-500'
                            }`}
                            title={t('adminUsers.actionDelete')}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Пагинация */}
            {pages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-[#3A5243] bg-gray-50 dark:bg-[#1A2421]/30">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('adminUsers.pageOf').replace('{{page}}', page).replace('{{pages}}', pages)}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                    className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-[#3A5243] bg-white dark:bg-[#23312B] hover:bg-gray-50 dark:bg-[#1A2421] text-gray-600 dark:text-gray-400 disabled:opacity-40 transition"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => setPage(prev => Math.min(prev + 1, pages))}
                    disabled={page === pages}
                    className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-[#3A5243] bg-white dark:bg-[#23312B] hover:bg-gray-50 dark:bg-[#1A2421] text-gray-600 dark:text-gray-400 disabled:opacity-40 transition"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Модальное окно "Досье клиента" */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-[#23312B] rounded-3xl shadow-2xl w-full max-w-2xl relative max-h-[90vh] overflow-y-auto"
            >
              {/* Заголовок модалки */}
              <div className="sticky top-0 bg-white dark:bg-[#23312B] rounded-t-3xl border-b border-gray-100 dark:border-[#3A5243] px-6 py-5 flex items-center justify-between z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-tea-light dark:bg-[#1A2421] text-tea-dark dark:text-tea-light flex items-center justify-center font-bold text-xl">
                    {selectedUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-tea-dark dark:text-tea-light">{selectedUser.name}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('adminUsers.regDate')} {formatDate(selectedUser.createdAt)}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 dark:text-gray-400 transition"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                
                {/* Аналитика и покупки */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-[#1A2421] rounded-2xl p-4 border border-gray-100 dark:border-[#3A5243]">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Заказов</p>
                    <p className="text-2xl font-bold text-tea-dark dark:text-tea-light">{selectedUser.orderCount || 0}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-[#1A2421] rounded-2xl p-4 border border-gray-100 dark:border-[#3A5243]">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">{t('adminUsers.colTotalSpent')}</p>
                    <p className="text-2xl font-bold text-tea-dark dark:text-tea-light">{formatPrice(selectedUser.totalSpent || 0)}</p>
                  </div>
                </div>

                {/* Контакты и связь */}
                <div className="bg-gray-50 dark:bg-[#1A2421] rounded-2xl p-5 border border-gray-100 dark:border-[#3A5243] space-y-4">
                  <h3 className="text-sm font-bold text-tea-dark dark:text-tea-light uppercase tracking-wider">{t('adminUsers.communication')}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white dark:bg-[#23312B] border border-gray-200 dark:border-[#3A5243] flex items-center justify-center text-gray-400">
                        <Phone size={14} />
                      </div>
                      <span className="text-sm font-medium">{selectedUser.phone || t('adminUsers.phoneNotSpecified')}</span>
                      {selectedUser.phone && (
                        <a 
                          href={`https://wa.me/${selectedUser.phone.replace(/[^0-9]/g, '')}`} 
                          target="_blank" rel="noreferrer"
                          className="ml-auto text-xs font-bold text-green-600 hover:underline"
                        >
                          {t('adminUsers.whatsapp')}
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white dark:bg-[#23312B] border border-gray-200 dark:border-[#3A5243] flex items-center justify-center text-gray-400">
                        <span className="text-xs font-bold">@</span>
                      </div>
                      <span className="text-sm font-medium">{selectedUser.email}</span>
                    </div>
                  </div>
                </div>

                {/* {t('adminUsers.security')} */}
                <div className="bg-red-50 rounded-2xl p-5 border border-red-100">
                  <div className="flex items-center gap-2 mb-3">
                    <ShieldAlert size={18} className="text-red-500" />
                    <h3 className="text-sm font-bold text-red-700 uppercase tracking-wider">{t('adminUsers.security')}</h3>
                  </div>
                  <button 
                    onClick={() => handleResetPassword(selectedUser._id)}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#23312B] text-red-600 border border-red-200 rounded-lg hover:bg-red-100 text-sm font-bold transition"
                  >
                    <Key size={16} /> {t('adminUsers.generatePassword')}
                  </button>
                  {tempPassword && (
                    <div className="mt-3 p-3 bg-white dark:bg-[#23312B] border border-red-200 rounded-lg text-sm">
                      {t('adminUsers.newPasswordPrefix')} <span className="font-mono font-bold text-lg ml-2 bg-gray-100 px-2 py-1 rounded">{tempPassword}</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('adminUsers.sendPasswordHint')}</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="px-6 py-3 bg-tea-dark hover:bg-tea-gold text-white font-bold rounded-xl transition shadow-md dark:shadow-black/40"
                  >
                    {t('adminUsers.closeDossier')}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminUsers;
