import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { 
  Loader2, List, Clock, User, Download, Search, Filter, 
  Eye, X, Package, ShoppingBag, Settings, Globe 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const AuditLogView = () => {
  const { userInfo } = useSelector((state) => state.auth);
  
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [category, setCategory] = useState('Все');
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Modal State
  const [selectedLog, setSelectedLog] = useState(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      let query = `/api/audit?category=${category}`;
      if (search) query += `&search=${search}`;
      if (startDate) query += `&startDate=${startDate}`;
      if (endDate) query += `&endDate=${endDate}`;

      const { data } = await axios.get(query, config);
      setLogs(data.logs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line
  }, [category, startDate, endDate, userInfo]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchLogs();
  };

  const handleExportCSV = () => {
    if (logs.length === 0) return;
    
    const headers = ['Дата', 'IP Адрес', 'Пользователь', 'Категория', 'Действие', 'Детали'];
    const csvContent = [
      headers.join(','),
      ...logs.map(log => {
        return [
          `"${new Date(log.createdAt).toLocaleString('ru-RU')}"`,
          `"${log.ipAddress || ''}"`,
          `"${log.admin?.name || 'Неизвестно'}"`,
          `"${log.category || 'Другое'}"`,
          `"${log.action}"`,
          `"${log.details.replace(/"/g, '""')}"`
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `audit_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getActionColor = (action) => {
    const a = action.toLowerCase();
    if (a.includes('удал') || a.includes('аннулирован') || a.includes('ошибк')) return 'text-red-600 bg-red-50 border-red-100';
    if (a.includes('созда') || a.includes('добавл') || a.includes('успеш')) return 'text-green-600 bg-green-50 border-green-100';
    return 'text-blue-600 bg-blue-50 border-blue-100';
  };

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'Товары': return <Package size={14} className="text-orange-500" />;
      case 'Заказы': return <ShoppingBag size={14} className="text-emerald-500" />;
      case 'Системные': return <Settings size={14} className="text-purple-500" />;
      case 'Пользователи': return <User size={14} className="text-blue-500" />;
      default: return <Globe size={14} className="text-gray-500" />;
    }
  };

  const containerVariants = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.04 } } };
  const itemVariants = { hidden: { opacity: 0, y: 5 }, visible: { opacity: 1, y: 0 } };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="bg-white dark:bg-[#23312B] rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-100 dark:border-[#3A5243]/80 p-6 sm:p-8 relative">
      
      {/* Header & Export */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-tea-dark dark:text-tea-light flex items-center gap-2">
            <List size={22} className="text-tea-green" /> Журнал активности (Audit Log)
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Детализированная история действий в системе</p>
        </div>
        <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2 bg-tea-green text-white rounded-xl hover:opacity-90 transition font-medium text-sm shadow-md">
          <Download size={16} /> Экспорт CSV
        </button>
      </div>

      {/* Filters Area */}
      <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-gray-50 dark:bg-[#1A2421]/50 rounded-2xl border border-gray-100 dark:border-[#3A5243]">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="bg-white dark:bg-[#23312B] border border-gray-200 dark:border-[#3A5243] text-sm rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200 outline-none focus:border-tea-green">
            <option value="Все">Все категории</option>
            <option value="Товары">Товары</option>
            <option value="Заказы">Заказы</option>
            <option value="Системные">Системные</option>
            <option value="Пользователи">Пользователи</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-white dark:bg-[#23312B] border border-gray-200 dark:border-[#3A5243] text-sm rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200 outline-none focus:border-tea-green" />
          <span className="text-gray-400 text-sm">-</span>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-white dark:bg-[#23312B] border border-gray-200 dark:border-[#3A5243] text-sm rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200 outline-none focus:border-tea-green" />
        </div>

        <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center bg-white dark:bg-[#23312B] border border-gray-200 dark:border-[#3A5243] rounded-lg px-3 py-2 focus-within:border-tea-green transition-colors min-w-[200px]">
          <Search size={16} className="text-gray-400 mr-2" />
          <input type="text" placeholder="Поиск по пользователю или действию..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-transparent border-none outline-none text-sm w-full text-gray-700 dark:text-gray-200" />
          <button type="submit" className="hidden">Искать</button>
        </form>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-tea-green w-8 h-8"/></div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-100 dark:border-[#3A5243] text-xs text-gray-400 uppercase tracking-wider">
                <th className="pb-3 font-semibold pl-2">Дата и Время</th>
                <th className="pb-3 font-semibold">Пользователь (IP)</th>
                <th className="pb-3 font-semibold">Событие</th>
                <th className="pb-3 font-semibold">Детали</th>
                <th className="pb-3 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {logs.map((log) => (
                  <motion.tr key={log._id} variants={itemVariants} className="border-b border-gray-50 hover:bg-gray-50 dark:bg-[#1A2421]/50 transition-colors duration-150">
                    <td className="py-4 pl-2 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} className="text-gray-400" />
                        {new Date(log.createdAt).toLocaleString('ru-RU', {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </td>
                    <td className="py-4 text-sm font-medium text-tea-dark dark:text-tea-light">
                      <div className="flex flex-col">
                        <span className="flex items-center gap-1.5"><User size={14} className="text-blue-400" /> {log.admin?.name || 'Система'}</span>
                        {log.ipAddress && <span className="text-xs text-gray-400 font-normal mt-0.5 ml-5">{log.ipAddress}</span>}
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex flex-col gap-1.5 items-start">
                        <span className="flex items-center gap-1.5 text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-md">
                          {getCategoryIcon(log.category)} {log.category || 'Другое'}
                        </span>
                        <span className={`text-xs font-bold border px-2 py-1 rounded-md ${getActionColor(log.action)}`}>
                          {log.action}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs break-words">
                      {log.details}
                    </td>
                    <td className="py-4 pr-2 text-right">
                      {log.metadata && (
                        <button onClick={() => setSelectedLog(log)} className="text-tea-green hover:text-tea-dark transition flex items-center justify-end gap-1 text-xs font-bold ml-auto bg-tea-green/10 px-3 py-1.5 rounded-lg">
                          <Eye size={14} /> Изменения
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {logs.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-sm text-gray-400">
                    Журнал пуст по заданным фильтрам.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* View Changes Modal */}
      <AnimatePresence>
        {selectedLog && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white dark:bg-[#1A2421] rounded-3xl shadow-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-tea-dark dark:text-tea-light flex items-center gap-2">
                  <Eye size={20} className="text-tea-green" /> Детали изменения
                </h3>
                <button onClick={() => setSelectedLog(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition">
                  <X size={24} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Действие:</p>
                  <p className="font-medium text-tea-dark dark:text-tea-light">{selectedLog.action} - {selectedLog.details}</p>
                </div>
                
                {selectedLog.metadata?.before && (
                  <div className="mb-4">
                    <p className="text-sm font-bold text-red-500 mb-2">Было:</p>
                    <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl text-xs text-gray-700 dark:text-gray-300 overflow-x-auto border border-gray-100 dark:border-gray-800">
                      {JSON.stringify(selectedLog.metadata.before, null, 2)}
                    </pre>
                  </div>
                )}
                
                {selectedLog.metadata?.after && (
                  <div>
                    <p className="text-sm font-bold text-green-500 mb-2">Стало:</p>
                    <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl text-xs text-gray-700 dark:text-gray-300 overflow-x-auto border border-gray-100 dark:border-gray-800">
                      {JSON.stringify(selectedLog.metadata.after, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AuditLogView;
