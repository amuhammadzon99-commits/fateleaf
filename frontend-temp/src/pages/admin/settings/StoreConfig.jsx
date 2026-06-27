import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Save, Loader2, Store, Truck, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const StoreConfig = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { t } = useTranslation();
  
  const [settings, setSettings] = useState({
    deliveryCost: 0,
    freeDeliveryThreshold: 3000,
    supportPhone: '',
    workHours: '',
    maintenanceMode: false
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get('/api/settings');
        setSettings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });
    
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put('/api/settings', settings, config);
      setMessage({ text: t('adminSettings.storeSec.success'), type: 'success' });
    } catch (err) {
      setMessage({ text: err.response?.data?.message || err.message, type: 'error' });
    } finally {
      setSaving(false);
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
        {t('adminSettings.storeSec.title')}
      </motion.h2>
      
      {message.text && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className={`p-4 rounded-xl mb-6 text-sm font-medium ${
            message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
          }`}
        >
          {message.text}
        </motion.div>
      )}

      <form onSubmit={submitHandler} className="space-y-8 max-w-2xl">
        {/* Logistics */}
        <motion.div variants={itemVariants}>
          <h3 className="text-lg font-bold text-tea-dark dark:text-tea-light mb-4 flex items-center gap-2">
            <Truck size={18} className="text-gray-400" /> {t('adminSettings.storeSec.deliveryCost').split(' (')[0]}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">{t('adminSettings.storeSec.deliveryCost')}</label>
              <input
                type="number"
                name="deliveryCost"
                value={settings.deliveryCost || ''}
                onChange={handleChange}
                required
                className="w-full bg-gray-50 dark:bg-[#1A2421] border border-gray-200 dark:border-[#3A5243] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-tea-green transition"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">{t('adminSettings.storeSec.freeDelivery')}</label>
              <input
                type="number"
                name="freeDeliveryThreshold"
                value={settings.freeDeliveryThreshold || ''}
                onChange={handleChange}
                required
                className="w-full bg-gray-50 dark:bg-[#1A2421] border border-gray-200 dark:border-[#3A5243] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-tea-green transition"
              />
            </div>
          </div>
        </motion.div>

        {/* Contacts */}
        <motion.div variants={itemVariants} className="pt-6 border-t border-gray-100 dark:border-[#3A5243]">
          <h3 className="text-lg font-bold text-tea-dark dark:text-tea-light mb-4 flex items-center gap-2">
            <Store size={18} className="text-gray-400" /> {t('adminSettings.storeSec.title')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">{t('adminSettings.storeSec.supportPhone')}</label>
              <input
                type="text"
                name="supportPhone"
                value={settings.supportPhone || ''}
                onChange={handleChange}
                required
                className="w-full bg-gray-50 dark:bg-[#1A2421] border border-gray-200 dark:border-[#3A5243] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-tea-green transition"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">{t('adminSettings.storeSec.workHours')}</label>
              <input
                type="text"
                name="workHours"
                value={settings.workHours || ''}
                onChange={handleChange}
                required
                placeholder={t('adminSettings.storeSec.workHoursPlaceholder')}
                className="w-full bg-gray-50 dark:bg-[#1A2421] border border-gray-200 dark:border-[#3A5243] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-tea-green transition"
              />
            </div>
          </div>
        </motion.div>

        {/* Maintenance */}
        <motion.div variants={itemVariants} className="pt-6 border-t border-gray-100 dark:border-[#3A5243]">
          <div
            className={`flex items-start justify-between p-5 rounded-2xl border transition-all duration-300 ${
              settings.maintenanceMode
                ? 'bg-orange-50 border-orange-200 shadow-[0_0_15px_rgba(249,115,22,0.08)]'
                : 'bg-gray-50 dark:bg-[#1A2421] border-gray-100 dark:border-[#3A5243]'
            }`}
          >
            <div>
              <h3 className={`text-base font-bold flex items-center gap-2 transition-colors duration-300 ${
                settings.maintenanceMode ? 'text-orange-800' : 'text-gray-700 dark:text-gray-300'
              }`}>
                <Clock size={18} /> {t('adminSettings.storeSec.maintenance')}
              </h3>
              <p className={`text-sm mt-1 max-w-md transition-colors duration-300 ${
                settings.maintenanceMode ? 'text-orange-600' : 'text-gray-500 dark:text-gray-400'
              }`}>
                {t('adminSettings.storeSec.maintenanceDesc')}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer mt-2 flex-shrink-0">
              <input
                type="checkbox"
                name="maintenanceMode"
                checked={settings.maintenanceMode}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:bg-[#23312B] after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
            </label>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="pt-4 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-gradient-to-r from-tea-dark to-tea-green text-white font-medium text-sm rounded-xl hover:opacity-90 transition shadow-lg dark:shadow-black/50 flex items-center gap-2"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {t('adminSettings.storeSec.saveBtn')}
          </motion.button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default StoreConfig;
