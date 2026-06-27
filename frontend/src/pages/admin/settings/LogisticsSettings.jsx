import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Save, Loader2, Map, DollarSign, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const LogisticsSettings = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { t } = useTranslation();
  
  const [settings, setSettings] = useState({
    baseCurrency: 'RUB',
    deliveryZones: [],
    currencies: []
  });
  
  const [newZone, setNewZone] = useState({ name: '', cost: '' });
  const [newCurrency, setNewCurrency] = useState({ code: '', rate: '', symbol: '' });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get('/api/settings');
        setSettings({
          baseCurrency: data.baseCurrency || 'RUB',
          deliveryZones: data.deliveryZones || [],
          currencies: data.currencies || []
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleBaseCurrencyChange = (e) => {
    setSettings({ ...settings, baseCurrency: e.target.value });
  };

  const addZone = () => {
    if (!newZone.name || !newZone.cost) return;
    setSettings({
      ...settings,
      deliveryZones: [...settings.deliveryZones, { ...newZone, cost: Number(newZone.cost) }]
    });
    setNewZone({ name: '', cost: '' });
  };

  const removeZone = (index) => {
    const zones = [...settings.deliveryZones];
    zones.splice(index, 1);
    setSettings({ ...settings, deliveryZones: zones });
  };

  const addCurrency = () => {
    if (!newCurrency.code || !newCurrency.rate || !newCurrency.symbol) return;
    setSettings({
      ...settings,
      currencies: [...settings.currencies, { ...newCurrency, rate: Number(newCurrency.rate) }]
    });
    setNewCurrency({ code: '', rate: '', symbol: '' });
  };

  const removeCurrency = (index) => {
    const currs = [...settings.currencies];
    currs.splice(index, 1);
    setSettings({ ...settings, currencies: currs });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });
    
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put('/api/settings', settings, config);
      setMessage({ text: t('adminSettings.logisticsSec.success'), type: 'success' });
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
        {t('adminSettings.logisticsSec.title')}
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
        {/* Delivery Zones */}
        <motion.div variants={itemVariants}>
          <h3 className="text-lg font-bold text-tea-dark dark:text-tea-light mb-4 flex items-center gap-2">
            <Map size={18} className="text-rose-500" /> {t('adminSettings.logisticsSec.zonesTitle')}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t('adminSettings.logisticsSec.zonesDesc')}</p>
          
          <div className="space-y-3 mb-4">
            <AnimatePresence>
              {settings.deliveryZones.map((zone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex items-center justify-between bg-gray-50 dark:bg-[#1A2421] p-3 rounded-xl border border-gray-100 dark:border-[#3A5243]"
                >
                  <span className="font-medium text-sm text-gray-700 dark:text-gray-300">{zone.name}</span>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-sm text-tea-dark dark:text-tea-light">
                      {zone.cost} {settings.baseCurrency}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.1, color: '#dc2626' }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      onClick={() => removeZone(index)}
                      className="text-red-400"
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {settings.deliveryZones.length === 0 && (
              <p className="text-sm text-gray-400 italic">{t('adminSettings.logisticsSec.noZones')}</p>
            )}
          </div>

          <div className="flex items-end gap-3 bg-gray-50 dark:bg-[#1A2421] p-4 rounded-2xl border border-gray-100 dark:border-[#3A5243]">
            <div className="flex-1 space-y-1">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">{t('adminSettings.logisticsSec.addRegionLabel')}</label>
              <input
                type="text"
                value={newZone.name}
                onChange={(e) => setNewZone({ ...newZone, name: e.target.value })}
                className="w-full bg-white dark:bg-[#23312B] border border-gray-200 dark:border-[#3A5243] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tea-green"
              />
            </div>
            <div className="w-32 space-y-1">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">{t('adminSettings.logisticsSec.addPriceLabel')} ({settings.baseCurrency})</label>
              <input
                type="number"
                value={newZone.cost}
                onChange={(e) => setNewZone({ ...newZone, cost: e.target.value })}
                className="w-full bg-white dark:bg-[#23312B] border border-gray-200 dark:border-[#3A5243] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tea-green"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={addZone}
              className="px-4 py-2 bg-gray-200 text-gray-700 dark:text-gray-300 font-medium text-sm rounded-lg hover:bg-gray-300 transition h-[38px] flex items-center justify-center"
            >
              <Plus size={16} /> {t('adminSettings.logisticsSec.addBtn')}
            </motion.button>
          </div>
        </motion.div>

        {/* Currencies */}
        <motion.div variants={itemVariants} className="pt-6 border-t border-gray-100 dark:border-[#3A5243]">
          <h3 className="text-lg font-bold text-tea-dark dark:text-tea-light mb-4 flex items-center gap-2">
            <DollarSign size={18} className="text-green-500" /> {t('adminSettings.logisticsSec.currencyTitle')}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t('adminSettings.logisticsSec.currencyDesc')}</p>
          
          <div className="space-y-2 mb-6">
            <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">{t('adminSettings.logisticsSec.baseCurrencyLabel')}</label>
            <select
              value={settings.baseCurrency}
              onChange={handleBaseCurrencyChange}
              className="w-full max-w-xs bg-gray-50 dark:bg-[#1A2421] border border-gray-200 dark:border-[#3A5243] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-tea-green transition"
            >
              <option value="RUB">RUB - Российский рубль</option>
              <option value="UZS">UZS - Узбекский сум</option>
              <option value="USD">USD - Доллар США</option>
            </select>
          </div>

          <div className="space-y-3 mb-4">
            <AnimatePresence>
              {settings.currencies.map((curr, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex items-center justify-between bg-gray-50 dark:bg-[#1A2421] p-3 rounded-xl border border-gray-100 dark:border-[#3A5243]"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm bg-gray-200 px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">{curr.code}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{t('adminSettings.logisticsSec.addSymbolLabel')}: {curr.symbol}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-medium text-sm text-gray-700 dark:text-gray-300">{t('adminSettings.logisticsSec.addRateLabel')}: {curr.rate}</span>
                    <motion.button
                      whileHover={{ scale: 1.1, color: '#dc2626' }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      onClick={() => removeCurrency(index)}
                      className="text-red-400"
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {settings.currencies.length === 0 && (
              <p className="text-sm text-gray-400 italic">{t('adminSettings.logisticsSec.noCurrencies')}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-gray-50 dark:bg-[#1A2421] p-4 rounded-2xl border border-gray-100 dark:border-[#3A5243] items-end">
            <div className="space-y-1 sm:col-span-1">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">{t('adminSettings.logisticsSec.addCodeLabel')}</label>
              <input
                type="text"
                value={newCurrency.code}
                onChange={(e) => setNewCurrency({ ...newCurrency, code: e.target.value.toUpperCase() })}
                placeholder="UZS"
                className="w-full bg-white dark:bg-[#23312B] border border-gray-200 dark:border-[#3A5243] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tea-green uppercase"
              />
            </div>
            <div className="space-y-1 sm:col-span-1">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">{t('adminSettings.logisticsSec.addRateLabel')}</label>
              <input
                type="number"
                value={newCurrency.rate}
                onChange={(e) => setNewCurrency({ ...newCurrency, rate: e.target.value })}
                placeholder="135.5"
                step="0.01"
                className="w-full bg-white dark:bg-[#23312B] border border-gray-200 dark:border-[#3A5243] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tea-green"
              />
            </div>
            <div className="space-y-1 sm:col-span-1">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">{t('adminSettings.logisticsSec.addSymbolLabel')}</label>
              <input
                type="text"
                value={newCurrency.symbol}
                onChange={(e) => setNewCurrency({ ...newCurrency, symbol: e.target.value })}
                placeholder={t('adminSettings.logisticsSec.currencySymbolPlaceholder')}
                className="w-full bg-white dark:bg-[#23312B] border border-gray-200 dark:border-[#3A5243] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tea-green"
              />
            </div>
            <div className="sm:col-span-1">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={addCurrency}
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 dark:text-gray-300 font-medium text-sm rounded-lg hover:bg-gray-300 transition h-[38px] flex items-center justify-center"
              >
                <Plus size={16} /> {t('adminSettings.logisticsSec.addBtn')}
              </motion.button>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="pt-6 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-gradient-to-r from-tea-dark to-tea-green text-white font-medium text-sm rounded-xl hover:opacity-90 transition shadow-lg dark:shadow-black/50 flex items-center gap-2"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {t('adminSettings.logisticsSec.saveBtn')}
          </motion.button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default LogisticsSettings;
