import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MapPin, User, CreditCard, Percent, ChevronRight, X, Info, Trash2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { clearCart } from '../store/cartSlice';
import { getProductImage } from '../utils/imageHelper';

const Checkout = () => {
  const { t, i18n } = useTranslation();
  const { items: cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [deliveryMethod, setDeliveryMethod] = useState('pickup');
  const [paymentMethod, setPaymentMethod] = useState('upon_receipt');
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [orderedItems, setOrderedItems] = useState([]);
  const [usePoints, setUsePoints] = useState(false);

  if (!userInfo) {
    navigate('/login?redirect=/checkout');
    return null;
  }

  if (cartItems.length === 0 && !isSuccessModalOpen) {
    navigate('/cart');
    return null;
  }

  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const totalWithoutDiscount = cartItems.reduce((acc, item) => {
    const basePrice = item.oldPrice || Math.round(item.price * 1.15);
    return acc + basePrice * item.qty;
  }, 0);
  const totalWithCard = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const productsDiscount = totalWithoutDiscount - totalWithCard;
  
  let deliveryCost = deliveryMethod === 'courier' ? 30000 : 0; // 30 000 сум курьер
  if (totalWithCard > 200000) deliveryCost = 0; // Бесплатно от 200 000

  let promoDiscount = 0;
  if (appliedPromo) {
    if (appliedPromo.discountType === 'Скидка %') {
      promoDiscount = Math.round(totalWithCard * (appliedPromo.discountValue / 100));
    } else if (appliedPromo.discountType === 'Скидка ₽') {
      promoDiscount = appliedPromo.discountValue;
    } else {
      promoDiscount = Math.round(totalWithCard * 0.1); // Fallback
    }
    if (promoDiscount > totalWithCard) {
      promoDiscount = totalWithCard;
    }
  }

  let pointsDiscount = 0;
  if (usePoints && userInfo?.teaPoints > 0) {
    // 1 point = 1 RUB. Max discount is 50% of order total
    const maxDiscount = Math.floor(totalWithCard * 0.5);
    pointsDiscount = Math.min(userInfo.teaPoints, maxDiscount);
  }

  const finalTotal = totalWithCard + deliveryCost - promoDiscount - pointsDiscount;

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.post('/api/coupons/validate', { code: promoCode }, config);
      setAppliedPromo(data);
      toast.success(t('checkout.promoApplied'));
      setIsPromoModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || t('checkout.invalidPromo'));
    }
  };

  const handlePlaceOrder = async () => {
    try {
      const orderData = {
        orderItems: cartItems,
        shippingAddress: {
          address: deliveryMethod === 'pickup' ? 'Пункт выдачи: ул. Амира Темура, 107' : 'Новый адрес',
          city: 'Ташкент',
          postalCode: '100000',
          country: 'Узбекистан',
        },
        paymentMethod,
        totalPrice: finalTotal,
        pointsUsed: pointsDiscount,
      };

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.post('/api/orders', orderData, config);

      setOrderedItems(cartItems);
      setIsSuccessModalOpen(true);
      dispatch(clearCart());
      toast.success(t('checkout.orderSuccess'));
    } catch (error) {
      console.error('Ошибка при оформлении заказа', error);
      toast.error(t('checkout.orderError'));
    }
  };

  // Получаем завтрашнюю дату
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const deliveryDateFormatted = `${t('checkout.tomorrow')}, ${tomorrow.getDate()} ${tomorrow.toLocaleString(i18n.language === 'ru' ? 'ru-RU' : 'en-US', { month: 'long' })}`;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-[#1A2421]/50 min-h-screen">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-6 text-tea-dark dark:text-tea-light">{t('checkout.title')}</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">{t('checkout.deliveryFateLeaf')}</p>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Левая колонка */}
        <div className="flex-grow space-y-4">
          
          {/* Способ получения */}
          <div className="bg-white dark:bg-[#23312B] rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-[#3A5243] p-6">
            <h2 className="text-xl font-bold text-tea-dark dark:text-tea-light mb-4">{t('checkout.receiveMethod')}</h2>
            
            {/* Табы Способ получения */}
            <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
              <button
                onClick={() => setDeliveryMethod('pickup')}
                className={`flex-1 py-3 text-center rounded-lg font-medium transition flex flex-col items-center justify-center ${deliveryMethod === 'pickup' ? 'bg-white dark:bg-[#23312B] shadow-sm text-tea-dark dark:text-tea-light' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:text-gray-300'}`}
              >
                <span>{t('checkout.pickup')}</span>
                <span className="text-xs text-green-500 font-bold mt-0.5">{t('checkout.free')}</span>
              </button>
              <button
                onClick={() => setDeliveryMethod('courier')}
                className={`flex-1 py-3 text-center rounded-lg font-medium transition flex flex-col items-center justify-center ${deliveryMethod === 'courier' ? 'bg-white dark:bg-[#23312B] shadow-sm text-tea-dark dark:text-tea-light' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:text-gray-300'}`}
              >
                <span>{t('checkout.courier')}</span>
                <span className="text-xs text-gray-400 mt-0.5">{t('checkout.courierCost')}</span>
              </button>
            </div>

            {/* Адрес */}
            <div className="flex items-start mb-6">
              <div className="w-10 h-10 rounded-full bg-tea-light dark:bg-[#1A2421] flex items-center justify-center flex-shrink-0 text-tea-dark dark:text-tea-light mr-4">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {deliveryMethod === 'pickup' ? t('checkout.pickupPoint') : t('checkout.courierDelivery')}
                </p>
                <p className="font-bold text-tea-dark dark:text-tea-light text-lg mb-1">
                  {deliveryMethod === 'pickup' ? t('checkout.pickupAddress') : t('checkout.addNewAddress')}
                </p>
                <p className="text-sm text-gray-400">
                  {deliveryMethod === 'pickup' ? t('checkout.pickupHint') : t('checkout.doorDelivery')}
                </p>
              </div>
            </div>

            <button 
              onClick={() => setIsAddressModalOpen(true)}
              className="w-full bg-gray-100 hover:bg-gray-200 text-tea-dark dark:text-tea-light font-bold py-3.5 rounded-xl transition"
            >
              Выбрать другой
            </button>
          </div>

          {/* Получатель */}
          <div className="bg-white dark:bg-[#23312B] rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-[#3A5243] p-6 flex justify-between items-center cursor-pointer hover:border-tea-gold/30 transition">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 mr-4">
                <User size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-0.5">{t('checkout.receiver')}</p>
                <p className="font-bold text-tea-dark dark:text-tea-light">{userInfo.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{userInfo.email}</p>
              </div>
            </div>
            <ChevronRight className="text-gray-400" />
          </div>

          {/* Дата доставки */}
          <div className="bg-white dark:bg-[#23312B] rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-[#3A5243] p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-tea-dark dark:text-tea-light">{deliveryDateFormatted}</h2>
              <Info size={20} className="text-gray-400" />
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {cartItems.map((item) => (
                <div key={item._id} className="relative w-16 h-16 rounded-xl border border-gray-200 dark:border-[#3A5243] overflow-hidden flex-shrink-0">
                  <img src={getProductImage(item)} alt={item.name} className="w-full h-full object-cover" />
                  {item.qty > 1 && (
                    <span className="absolute -bottom-1 -right-1 bg-tea-dark text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                      {item.qty}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Способ оплаты */}
          <div className="bg-white dark:bg-[#23312B] rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-[#3A5243] p-6">
            <h2 className="text-xl font-bold text-tea-dark dark:text-tea-light mb-4">{t('checkout.paymentMethod')}</h2>
            
            <div className="space-y-3">
              {/* Онлайн картой */}
              <label className={`flex items-start p-4 border rounded-xl cursor-pointer transition ${paymentMethod === 'online' ? 'border-tea-gold bg-tea-light dark:bg-[#1A2421]/30' : 'border-gray-200 dark:border-[#3A5243] hover:border-gray-300'}`}>
                <input 
                  type="radio" 
                  name="payment" 
                  checked={paymentMethod === 'online'} 
                  onChange={() => setPaymentMethod('online')}
                  className="mt-1 w-5 h-5 text-tea-dark dark:text-tea-light focus:ring-tea-gold"
                />
                <div className="ml-4 flex-grow">
                  <div className="flex items-center mb-1">
                    <CreditCard size={18} className="text-blue-500 mr-2" />
                    <span className="font-bold text-tea-dark dark:text-tea-light">{t('checkout.onlineCard')}</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('checkout.cardTypes')}</p>
                </div>
              </label>

              {/* При получении */}
              <label className={`flex items-start p-4 border rounded-xl cursor-pointer transition relative overflow-hidden ${paymentMethod === 'upon_receipt' ? 'border-tea-gold bg-tea-light dark:bg-[#1A2421]/30' : 'border-gray-200 dark:border-[#3A5243] hover:border-gray-300'}`}>
                <input 
                  type="radio" 
                  name="payment" 
                  checked={paymentMethod === 'upon_receipt'} 
                  onChange={() => setPaymentMethod('upon_receipt')}
                  className="mt-1 w-5 h-5 text-tea-dark dark:text-tea-light focus:ring-tea-gold"
                />
                <div className="ml-4 flex-grow relative z-10">
                  <div className="flex items-center mb-1">
                    <span className="font-bold text-tea-dark dark:text-tea-light">{t('checkout.uponReceipt')}</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{t('checkout.receiptHint1')}</p>
                  
                  {paymentMethod === 'upon_receipt' && (
                    <div className="bg-tea-light dark:bg-[#1A2421]/50 text-tea-dark dark:text-tea-light p-3 rounded-lg text-xs flex items-start">
                      <Info size={14} className="mr-2 flex-shrink-0 mt-0.5" />
                      Если заказ не забрать вовремя, новые покупки можно будет оплатить только картой онлайн.
                    </div>
                  )}
                </div>
              </label>
            </div>
          </div>

        </div>

        {/* Правая колонка */}
        <div className="w-full lg:w-[400px] flex-shrink-0 space-y-4">
          
          {/* Итоги заказа */}
          <div className="bg-white dark:bg-[#23312B] rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-[#3A5243] p-6">
            <h2 className="text-xl font-bold text-tea-dark dark:text-tea-light mb-6">{t('checkout.yourOrder')}</h2>
            
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 mb-6">
              <div className="flex justify-between">
                <span>{t('checkout.itemsCount').replace('{{count}}', totalItems)}</span>
                <span>{totalWithoutDiscount} {t('checkout.sum')}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('checkout.delivery')}</span>
                {deliveryCost === 0 ? (
                  <span className="text-green-500 font-bold">{t('checkout.free')}</span>
                ) : (
                  <span>{deliveryCost} {t('checkout.sum')}</span>
                )}
              </div>
              <div className="flex justify-between">
                <span>{t('checkout.discounts')}</span>
                <span className="text-red-500">-{productsDiscount} {t('checkout.sum')}</span>
              </div>
              {promoDiscount > 0 && (
                <div className="flex justify-between">
                  <span>{t('checkout.promo')}</span>
                  <span className="text-red-500">-{promoDiscount} {t('checkout.sum')}</span>
                </div>
              )}
              {pointsDiscount > 0 && (
                <div className="flex justify-between font-bold">
                  <span>Чайные баллы 🍃</span>
                  <span className="text-tea-gold">-{pointsDiscount} ₽</span>
                </div>
              )}
            </div>

            {userInfo?.teaPoints > 0 && (
              <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl">
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      checked={usePoints} 
                      onChange={(e) => setUsePoints(e.target.checked)} 
                      className="w-5 h-5 text-tea-gold rounded focus:ring-tea-gold"
                    />
                    <div className="ml-3">
                      <span className="font-bold text-amber-800 dark:text-amber-500 block">Использовать баллы</span>
                      <span className="text-xs text-amber-600 dark:text-amber-600">Доступно: {userInfo.teaPoints} 🍃</span>
                    </div>
                  </div>
                </label>
              </div>
            )}

            <div className="border-t border-gray-100 dark:border-[#3A5243] pt-4 mb-6">
              <div className="flex justify-between items-center mb-1">
                <span className="text-lg font-bold text-tea-dark dark:text-tea-light">{t('checkout.total')}</span>
                <span className="text-2xl font-bold text-tea-dark dark:text-tea-light">{finalTotal} {t('checkout.sum')}</span>
              </div>
            </div>

            <button 
              onClick={handlePlaceOrder}
              className="w-full py-4 bg-tea-dark hover:bg-tea-gold text-white font-bold rounded-xl text-lg transition shadow-md dark:shadow-black/40"
            >
              Оформить заказ
            </button>
            <p className="text-[11px] text-gray-400 mt-4 leading-tight">
              Размещая заказ, вы даете согласие на обработку персональных данных в соответствии с Политикой конфиденциальности.
            </p>
          </div>

          {/* Промокод */}
          <div className="bg-white dark:bg-[#23312B] rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-[#3A5243] p-6">
            <h2 className="text-lg font-bold text-tea-dark dark:text-tea-light mb-4">{t('checkout.promo')}</h2>
            <div 
              onClick={() => setIsPromoModalOpen(true)}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#1A2421] hover:bg-gray-100 rounded-xl cursor-pointer border border-transparent hover:border-gray-200 dark:border-[#3A5243] transition"
            >
              <div className="flex items-center text-tea-dark dark:text-tea-light font-medium">
                <div className="w-8 h-8 rounded-full bg-tea-light dark:bg-[#1A2421] flex items-center justify-center text-tea-dark dark:text-tea-light mr-3">
                  <Percent size={16} />
                </div>
                {appliedPromo ? `Промокод: ${appliedPromo.code || appliedPromo}` : t('checkout.addPromo')}
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </div>
          </div>

        </div>
      </div>

      {/* Модальное окно промокода */}
      <AnimatePresence>
        {isPromoModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-[#23312B] rounded-3xl p-6 md:p-8 shadow-2xl w-full max-w-md relative"
            >
              <button 
                onClick={() => setIsPromoModalOpen(false)}
                className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 dark:text-gray-400 transition"
              >
                <X size={18} />
              </button>
              
              <h2 className="text-2xl font-bold text-tea-dark dark:text-tea-light mb-8">{t('checkout.promo')}</h2>
              
              <div className="bg-gray-50 dark:bg-[#1A2421] border border-gray-200 dark:border-[#3A5243] rounded-2xl p-2 flex items-center mb-6">
                <input 
                  type="text" 
                  placeholder={t('checkout.enterPromo')} 
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-grow bg-transparent border-none focus:ring-0 px-4 text-tea-dark dark:text-tea-light placeholder-gray-400"
                />
              </div>
              
              <div className="flex justify-end">
                <button 
                  onClick={handleApplyPromo}
                  className="bg-tea-dark hover:bg-tea-gold text-white font-bold py-3 px-8 rounded-xl transition"
                >
                  Применить
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Модальное окно выбора адреса */}
      <AnimatePresence>
        {isAddressModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-[#23312B] rounded-3xl p-6 md:p-8 shadow-2xl w-full max-w-lg relative"
            >
              <button 
                onClick={() => setIsAddressModalOpen(false)}
                className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 dark:text-gray-400 transition"
              >
                <X size={18} />
              </button>
              
              <h2 className="text-2xl font-bold text-tea-dark dark:text-tea-light mb-6">{t('checkout.yourPickupPoints')}</h2>
              
              <div className="space-y-4 mb-6">
                <label className="flex items-start p-4 border border-tea-gold rounded-xl cursor-pointer bg-tea-light dark:bg-[#1A2421]/10">
                  <input 
                    type="radio" 
                    name="address" 
                    defaultChecked
                    className="mt-1.5 w-5 h-5 text-tea-dark dark:text-tea-light focus:ring-tea-gold"
                  />
                  <div className="ml-4 flex-grow">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Пункт выдачи FateLeaf</p>
                    <p className="font-bold text-tea-dark dark:text-tea-light">г. Ташкент, ул. Амира Темура, 107</p>
                  </div>
                  <div className="text-gray-400 hover:text-red-500 cursor-pointer p-2 transition">
                    <Trash2 size={18} />
                  </div>
                </label>
              </div>

              <button className="flex items-center text-tea-dark dark:text-tea-light hover:text-tea-gold font-bold transition mb-8">
                <span className="text-xl mr-2">+</span> Добавить пункт выдачи
              </button>
              
              <div className="flex justify-end">
                <button 
                  onClick={() => setIsAddressModalOpen(false)}
                  className="bg-tea-dark hover:bg-tea-gold text-white font-bold py-3 px-8 rounded-xl transition"
                >
                  Выбрать
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Модальное окно успешного заказа */}
      <AnimatePresence>
        {isSuccessModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-[#23312B] rounded-3xl p-6 md:p-8 shadow-2xl w-full max-w-lg relative"
            >
              <button 
                onClick={() => { setIsSuccessModalOpen(false); navigate('/'); }}
                className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 dark:text-gray-400 transition"
              >
                <X size={18} />
              </button>
              
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white mb-4 shadow-lg dark:shadow-black/50 shadow-green-500/30">
                  <CheckCircle2 size={32} />
                </div>
                <h2 className="text-2xl font-bold text-tea-dark dark:text-tea-light mb-2">{t('checkout.orderAccepted')}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                  Чтобы получить заказ, назовите его номер или покажите штрихкод — он появится в профиле в день доставки
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-[#1A2421] rounded-2xl p-5 mb-8 border border-gray-100 dark:border-[#3A5243]">
                <h3 className="text-lg font-bold text-tea-dark dark:text-tea-light mb-4">{t('checkout.deliveryFateLeaf')}</h3>
                <div className="mb-4">
                  <p className="text-xs text-gray-400 mb-1">
                    {deliveryMethod === 'pickup' ? 'Пункт выдачи FateLeaf' : 'Курьерская доставка'}
                  </p>
                  <p className="text-sm font-medium text-tea-dark dark:text-tea-light">
                    {deliveryMethod === 'pickup' ? 'г. Ташкент, ул. Амира Темура, 107' : t('checkout.toAddress')}
                  </p>
                </div>
                <div className="mb-3">
                  <p className="text-sm font-bold text-tea-dark dark:text-tea-light">{deliveryDateFormatted}</p>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {orderedItems.map((item) => (
                    <div key={item._id} className="w-14 h-14 rounded-xl border border-gray-200 dark:border-[#3A5243] overflow-hidden flex-shrink-0 bg-white dark:bg-[#23312B]">
                      <img src={item.images?.[0] || '/placeholder.svg'} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => { setIsSuccessModalOpen(false); navigate('/profile'); }}
                  className="flex-1 py-3.5 bg-white dark:bg-[#23312B] border border-gray-200 dark:border-[#3A5243] hover:bg-gray-50 dark:bg-[#1A2421] text-tea-dark dark:text-tea-light font-bold rounded-xl transition"
                >
                  Мои заказы
                </button>
                <button 
                  onClick={() => { setIsSuccessModalOpen(false); navigate('/'); }}
                  className="flex-1 py-3.5 bg-tea-dark hover:bg-tea-gold text-white font-bold rounded-xl transition shadow-md dark:shadow-black/40"
                >
                  Продолжить покупки
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Checkout;
