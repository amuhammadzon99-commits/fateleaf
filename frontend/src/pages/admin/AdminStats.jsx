import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, RadialBarChart, RadialBar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Loader2, Download, TrendingUp, ShoppingBag, DollarSign, Users,
  BarChart2, ArrowUpRight, RefreshCw, Package, Star, Zap, Target, Heart
} from 'lucide-react';

// ─── Palette ────────────────────────────────────────────────────────────────
const GRADIENT_GREEN  = ['#3D8B60', '#A8D5BA'];
const GRADIENT_GOLD   = ['#B8860B', '#FFD700'];
const PIE_COLORS      = ['#6366F1', '#10B981', '#F59E0B'];
const BAR_GRADIENT_1  = ['#667eea', '#764ba2'];
const BAR_GRADIENT_2  = ['#f093fb', '#f5576c'];

// ─── Animated KPI counter ───────────────────────────────────────────────────
const AnimatedNumber = ({ value, prefix = '', suffix = '', duration = 1200 }) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = value / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) { setDisplay(value); clearInterval(timer); }
      else setDisplay(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [value, duration]);
  return <span>{prefix}{display.toLocaleString('ru-RU')}{suffix}</span>;
};

// ─── Custom Tooltip ─────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label, valuePrefix = '', valueSuffix = '' }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(255,255,255,0.95)',
        borderRadius: 16,
        border: 'none',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        padding: '12px 18px',
        backdropFilter: 'blur(12px)',
      }}>
        <p style={{ color: '#6B7280', fontSize: 12, marginBottom: 6, fontWeight: 600 }}>{label}</p>
        {payload.map((entry, i) => (
          <p key={i} style={{ color: entry.color || '#3D5A40', fontWeight: 700, fontSize: 15 }}>
            {valuePrefix}{Number(entry.value).toLocaleString('ru-RU')}{valueSuffix}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ─── Card wrapper with entry animation ──────────────────────────────────────
const Card = ({ children, className = '', delay = 0, style = {} }) => (
  <motion.div
    initial={{ opacity: 0, y: 28 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    className={`bg-white dark:bg-[#23312B] rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-100 dark:border-[#3A5243]/80 ${className}`}
    style={style}
  >
    {children}
  </motion.div>
);

// ─── Mini sparkline progress bar ─────────────────────────────────────────────
const ProgressBar = ({ value, max, color }) => {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mt-2">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 }}
        className="h-full rounded-full"
        style={{ background: color }}
      />
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────
const AdminStats = () => {
  const { t, i18n } = useTranslation();
  const { userInfo } = useSelector((state) => state.auth);
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [activeTab, setActiveTab] = useState('revenue'); // 'revenue' | 'orders'

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
      const { data: d } = await axios.get('/api/orders/analytics', config);
      setData(d);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAnalytics(); }, [userInfo]);

  const exportToCSV = () => {
    if (!data) return;
    let csv = "data:text/csv;charset=utf-8,";
    csv += "=== KPIs ===\nВыручка,Заказов,Средний чек,Благотворительность\n";
    csv += `${data.kpis.totalRevenue},${data.kpis.totalOrders},${data.kpis.averageOrderValue},${Math.round(data.kpis.totalRevenue * 0.2)}\n\n`;
    csv += "=== Продажи по дням ===\nДата,Выручка,Заказов\n";
    data.salesData.forEach(r => { csv += `${r.date},${r.revenue},${r.orders}\n`; });
    csv += "\n=== Топ товары ===\nТовар,Кол-во,Выручка\n";
    data.topProducts.forEach(r => { csv += `"${r.name}",${r.quantity},${r.revenue}\n`; });
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csv));
    link.setAttribute('download', `fateleaf_analytics_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="flex flex-col items-center justify-center py-28 gap-5">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}>
        <Loader2 className="w-12 h-12 text-tea-gold" />
      </motion.div>
      <p className="text-gray-400 font-medium">{t('adminStats.loading')}</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="text-red-400 text-5xl">⚠️</div>
      <p className="text-red-500 font-bold text-lg">{t('adminStats.errorPrefix')} {error}</p>
      <button onClick={fetchAnalytics} className="px-5 py-2.5 bg-tea-dark text-white rounded-xl font-medium flex items-center gap-2 hover:bg-tea-gold transition">
        <RefreshCw size={16}/> {t('adminStats.tryAgain')}
      </button>
    </div>
  );

  const maxQty     = Math.max(...(data.topProducts.map(p => p.quantity)), 1);
  const maxRevenue = Math.max(...(data.topProducts.map(p => p.revenue)), 1);
  const deliveryRate = data.kpis.totalOrders > 0
    ? Math.round((data.orderStatuses.find(s => s.name === 'Доставлено')?.value || 0) / data.kpis.totalOrders * 100)
    : 0;

  // Compute orders-per-day for dual-view toggle
  const chartData = data.salesData.map(d => ({
    ...d,
    dateShort: d.date.slice(5), // MM-DD
  }));

  return (
    <div className="space-y-8">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-tea-dark dark:text-tea-light tracking-tight">
            {t('adminStats.title')}
          </h1>
          <p className="text-gray-400 mt-1 text-sm">{t('adminStats.subtitle')}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchAnalytics}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-200 transition font-medium text-sm">
            <RefreshCw size={15}/> {t('adminStats.refresh')}
          </button>
          <button onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-tea-dark to-tea-green text-white rounded-xl hover:opacity-90 transition shadow-lg dark:shadow-black/50 font-medium text-sm">
            <Download size={15}/> {t('adminStats.exportCsv')}
          </button>
        </div>
      </motion.div>

      {/* ── KPI Cards ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5">
        {[
          {
            icon: DollarSign, label: t('adminStats.kpiRevenue'), delay: 0.05,
            value: data.kpis.totalRevenue, suffix: ' ₽',
            gradient: 'from-violet-500 to-indigo-500', bg: 'bg-violet-50', text: 'text-violet-600',
            sub: t('adminStats.kpiRevSub'), subIcon: ArrowUpRight,
          },
          {
            icon: Heart, label: t('adminStats.kpiCharity'), delay: 0.10,
            value: Math.round(data.kpis.totalRevenue * 0.2), suffix: ' ₽',
            gradient: 'from-red-400 to-rose-500', bg: 'bg-red-50', text: 'text-red-500',
            sub: t('adminStats.kpiCharitySub'), subIcon: ArrowUpRight,
          },
          {
            icon: ShoppingBag, label: t('adminStats.kpiOrders'), delay: 0.15,
            value: data.kpis.totalOrders, suffix: '',
            gradient: 'from-emerald-400 to-teal-500', bg: 'bg-emerald-50', text: 'text-emerald-600',
            sub: `${deliveryRate}% ` + ' ' + t('adminStats.kpiOrdersSub'), subIcon: Target,
          },
          {
            icon: TrendingUp, label: t('adminStats.kpiAOV'), delay: 0.20,
            value: data.kpis.averageOrderValue, suffix: ' ₽',
            gradient: 'from-amber-400 to-orange-500', bg: 'bg-amber-50', text: 'text-amber-600',
            sub: t('adminStats.kpiAOVSub'), subIcon: Zap,
          },
          {
            icon: Star, label: t('adminStats.kpiDelSpeed'), delay: 0.25,
            value: deliveryRate, suffix: '%',
            gradient: 'from-pink-400 to-rose-500', bg: 'bg-pink-50', text: 'text-pink-600',
            sub: t('adminStats.kpiDelSpeedSub'), subIcon: ArrowUpRight,
          },
        ].map(({ icon: Icon, label, delay, value, suffix, gradient, bg, text, sub, subIcon: SubIcon }) => (
          <Card key={label} delay={delay}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl ${bg} ${text} flex items-center justify-center flex-shrink-0`}>
                  <Icon size={22} />
                </div>
                <span className={`text-xs font-bold ${text} ${bg} px-2.5 py-1 rounded-full`}>
                  30 дн.
                </span>
              </div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1.5">{label}</p>
              <p className={`text-2xl font-extrabold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
                <AnimatedNumber value={value} suffix={suffix} delay={delay * 1000} />
              </p>
              <div className="flex items-center gap-1.5 mt-3 text-gray-400 text-xs">
                <SubIcon size={12} />
                <span>{sub}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* ── Main Chart: Revenue / Orders toggle ────────────────────────────── */}
      <Card delay={0.3} className="overflow-hidden">
        <div className="p-6 pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-tea-dark dark:text-tea-light">{t('adminStats.chartTitle')}</h3>
            <p className="text-xs text-gray-400 mt-0.5">{t('adminStats.chartSub')}</p>
          </div>
          <div className="flex bg-gray-100 p-1 rounded-xl self-start sm:self-auto">
            {[['revenue', t('adminStats.chartRev')], ['orders', t('adminStats.chartOrd')]].map(([key, lbl]) => (
              <button key={key} onClick={() => setActiveTab(key)}
                className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition ${
                  activeTab === key ? 'bg-white dark:bg-[#23312B] text-tea-dark dark:text-tea-light shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:text-gray-400'
                }`}>{lbl}</button>
            ))}
          </div>
        </div>
        <div className="h-[280px] w-full px-4 py-4">
          <ResponsiveContainer width="100%" height="100%" minWidth={1}>
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6366F1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="gradOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
              <XAxis dataKey="dateShort" stroke="#D1D5DB" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#D1D5DB" fontSize={11} tickLine={false} axisLine={false}
                tickFormatter={(v) => activeTab === 'revenue' ? `${(v/1000).toFixed(0)}k` : v} />
              <Tooltip content={<CustomTooltip
                valueSuffix={activeTab === 'revenue' ? ' ₽' : ' ' + t('adminStats.pcs')}
              />} />
              <AnimatePresence>
                {activeTab === 'revenue' ? (
                  <Area type="monotone" dataKey="revenue" stroke="#6366F1" strokeWidth={2.5}
                    fill="url(#gradRevenue)" dot={{ r: 3, fill: '#6366F1', strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: '#6366F1' }} isAnimationActive animationDuration={800} />
                ) : (
                  <Area type="monotone" dataKey="orders" stroke="#10B981" strokeWidth={2.5}
                    fill="url(#gradOrders)" dot={{ r: 3, fill: '#10B981', strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: '#10B981' }} isAnimationActive animationDuration={800} />
                )}
              </AnimatePresence>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* ── Row 3: Pie + Radial ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Status Donut */}
        <Card delay={0.38}>
          <div className="p-6">
            <h3 className="text-lg font-bold text-tea-dark dark:text-tea-light mb-1">{t('adminStats.pieTitle')}</h3>
            <p className="text-xs text-gray-400 mb-4">{t('adminStats.pieSub')}</p>
            <div className="flex items-center gap-6">
              <div className="h-[200px] flex-1">
                <ResponsiveContainer width="100%" height="100%" minWidth={1}>
                  <PieChart>
                    <Pie data={data.orderStatuses} cx="50%" cy="50%"
                      innerRadius={52} outerRadius={78} paddingAngle={4} dataKey="value"
                      isAnimationActive animationBegin={200} animationDuration={900}>
                      {data.orderStatuses.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]}
                          stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.10)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3 flex-shrink-0">
                {data.orderStatuses.map((s, i) => (
                  <div key={s.name} className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[i] }} />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{s.name}</p>
                      <p className="text-sm font-extrabold text-tea-dark dark:text-tea-light">{s.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Delivery Rate Radial */}
        <Card delay={0.44}>
          <div className="p-6">
            <h3 className="text-lg font-bold text-tea-dark dark:text-tea-light mb-1">{t('adminStats.effTitle')}</h3>
            <p className="text-xs text-gray-400 mb-4">{t('adminStats.effSub')}</p>
            <div className="space-y-5">
              {[
                { label: t('adminStats.effDelivered'), value: deliveryRate, max: 100, color: '#10B981', suffix: '%' },
                {
                  label: t('adminStats.effCanceled'),
                  value: data.kpis.totalOrders > 0
                    ? Math.round((data.orderStatuses.find(s=>s.name==='Отменено')?.value||0)/data.kpis.totalOrders*100)
                    : 0,
                  max: 100, color: '#F59E0B', suffix: '%'
                },
                {
                  label: t('adminStats.effProcessing'),
                  value: data.kpis.totalOrders > 0
                    ? Math.round((data.orderStatuses.find(s=>s.name===t('adminStats.effProcessing'))?.value||0)/data.kpis.totalOrders*100)
                    : 0,
                  max: 100, color: '#6366F1', suffix: '%'
                },
              ].map(({ label, value, max, color, suffix }) => (
                <div key={label}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</span>
                    <span className="text-sm font-extrabold" style={{ color }}>{value}{suffix}</span>
                  </div>
                  <ProgressBar value={value} max={max} color={color} />
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* ── Top Products custom list ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* By Quantity */}
        <Card delay={0.5}>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
                <Package size={18}/>
              </div>
              <div>
                <h3 className="text-base font-bold text-tea-dark dark:text-tea-light leading-none">{t('adminStats.topQtyTitle')}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{t('adminStats.topQtySub')}</p>
              </div>
            </div>
            <div className="space-y-3">
              {data.topProducts.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-6">{t('adminStats.noDataTop')}</p>
              ) : data.topProducts.map((p, i) => (
                <motion.div key={p.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.07 }} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-extrabold text-white flex-shrink-0"
                    style={{ background: ['#6366F1','#8B5CF6','#A78BFA','#C4B5FD','#DDD6FE'][i] }}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-tea-dark dark:text-tea-light truncate">{p.name}</p>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mt-1">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${(p.quantity/maxQty)*100}%` }}
                        transition={{ duration: 1, delay: 0.6 + i * 0.07, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{ background: 'linear-gradient(90deg, #6366F1, #A78BFA)' }} />
                    </div>
                  </div>
                  <span className="text-sm font-extrabold text-indigo-500 flex-shrink-0 w-14 text-right">
                    {p.quantity} {t('adminStats.pcs')}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>

        {/* By Revenue */}
        <Card delay={0.56}>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                <BarChart2 size={18}/>
              </div>
              <div>
                <h3 className="text-base font-bold text-tea-dark dark:text-tea-light leading-none">{t('adminStats.topRevTitle')}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{t('adminStats.topRevSub')}</p>
              </div>
            </div>
            <div className="space-y-3">
              {data.topProducts.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-6">{t('adminStats.noDataTop')}</p>
              ) : [...data.topProducts].sort((a,b) => b.revenue - a.revenue).map((p, i) => (
                <motion.div key={p.name} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.56 + i * 0.07 }} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-extrabold text-white flex-shrink-0"
                    style={{ background: ['#F59E0B','#FBBF24','#FCD34D','#FDE68A','#FEF3C7'][i], color: i > 1 ? '#92400E' : 'white' }}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-tea-dark dark:text-tea-light truncate">{p.name}</p>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mt-1">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${(p.revenue/maxRevenue)*100}%` }}
                        transition={{ duration: 1, delay: 0.66 + i * 0.07, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{ background: 'linear-gradient(90deg, #F59E0B, #FBBF24)' }} />
                    </div>
                  </div>
                  <span className="text-sm font-extrabold text-amber-500 flex-shrink-0 w-24 text-right">
                    {p.revenue.toLocaleString('ru-RU')} ₽
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* ── Orders per day bar chart ─────────────────────────────────────────── */}
      <Card delay={0.62}>
        <div className="p-6 pb-0 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-tea-dark dark:text-tea-light">{t('adminStats.barTitle')}</h3>
            <p className="text-xs text-gray-400 mt-0.5">{t('adminStats.barSub')}</p>
          </div>
        </div>
        <div className="h-[220px] w-full px-4 py-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }} barCategoryGap="30%">
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#10B981" stopOpacity={0.95}/>
                  <stop offset="100%" stopColor="#10B981" stopOpacity={0.3}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
              <XAxis dataKey="dateShort" stroke="#D1D5DB" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#D1D5DB" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip valueSuffix="" />} cursor={{ fill: 'rgba(16,185,129,0.06)', radius: 8 }} />
              <Bar dataKey="orders" fill="url(#barGrad)" radius={[6,6,0,0]} isAnimationActive animationDuration={900} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

    </div>
  );
};

export default AdminStats;
