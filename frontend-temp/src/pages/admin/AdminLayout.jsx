import { Link, Outlet } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Users, BarChart3, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const AdminLayout = () => {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-[calc(100vh-200px)] -mx-4 -my-8">
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -250 }} 
        animate={{ x: 0 }} 
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="w-64 bg-tea-dark text-tea-light p-6 shadow-xl dark:shadow-black/60 relative z-10"
      >
        <h2 className="text-2xl font-bold mb-8 text-tea-gold">{t('adminLayout.title')}</h2>
        <nav className="space-y-4">
          <Link to="/admin" className="flex items-center space-x-3 hover:text-tea-gold transition p-2 rounded hover:bg-white dark:bg-[#23312B]/5">
            <LayoutDashboard size={20} />
            <span>{t('adminLayout.dashboard')}</span>
          </Link>
          <Link to="/admin/products" className="flex items-center space-x-3 hover:text-tea-gold transition p-2 rounded hover:bg-white dark:bg-[#23312B]/5">
            <Package size={20} />
            <span>{t('adminLayout.products')}</span>
          </Link>
          <Link to="/admin/orders" className="flex items-center space-x-3 hover:text-tea-gold transition p-2 rounded hover:bg-white dark:bg-[#23312B]/5">
            <ShoppingBag size={20} />
            <span>{t('adminLayout.orders')}</span>
          </Link>
          <Link to="/admin/users" className="flex items-center space-x-3 hover:text-tea-gold transition p-2 rounded hover:bg-white dark:bg-[#23312B]/5">
            <Users size={20} />
            <span>{t('adminLayout.users')}</span>
          </Link>
          <Link to="/admin/stats" className="flex items-center space-x-3 hover:text-tea-gold transition p-2 rounded hover:bg-white dark:bg-[#23312B]/5">
            <BarChart3 size={20} />
            <span>{t('adminLayout.stats')}</span>
          </Link>
          <Link to="/admin/settings" className="flex items-center space-x-3 hover:text-tea-gold transition p-2 rounded hover:bg-white dark:bg-[#23312B]/5">
            <Settings size={20} />
            <span>{t('adminLayout.settings')}</span>
          </Link>
        </nav>
      </motion.aside>

      {/* Main Content */}
      <motion.main 
        initial={{ opacity: 0, x: 20 }} 
        animate={{ opacity: 1, x: 0 }} 
        transition={{ duration: 0.4 }}
        className="flex-1 bg-gray-50 dark:bg-[#1A2421] p-8"
      >
        <Outlet />
      </motion.main>
    </div>
  );
};

export default AdminLayout;
