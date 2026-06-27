import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Save, Loader2, Send, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Integrations = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { t } = useTranslation();
  
  const [settings, setSettings] = useState({
    telegramBotToken: '',
    telegramChatId: '',
    paymentGatewayMode: 'test',
    paymentGatewayPublicKey: '',
    paymentGatewaySecretKey: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get('/api/settings');
        setSettings({
          telegramBotToken: data.telegramBotToken || '',
          telegramChatId: data.telegramChatId || '',
          paymentGatewayMode: data.paymentGatewayMode || 'test',
          paymentGatewayPublicKey: data.paymentGatewayPublicKey || '',
          paymentGatewaySecretKey: data.paymentGatewaySecretKey || '',
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings({ ...settings, [name]: value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });
    
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put('/api/settings', settings, config);
      setMessage({ text: t('adminSettings.integrationsSec.success'), type: 'success' });
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
        {t('adminSettings.integrationsSec.title')}
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
        {/* Telegram */}
        <motion.div variants={itemVariants}>
          <h3 className="text-lg font-bold text-tea-dark dark:text-tea-light mb-4 flex items-center gap-2">
            <Send size={18} className="text-blue-500" /> {t('adminSettings.integrationsSec.telegramTitle')}
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">{t('adminSettings.integrationsSec.botToken')}</label>
              <input
                type="text"
                name="telegramBotToken"
                value={settings.telegramBotToken}
                onChange={handleChange}
                placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
                className="w-full bg-gray-50 dark:bg-[#1A2421] border border-gray-200 dark:border-[#3A5243] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-tea-green transition font-mono"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">{t('adminSettings.integrationsSec.chatId')}</label>
              <input
                type="text"
                name="telegramChatId"
                value={settings.telegramChatId}
                onChange={handleChange}
                placeholder="123456789"
                className="w-full bg-gray-50 dark:bg-[#1A2421] border border-gray-200 dark:border-[#3A5243] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-tea-green transition font-mono"
              />
            </div>
          </div>
        </motion.div>

        {/* Payments */}
        <motion.div variants={itemVariants} className="pt-6 border-t border-gray-100 dark:border-[#3A5243]">
          <h3 className="text-lg font-bold text-tea-dark dark:text-tea-light mb-4 flex items-center gap-2">
            <CreditCard size={18} className="text-gray-400" /> {t('adminSettings.integrationsSec.paymentTitle')}
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">{t('adminSettings.integrationsSec.paymentMode')}</label>
              <select
                name="paymentGatewayMode"
                value={settings.paymentGatewayMode}
                onChange={handleChange}
                className="w-full bg-gray-50 dark:bg-[#1A2421] border border-gray-200 dark:border-[#3A5243] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-tea-green transition"
              >
                <option value="test">{t('adminSettings.integrationsSec.sandbox')}</option>
                <option value="live">{t('adminSettings.integrationsSec.live')}</option>
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">{t('adminSettings.integrationsSec.publicKey')}</label>
                <input
                  type="text"
                  name="paymentGatewayPublicKey"
                  value={settings.paymentGatewayPublicKey}
                  onChange={handleChange}
                  className="w-full bg-gray-50 dark:bg-[#1A2421] border border-gray-200 dark:border-[#3A5243] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-tea-green transition font-mono"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">{t('adminSettings.integrationsSec.secretKey')}</label>
                <input
                  type="password"
                  name="paymentGatewaySecretKey"
                  value={settings.paymentGatewaySecretKey}
                  onChange={handleChange}
                  className="w-full bg-gray-50 dark:bg-[#1A2421] border border-gray-200 dark:border-[#3A5243] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-tea-green transition font-mono"
                />
              </div>
            </div>
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
            {t('adminSettings.integrationsSec.saveBtn')}
          </motion.button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default Integrations;
