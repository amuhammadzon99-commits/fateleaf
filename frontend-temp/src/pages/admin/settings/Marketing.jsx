import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Save, Loader2, Percent, Tag, Plus, Trash2, Send, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Marketing = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { t } = useTranslation();
  
  const [settings, setSettings] = useState({
    globalDiscountActive: false,
    globalDiscountPercent: 0,
    globalDiscountDescription: ''
  });
  
  const [coupons, setCoupons] = useState([]);
  const [newCoupon, setNewCoupon] = useState({ code: '', discountType: 'percent', discountValue: '', expiresAt: '' });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [sendingBroadcast, setSendingBroadcast] = useState(false);

  const fetchData = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const [settingsRes, couponsRes] = await Promise.all([
        axios.get('/api/settings'),
        axios.get('/api/coupons', config)
      ]);
      setSettings({
        globalDiscountActive: settingsRes.data.globalDiscountActive || false,
        globalDiscountPercent: settingsRes.data.globalDiscountPercent || 0,
        globalDiscountDescription: settingsRes.data.globalDiscountDescription || ''
      });
      setCoupons(couponsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const saveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });
    
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put('/api/settings', settings, config);
      setMessage({ text: t('adminSettings.marketingSec.success'), type: 'success' });
    } catch (err) {
      setMessage({ text: err.response?.data?.message || err.message, type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const sendBroadcast = async (e) => {
    e.preventDefault();
    if (!window.confirm('Вы уверены, что хотите отправить это сообщение всем пользователям Telegram бота?')) return;
    
    setSendingBroadcast(true);
    setMessage({ text: '', type: '' });
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.post('/api/settings/broadcast-telegram', { message: broadcastMessage }, config);
      setMessage({ text: data.message, type: 'success' });
      setBroadcastMessage('');
    } catch (err) {
      setMessage({ text: err.response?.data?.message || err.message, type: 'error' });
    } finally {
      setSendingBroadcast(false);
    }
  };

  const createCoupon = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.post('/api/coupons', newCoupon, config);
      setNewCoupon({ code: '', discountType: 'percent', discountValue: '', expiresAt: '' });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const deleteCoupon = async (id) => {
    if (window.confirm(t('adminSettings.marketingSec.deleteConfirm'))) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(`/api/coupons/${id}`, config);
        fetchData();
      } catch (err) {
        alert(err.response?.data?.message || err.message);
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="animate-spin text-tea-green w-8 h-8"/></div>;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white dark:bg-[#23312B] rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-100 dark:border-[#3A5243]/80 p-6 sm:p-8"
    >
      <motion.h2 variants={itemVariants} className="text-xl font-bold text-tea-dark dark:text-tea-light mb-6">
        {t('adminSettings.marketingSec.title')}
      </motion.h2>
      
      {message.text && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className={`p-4 rounded-xl mb-6 text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}
        >
          {message.text}
        </motion.div>
      )}

      {/* Global Discount */}
      <motion.form
        variants={itemVariants}
        onSubmit={saveSettings}
        className={`mb-10 max-w-2xl p-6 rounded-2xl border transition-all duration-300 ${settings.globalDiscountActive ? 'bg-pink-50 border-pink-200 shadow-[0_0_15px_rgba(236,72,153,0.08)]' : 'bg-gray-50 dark:bg-[#1A2421] border-gray-100 dark:border-[#3A5243]'}`}
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 className={`text-base font-bold flex items-center gap-2 transition-colors duration-300 ${settings.globalDiscountActive ? 'text-pink-800' : 'text-gray-700 dark:text-gray-300'}`}>
              <Percent size={18} /> {t('adminSettings.marketingSec.globalDiscount')}
            </h3>
            <p className={`text-sm mt-1 max-w-md transition-colors duration-300 ${settings.globalDiscountActive ? 'text-pink-600' : 'text-gray-500 dark:text-gray-400'}`}>
              {t('adminSettings.marketingSec.globalDiscountDesc')}
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer mt-1 flex-shrink-0">
            <input type="checkbox" name="globalDiscountActive" checked={settings.globalDiscountActive} onChange={handleSettingsChange} className="sr-only peer" />
            <div className="w-11 h-6 bg-pink-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:bg-[#23312B] after:border-pink-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
          </label>
        </div>
        
        <AnimatePresence>
          {settings.globalDiscountActive && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 overflow-hidden"
            >
              <div className="space-y-2">
                <label className="text-sm font-semibold text-pink-700">{t('adminSettings.marketingSec.discountPercent')}</label>
                <input type="number" name="globalDiscountPercent" value={settings.globalDiscountPercent || ''} onChange={handleSettingsChange} required
                  className="w-full bg-white dark:bg-[#23312B] border border-pink-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 transition" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-pink-700">{t('adminSettings.marketingSec.discountName')}</label>
                <input type="text" name="globalDiscountDescription" value={settings.globalDiscountDescription || ''} onChange={handleSettingsChange}
                  className="w-full bg-white dark:bg-[#23312B] border border-pink-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 transition" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="mt-6 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" disabled={saving} className="px-5 py-2 bg-pink-500 text-white text-sm font-medium rounded-xl hover:bg-pink-600 transition shadow flex items-center gap-2">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} {t('adminSettings.marketingSec.saveBtn')}
          </motion.button>
        </div>
      </motion.form>

      {/* Telegram Broadcast */}
      <motion.div variants={itemVariants} className="pt-6 border-t border-gray-100 dark:border-[#3A5243] mb-10">
        <h3 className="text-lg font-bold text-tea-dark dark:text-tea-light mb-4 flex items-center gap-2">
          <MessageCircle size={18} className="text-[#0088cc]" /> Рассылка в Telegram Бот
        </h3>
        <form onSubmit={sendBroadcast} className="bg-gray-50 dark:bg-[#1A2421] p-6 rounded-2xl border border-gray-100 dark:border-[#3A5243]">
          <div className="mb-4">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Текст сообщения (поддерживается Markdown)</label>
            <textarea
              required
              rows="4"
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              placeholder="Внимание, акция! Скидка 20% на весь зеленый чай..."
              className="w-full bg-white dark:bg-[#23312B] border border-gray-200 dark:border-[#3A5243] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0088cc] transition resize-none"
            />
          </div>
          <div className="flex justify-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" disabled={sendingBroadcast || !broadcastMessage.trim()}
              className="px-5 py-2 bg-[#0088cc] text-white text-sm font-medium rounded-xl hover:bg-[#0077b3] transition shadow flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              {sendingBroadcast ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />} Отправить всем
            </motion.button>
          </div>
        </form>
      </motion.div>

      {/* Coupons */}
      <motion.div variants={itemVariants} className="pt-6 border-t border-gray-100 dark:border-[#3A5243]">
        <h3 className="text-lg font-bold text-tea-dark dark:text-tea-light mb-4 flex items-center gap-2">
          <Tag size={18} className="text-gray-400" /> {t('adminSettings.marketingSec.couponTitle')}
        </h3>
        
        <form onSubmit={createCoupon} className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-8 bg-gray-50 dark:bg-[#1A2421] p-4 rounded-2xl items-end">
          <div className="space-y-1 sm:col-span-1">
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">{t('adminSettings.marketingSec.codeLabel')}</label>
            <input type="text" value={newCoupon.code} onChange={e=>setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})} required placeholder="TEA2026"
              className="w-full bg-white dark:bg-[#23312B] border border-gray-200 dark:border-[#3A5243] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-tea-green font-mono uppercase" />
          </div>
          <div className="space-y-1 sm:col-span-1">
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">{t('adminSettings.marketingSec.typeLabel')}</label>
            <select value={newCoupon.discountType} onChange={e=>setNewCoupon({...newCoupon, discountType: e.target.value})} className="w-full bg-white dark:bg-[#23312B] border border-gray-200 dark:border-[#3A5243] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-tea-green">
              <option value="percent">{t('adminSettings.marketingSec.typePercent')}</option>
              <option value="fixed">{t('adminSettings.marketingSec.typeFixed')}</option>
            </select>
          </div>
          <div className="space-y-1 sm:col-span-1">
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">{t('adminSettings.marketingSec.valueLabel')}</label>
            <input type="number" value={newCoupon.discountValue} onChange={e=>setNewCoupon({...newCoupon, discountValue: e.target.value})} required placeholder="10"
              className="w-full bg-white dark:bg-[#23312B] border border-gray-200 dark:border-[#3A5243] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-tea-green" />
          </div>
          <div className="space-y-1 sm:col-span-1">
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">{t('adminSettings.marketingSec.expiryLabel')}</label>
            <input type="date" value={newCoupon.expiresAt} onChange={e=>setNewCoupon({...newCoupon, expiresAt: e.target.value})} required
              className="w-full bg-white dark:bg-[#23312B] border border-gray-200 dark:border-[#3A5243] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-tea-green" />
          </div>
          <div className="sm:col-span-1">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit" className="w-full px-4 py-2.5 bg-tea-dark text-white font-medium text-sm rounded-lg hover:bg-tea-gold transition flex items-center justify-center gap-2 shadow">
              <Plus size={16} /> {t('adminSettings.marketingSec.createBtn')}
            </motion.button>
          </div>
        </form>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 dark:border-[#3A5243] text-xs text-gray-400 uppercase tracking-wider">
                <th className="pb-3 font-semibold">{t('adminSettings.marketingSec.thCode')}</th>
                <th className="pb-3 font-semibold">{t('adminSettings.marketingSec.thDiscount')}</th>
                <th className="pb-3 font-semibold">{t('adminSettings.marketingSec.thExpires')}</th>
                <th className="pb-3 font-semibold">{t('adminSettings.marketingSec.thUsed')}</th>
                <th className="pb-3 font-semibold">{t('adminSettings.marketingSec.thStatus')}</th>
                <th className="pb-3 font-semibold text-right">{t('adminSettings.marketingSec.thActions')}</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {coupons.map(coupon => (
                  <motion.tr
                    key={coupon._id}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="border-b border-gray-50 hover:bg-gray-50 dark:bg-[#1A2421]/50"
                  >
                    <td className="py-4 text-sm font-bold text-tea-dark dark:text-tea-light font-mono">{coupon.code}</td>
                    <td className="py-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                      {coupon.discountType === 'percent' ? `${coupon.discountValue}%` : `${coupon.discountValue} ₽`}
                    </td>
                    <td className="py-4 text-sm text-gray-500 dark:text-gray-400">{new Date(coupon.expiresAt).toLocaleDateString()}</td>
                    <td className="py-4 text-sm text-gray-500 dark:text-gray-400">{coupon.usageCount} {t('adminSettings.marketingSec.timesUsed')}</td>
                    <td className="py-4 text-sm">
                      {coupon.isActive ? <span className="text-green-600 bg-green-50 px-2 py-1 rounded-md text-xs font-bold">{t('adminSettings.marketingSec.statusActive')}</span> 
                                     : <span className="text-red-600 bg-red-50 px-2 py-1 rounded-md text-xs font-bold">{t('adminSettings.marketingSec.statusInactive')}</span>}
                    </td>
                    <td className="py-4 text-right">
                      <motion.button
                        whileHover={{ scale: 1.1, color: '#dc2626' }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => deleteCoupon(coupon._id)} className="text-red-400 p-2 rounded-lg hover:bg-red-50 transition">
                        <Trash2 size={16} />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {coupons.length === 0 && (
                <tr><td colSpan="6" className="text-center py-6 text-sm text-gray-400">{t('adminSettings.marketingSec.noCoupons')}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Marketing;
