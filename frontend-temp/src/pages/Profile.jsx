import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, Lock, Camera, Save, Edit2, ShoppingBag, 
  Calendar, DollarSign, CheckCircle2, Clock, XCircle, Loader2, 
  Eye, EyeOff, ArrowLeft, Key
} from 'lucide-react';
import { setCredentials } from '../store/authSlice';
import toast from 'react-hot-toast';

const Profile = () => {
  const { t } = useTranslation();
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  // Profile Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userInfo?.name || '');
  const [email, setEmail] = useState(userInfo?.email || '');
  const [phone, setPhone] = useState(userInfo?.phone || '');
  const [avatar, setAvatar] = useState(userInfo?.avatar || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password Visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Upload state
  const [uploading, setUploading] = useState(false);

  // Orders State
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Sync state if userInfo changes
  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name || '');
      setEmail(userInfo.email || '');
      setPhone(userInfo.phone || '');
      setAvatar(userInfo.avatar || '');
    }
  }, [userInfo]);

  // Fetch user orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!userInfo) return;
      setLoadingOrders(true);
      try {
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };
        const { data } = await axios.get('/api/orders/my', config);
        setOrders(data);
      } catch (err) {
        console.error('Ошибка загрузки заказов:', err);
        toast.error(t('profile.errorLoadOrders'));
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [userInfo]);

  if (!userInfo) {
    return <Navigate to="/login" />;
  }

  // Handle avatar upload
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post('/api/upload', formData, config);
      setAvatar(data.image);
      toast.success(t('profile.avatarSuccess'));
    } catch (err) {
      console.error('Ошибка загрузки фото:', err);
      toast.error(err.response?.data?.message || t('profile.avatarError'));
    } finally {
      setUploading(false);
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Submit profile edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error(t('profile.passwordMismatch'));
      return;
    }

    const loadId = toast.loading(t('profile.saving'));

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const updateData = { name, email, phone, avatar };
      if (password) {
        updateData.password = password;
      }

      const { data } = await axios.put('/api/auth/profile', updateData, config);
      
      // Update redux state and localStorage
      dispatch(setCredentials(data));
      setIsEditing(false);
      setPassword('');
      setConfirmPassword('');
      toast.success(t('profile.updateSuccess'), { id: loadId });
    } catch (err) {
      console.error(t('profile.updateError'), err);
      toast.error(err.response?.data?.message || t('profile.updateError'), { id: loadId });
    }
  };

  // Format Date helpers
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Заголовок страницы */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-tea-dark dark:text-tea-light">{t('profile.title')}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Добро пожаловать, <span className="font-semibold text-tea-gold">{userInfo.name}</span>
          </p>
        </div>
        {userInfo.role === 'admin' && (
          <Link 
            to="/admin" 
            className="flex items-center gap-2 bg-tea-dark text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-tea-gold hover:text-tea-dark dark:text-tea-light transition shadow-md dark:shadow-black/40"
          >
            Панель управления
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Колонна 1: Профиль / Личные данные (Занимает 1 часть из 3) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-[#23312B] rounded-3xl p-6 shadow-[0_4px_20px_rgba(52,78,65,0.06)] border border-tea-green/10 relative overflow-hidden">
            {/* Декоративный зеленый фон в шапке карточки */}
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-tea-dark to-tea-green/80" />
            
            {/* Аватарка */}
            <div className="relative flex flex-col items-center pt-8 z-10">
              <div 
                onClick={triggerFileInput}
                className="group relative w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg dark:shadow-black/50 cursor-pointer bg-tea-light dark:bg-[#1A2421] flex items-center justify-center transition-all duration-300 hover:scale-105"
              >
                {uploading ? (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-white" />
                  </div>
                ) : avatar ? (
                  <img 
                    src={avatar} 
                    alt={name} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <User className="w-16 h-16 text-tea-green" />
                )}

                {/* Overlay при наведении */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[11px] font-bold transition-opacity duration-300">
                  <Camera size={18} className="mb-1" />
                  <span>{t('profile.edit')}</span>
                </div>
              </div>

              {/* Скрытый инпут для выбора файла */}
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleAvatarChange}
                accept="image/*"
                className="hidden" 
              />

              <h2 className="text-xl font-bold mt-4 text-tea-dark dark:text-tea-light text-center">{name}</h2>
              <div className="flex gap-2 mt-2">
                <span className="text-xs bg-tea-light dark:bg-[#1A2421] text-tea-dark dark:text-tea-light border border-tea-green/30 dark:border-[#3A5243] px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                  {userInfo.role === 'admin' ? 'Администратор' : 'Покупатель'}
                </span>
                <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-500 border border-amber-200 dark:border-amber-800/50 px-3 py-1 rounded-full font-bold uppercase tracking-wider flex items-center">
                  🍃 {userInfo.teaPoints || 0} баллов
                </span>
              </div>
            </div>

            {/* Блок с деталями профиля */}
            <div className="mt-8 border-t border-gray-100 dark:border-[#3A5243] pt-6">
              <AnimatePresence mode="wait">
                {!isEditing ? (
                  <motion.div 
                    key="info"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-tea-light dark:bg-[#1A2421] flex items-center justify-center text-tea-dark dark:text-tea-light">
                        <Mail size={16} />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Email</p>
                        <p className="text-sm font-medium text-tea-dark dark:text-tea-light">{email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-tea-light dark:bg-[#1A2421] flex items-center justify-center text-tea-dark dark:text-tea-light">
                        <Phone size={16} />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Телефон</p>
                        <p className="text-sm font-medium text-tea-dark dark:text-tea-light">{phone || 'Не указан'}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsEditing(true)}
                      className="w-full mt-6 bg-tea-gold hover:bg-tea-dark text-white hover:text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 shadow-md dark:shadow-black/40 hover:shadow-lg dark:shadow-black/50 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Edit2 size={16} />
                      Редактировать профиль
                    </button>
                  </motion.div>
                ) : (
                  <motion.form 
                    key="form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">{t('profile.name')}</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input 
                          type="text" 
                          required 
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-[#1A2421] border border-gray-200 dark:border-[#3A5243] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-tea-gold/30 focus:border-tea-gold transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input 
                          type="email" 
                          required 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-[#1A2421] border border-gray-200 dark:border-[#3A5243] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-tea-gold/30 focus:border-tea-gold transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Телефон</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input 
                          type="tel" 
                          value={phone}
                          placeholder="+998 (__) ___-__-__"
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-[#1A2421] border border-gray-200 dark:border-[#3A5243] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-tea-gold/30 focus:border-tea-gold transition"
                        />
                      </div>
                    </div>

                    <div className="border-t border-gray-100 dark:border-[#3A5243] pt-3 mt-3">
                      <p className="text-xs text-gray-400 mb-3 flex items-center gap-1.5 font-medium">
                        <Key size={12} /> Изменение пароля (оставьте пустым, если не хотите менять)
                      </p>
                      
                      <div className="space-y-3">
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                          <input 
                            type={showPassword ? 'text' : 'password'} 
                            placeholder="Новый пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-10 py-2 bg-gray-50 dark:bg-[#1A2421] border border-gray-200 dark:border-[#3A5243] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-tea-gold/30 focus:border-tea-gold transition"
                          />
                          <button 
                            type="button" 
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-tea-dark dark:text-tea-light transition"
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>

                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                          <input 
                            type={showConfirmPassword ? 'text' : 'password'} 
                            placeholder="Подтвердите новый пароль"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full pl-10 pr-10 py-2 bg-gray-50 dark:bg-[#1A2421] border border-gray-200 dark:border-[#3A5243] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-tea-gold/30 focus:border-tea-gold transition"
                          />
                          <button 
                            type="button" 
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-tea-dark dark:text-tea-light transition"
                          >
                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-6">
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setName(userInfo.name);
                          setEmail(userInfo.email);
                          setPhone(userInfo.phone || '');
                          setAvatar(userInfo.avatar || '');
                          setPassword('');
                          setConfirmPassword('');
                        }}
                        className="flex-1 border border-gray-200 dark:border-[#3A5243] hover:bg-gray-50 dark:bg-[#1A2421] text-gray-600 dark:text-gray-400 font-bold py-2.5 px-4 rounded-xl transition text-sm flex items-center justify-center gap-1 cursor-pointer"
                      >
                        Отмена
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-tea-dark hover:bg-tea-gold text-white font-bold py-2.5 px-4 rounded-xl transition shadow-md dark:shadow-black/40 text-sm flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Save size={14} />
                        Сохранить
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Колонна 2: История заказов (Занимает 2 части из 3) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-[#23312B] rounded-3xl p-6 shadow-[0_4px_20px_rgba(52,78,65,0.06)] border border-tea-green/10 min-h-[400px] flex flex-col">
            <div className="flex items-center gap-2 border-b border-gray-100 dark:border-[#3A5243] pb-4 mb-6">
              <ShoppingBag className="text-tea-dark dark:text-tea-light" size={22} />
              <h2 className="text-xl font-bold text-tea-dark dark:text-tea-light">{t('profile.orderHistory')}</h2>
            </div>

            {loadingOrders ? (
              <div className="flex-grow flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-tea-gold" />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 font-medium">{t('profile.loadingOrders')}</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="flex-grow flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 bg-tea-light dark:bg-[#1A2421] rounded-full flex items-center justify-center text-tea-green mb-4 shadow-inner">
                  <ShoppingBag size={28} />
                </div>
                <h3 className="text-lg font-bold text-tea-dark dark:text-tea-light">{t('profile.noOrders')}</h3>
                <p className="text-sm text-gray-400 max-w-sm mt-2">
                  Откройте наш каталог изысканных чайных купажей и соберите свой первый заказ прямо сейчас!
                </p>
                <Link
                  to="/catalog"
                  className="mt-6 bg-tea-gold hover:bg-tea-dark text-white font-bold py-3 px-6 rounded-xl shadow-md dark:shadow-black/40 transition-all duration-300 flex items-center gap-2"
                >
                  <ArrowLeft size={16} className="rotate-180" /> Перейти в каталог
                </Link>
              </div>
            ) : (
              <div className="space-y-6 flex-grow overflow-y-auto max-h-[600px] pr-2">
                {orders.map((order) => {
                  // Determine status styling
                  let statusText = t('profile.statusProcessing');
                  let statusColorClass = 'bg-yellow-50 text-yellow-700 border-yellow-100';
                  let StatusIcon = Clock;

                  if (order.isDelivered) {
                    statusText = t('profile.statusDelivered');
                    statusColorClass = 'bg-green-50 text-green-700 border-green-100';
                    StatusIcon = CheckCircle2;
                  } else if (order.isCancelled) {
                    statusText = t('profile.statusCancelled');
                    statusColorClass = 'bg-red-50 text-red-700 border-red-100';
                    StatusIcon = XCircle;
                  }

                  return (
                    <motion.div
                      key={order._id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-50 dark:bg-[#1A2421]/50 hover:bg-gray-50 dark:bg-[#1A2421] rounded-2xl p-5 border border-gray-100 dark:border-[#3A5243] transition-all duration-300"
                    >
                      {/* Шапка заказа */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-[#3A5243] pb-3.5 mb-4">
                        <div>
                          <div className="flex items-center gap-2.5">
                            <span className="text-sm font-bold text-tea-dark dark:text-tea-light">Заказ #{order._id.slice(-8).toUpperCase()}</span>
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${statusColorClass}`}>
                              <StatusIcon size={12} />
                              {statusText}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                            <Calendar size={12} />
                            <span>{formatDate(order.createdAt)}</span>
                          </div>
                        </div>
                        <div className="text-right sm:text-right flex sm:flex-col justify-between items-center sm:items-end">
                          <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">{t('profile.orderTotal')}</span>
                          <span className="text-lg font-bold text-tea-dark dark:text-tea-light">{order.totalPrice.toLocaleString('ru-RU')} ₽</span>
                        </div>
                      </div>

                      {/* Список товаров заказа */}
                      <div className="space-y-3">
                        {order.orderItems.map((item, index) => (
                          <div key={index} className="flex items-center justify-between gap-3 bg-white dark:bg-[#23312B]/60 p-2 rounded-xl border border-gray-100 dark:border-[#3A5243]/50">
                            <div className="flex items-center gap-3">
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className="w-12 h-12 rounded-lg object-cover bg-gray-50 dark:bg-[#1A2421] border border-gray-100 dark:border-[#3A5243]"
                                onError={(e) => { e.target.src = '/placeholder.svg'; }}
                              />
                              <div>
                                <p className="text-sm font-bold text-tea-dark dark:text-tea-light line-clamp-1">{item.name}</p>
                                <p className="text-xs text-gray-400">
                                  {item.price.toLocaleString('ru-RU')} ₽ × {item.qty} шт.
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-bold text-tea-dark dark:text-tea-light">
                                {(item.price * item.qty).toLocaleString('ru-RU')} ₽
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Дополнительная инфо (Адрес доставки) */}
                      {order.shippingAddress && (
                        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-[#3A5243]/50 text-[11px] text-gray-400 flex flex-wrap gap-x-4">
                          <span>
                            <span className="font-semibold text-gray-500 dark:text-gray-400">{t('profile.shippingAddress')}: </span>
                            {order.shippingAddress.city}, {order.shippingAddress.address}
                          </span>
                          <span>
                            <span className="font-semibold text-gray-500 dark:text-gray-400">{t('profile.payment')}: </span>
                            {order.paymentMethod === 'cash' ? t('profile.cashOnDelivery') : order.paymentMethod}
                          </span>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
