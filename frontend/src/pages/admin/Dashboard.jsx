import { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const [stats, setStats] = useState({
    monthlySales: 0,
    newOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    recentOrders: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get('/api/orders/stats');
        setStats(data);
      } catch (error) {
        console.error(t('adminDashboard.loadingError'), error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, [t]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-tea-gold w-10 h-10" />
      </div>
    );
  }

  // Define animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 variants={itemVariants} className="text-3xl font-bold mb-8 text-tea-dark dark:text-tea-light">
        {t('adminDashboard.title')}
      </motion.h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div variants={itemVariants} className="bg-white dark:bg-[#23312B] p-6 rounded-xl shadow-md dark:shadow-black/40 border-l-4 border-tea-gold hover:shadow-lg dark:shadow-black/50 transition-shadow">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase mb-2">{t('adminDashboard.monthlySales')}</h3>
          <p className="text-3xl font-bold text-tea-dark dark:text-tea-light">
            {stats.monthlySales.toLocaleString(i18n.language === 'ru' ? 'ru-RU' : 'en-US')} ₽
          </p>
        </motion.div>
        <motion.div variants={itemVariants} className="bg-white dark:bg-[#23312B] p-6 rounded-xl shadow-md dark:shadow-black/40 border-l-4 border-tea-green hover:shadow-lg dark:shadow-black/50 transition-shadow">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase mb-2">{t('adminDashboard.newOrders')}</h3>
          <p className="text-3xl font-bold text-tea-dark dark:text-tea-light">{stats.newOrders}</p>
        </motion.div>
        <motion.div variants={itemVariants} className="bg-white dark:bg-[#23312B] p-6 rounded-xl shadow-md dark:shadow-black/40 border-l-4 border-blue-500 hover:shadow-lg dark:shadow-black/50 transition-shadow">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase mb-2">{t('adminDashboard.totalProducts')}</h3>
          <p className="text-3xl font-bold text-tea-dark dark:text-tea-light">{stats.totalProducts}</p>
        </motion.div>
        <motion.div variants={itemVariants} className="bg-white dark:bg-[#23312B] p-6 rounded-xl shadow-md dark:shadow-black/40 border-l-4 border-purple-500 hover:shadow-lg dark:shadow-black/50 transition-shadow">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase mb-2">{t('adminDashboard.totalUsers')}</h3>
          <p className="text-3xl font-bold text-tea-dark dark:text-tea-light">{stats.totalUsers}</p>
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className="bg-white dark:bg-[#23312B] p-6 rounded-xl shadow-md dark:shadow-black/40 hover:shadow-lg dark:shadow-black/50 transition-shadow">
        <h2 className="text-xl font-bold mb-4 border-b pb-2">{t('adminDashboard.recentOrders')}</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-[#1A2421]">
                <th className="p-3">{t('adminDashboard.orderId')}</th>
                <th className="p-3">{t('adminDashboard.client')}</th>
                <th className="p-3">{t('adminDashboard.date')}</th>
                <th className="p-3">{t('adminDashboard.amount')}</th>
                <th className="p-3">{t('adminDashboard.status')}</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.length > 0 ? (
                stats.recentOrders.map((order) => (
                  <tr key={order._id} className="border-b hover:bg-gray-50 dark:bg-[#1A2421] transition-colors">
                    <td className="p-3">#{order._id.substring(order._id.length - 6)}</td>
                    <td className="p-3">{order.user?.name || t('adminDashboard.guest')}</td>
                    <td className="p-3">
                      {new Date(order.createdAt).toLocaleDateString(i18n.language === 'ru' ? 'ru-RU' : 'en-US')}
                    </td>
                    <td className="p-3">{order.totalPrice.toLocaleString(i18n.language === 'ru' ? 'ru-RU' : 'en-US')} ₽</td>
                    <td className="p-3">
                      {order.isDelivered ? (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold">{t('adminDashboard.delivered')}</span>
                      ) : order.isPaid ? (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold">{t('adminDashboard.paid')}</span>
                      ) : (
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-bold">{t('adminDashboard.processing')}</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500 dark:text-gray-400">
                    {t('adminDashboard.noRecentOrders')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
