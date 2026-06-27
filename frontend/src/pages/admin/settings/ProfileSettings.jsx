import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Save, Lock, Smartphone, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { setCredentials } from '../../../store/authSlice';

const ProfileSettings = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name || '');
      setEmail(userInfo.email || '');
    }
  }, [userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });
    
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.put('/api/users/profile', {
        name,
        email,
        oldPassword,
        newPassword
      }, config);
      
      dispatch(setCredentials({ ...data }));
      setMessage({ text: t('adminSettings.profileSec.success'), type: 'success' });
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      setMessage({ text: err.response?.data?.message || err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white dark:bg-[#23312B] rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-100 dark:border-[#3A5243]/80 p-6 sm:p-8"
    >
      <motion.h2 variants={itemVariants} className="text-xl font-bold text-tea-dark dark:text-tea-light mb-6">
        {t('adminSettings.profileSec.title')}
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

      <form onSubmit={submitHandler} className="space-y-6 max-w-2xl">
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">{t('adminSettings.profileSec.name')}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-gray-50 dark:bg-[#1A2421] border border-gray-200 dark:border-[#3A5243] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-tea-green transition"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">{t('adminSettings.profileSec.email')}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-gray-50 dark:bg-[#1A2421] border border-gray-200 dark:border-[#3A5243] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-tea-green transition"
            />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="pt-6 border-t border-gray-100 dark:border-[#3A5243]">
          <h3 className="text-lg font-bold text-tea-dark dark:text-tea-light mb-4 flex items-center gap-2">
            <Lock size={18} className="text-gray-400" /> {t('adminSettings.profileSec.passwordChange')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">{t('adminSettings.profileSec.currentPassword')}</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-50 dark:bg-[#1A2421] border border-gray-200 dark:border-[#3A5243] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-tea-green transition"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">{t('adminSettings.profileSec.newPassword')}</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-50 dark:bg-[#1A2421] border border-gray-200 dark:border-[#3A5243] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-tea-green transition"
              />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3">{t('adminSettings.profileSec.passwordHint')}</p>
        </motion.div>

        <motion.div variants={itemVariants} className="pt-6 border-t border-gray-100 dark:border-[#3A5243]">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold text-tea-dark dark:text-tea-light flex items-center gap-2">
                <Smartphone size={18} className="text-gray-400" /> {t('adminSettings.profileSec.twoFactor')}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('adminSettings.profileSec.twoFactorDesc')}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              className="px-4 py-2 bg-gray-100 text-gray-600 dark:text-gray-400 font-medium text-sm rounded-xl hover:bg-gray-200 transition"
            >
              {t('adminSettings.profileSec.twoFactorSetup')}
            </motion.button>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="pt-4 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-tea-dark to-tea-green text-white font-medium text-sm rounded-xl hover:opacity-90 transition shadow-lg dark:shadow-black/50 flex items-center gap-2"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {t('adminSettings.profileSec.saveBtn')}
          </motion.button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default ProfileSettings;
