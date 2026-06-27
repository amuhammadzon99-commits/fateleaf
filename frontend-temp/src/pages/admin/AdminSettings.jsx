import React, { useState } from 'react';
import { Settings, User, Globe, Link2, Percent, List, Search, Map } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import ProfileSettings from './settings/ProfileSettings';
import StoreConfig from './settings/StoreConfig';
import Integrations from './settings/Integrations';
import Marketing from './settings/Marketing';
import AuditLogView from './settings/AuditLogView';
import SeoSettings from './settings/SeoSettings';
import LogisticsSettings from './settings/LogisticsSettings';

const tabs = [
  { id: 'profile', icon: User, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'store', icon: Settings, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { id: 'integrations', icon: Link2, color: 'text-violet-500', bg: 'bg-violet-50' },
  { id: 'marketing', icon: Percent, color: 'text-pink-500', bg: 'bg-pink-50' },
  { id: 'audit', icon: List, color: 'text-amber-500', bg: 'bg-amber-50' },
  { id: 'seo', icon: Search, color: 'text-cyan-500', bg: 'bg-cyan-50' },
  { id: 'logistics', icon: Map, color: 'text-rose-500', bg: 'bg-rose-50' },
];

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-tea-dark dark:text-tea-light tracking-tight">
            {t('adminSettings.title')}
          </h1>
          <p className="text-gray-400 mt-1 text-sm">{t('adminSettings.subtitle')}</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full lg:w-72 flex-shrink-0">
          <div className="bg-white dark:bg-[#23312B] rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-100 dark:border-[#3A5243]/80 p-4">
            <nav className="space-y-1.5 relative">
              {tabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 text-left font-medium text-sm relative overflow-hidden
                      ${isActive ? 'text-tea-dark dark:text-tea-light font-bold' : 'hover:bg-gray-50 dark:bg-[#1A2421]/50 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:text-gray-200'}`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeSettingsTabBackground"
                        className="absolute inset-0 bg-gray-50 dark:bg-[#1A2421]/80 border border-gray-100 dark:border-[#3A5243] shadow-sm rounded-2xl -z-10"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 relative z-10 ${isActive ? tab.bg : 'bg-gray-100'}`}>
                      <Icon size={16} className={isActive ? tab.color : 'text-gray-400'} />
                    </div>
                    <span className="relative z-10">{t(`adminSettings.tabs.${tab.id}`)}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              {activeTab === 'profile' && <ProfileSettings />}
              {activeTab === 'store' && <StoreConfig />}
              {activeTab === 'integrations' && <Integrations />}
              {activeTab === 'marketing' && <Marketing />}
              {activeTab === 'audit' && <AuditLogView />}
              {activeTab === 'seo' && <SeoSettings />}
              {activeTab === 'logistics' && <LogisticsSettings />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
