import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Save, Loader2, Search, Code } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const SeoSettings = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { t } = useTranslation();
  
  const [settings, setSettings] = useState({
    metaTitle: '',
    metaDescription: '',
    analyticsPixelId: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get('/api/settings');
        setSettings({
          metaTitle: data.metaTitle || '',
          metaDescription: data.metaDescription || '',
          analyticsPixelId: data.analyticsPixelId || '',
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
      setMessage({ text: t('adminSettings.seoSec.success'), type: 'success' });
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
        {t('adminSettings.seoSec.title')}
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
        {/* Meta Tags */}
        <motion.div variants={itemVariants}>
          <h3 className="text-lg font-bold text-tea-dark dark:text-tea-light mb-4 flex items-center gap-2">
            <Search size={18} className="text-cyan-500" /> {t('adminSettings.seoSec.metaTitleSec')}
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">{t('adminSettings.seoSec.metaTitleLabel')}</label>
              <input
                type="text"
                name="metaTitle"
                value={settings.metaTitle}
                onChange={handleChange}
                placeholder={t('adminSettings.seoSec.metaTitlePlaceholder')}
                className="w-full bg-gray-50 dark:bg-[#1A2421] border border-gray-200 dark:border-[#3A5243] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">{t('adminSettings.seoSec.metaDescLabel')}</label>
              <textarea
                name="metaDescription"
                value={settings.metaDescription}
                onChange={handleChange}
                rows="3"
                placeholder={t('adminSettings.seoSec.metaDescPlaceholder')}
                className="w-full bg-gray-50 dark:bg-[#1A2421] border border-gray-200 dark:border-[#3A5243] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition resize-none"
              ></textarea>
            </div>
          </div>
        </motion.div>

        {/* Analytics */}
        <motion.div variants={itemVariants} className="pt-6 border-t border-gray-100 dark:border-[#3A5243]">
          <h3 className="text-lg font-bold text-tea-dark dark:text-tea-light mb-4 flex items-center gap-2">
            <Code size={18} className="text-gray-400" /> {t('adminSettings.seoSec.pixelTitle')}
          </h3>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">{t('adminSettings.seoSec.pixelLabel')}</label>
            <input
              type="text"
              name="analyticsPixelId"
              value={settings.analyticsPixelId}
              onChange={handleChange}
              placeholder="G-XXXXXXXXXX или 12345678"
              className="w-full bg-gray-50 dark:bg-[#1A2421] border border-gray-200 dark:border-[#3A5243] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition font-mono"
            />
            <p className="text-xs text-gray-400 mt-1">{t('adminSettings.seoSec.pixelHint')}</p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="pt-4 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-cyan-600 text-white font-medium text-sm rounded-xl hover:bg-cyan-700 transition shadow-lg dark:shadow-black/50 flex items-center gap-2"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {t('adminSettings.seoSec.saveBtn')}
          </motion.button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default SeoSettings;
