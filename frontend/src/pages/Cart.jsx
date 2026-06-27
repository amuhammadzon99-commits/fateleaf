import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQty } from '../store/cartSlice';
import { Trash2, ChevronRight, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { getProductImage } from '../utils/imageHelper';

const Cart = () => {
  const { t } = useTranslation();
  const cartItems = useSelector((state) => state.cart.items);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    // Select all items by default initially
    if (selectedItems.length === 0 && cartItems.length > 0) {
      setSelectedItems(cartItems.map(i => i._id));
    }
  }, [cartItems]);

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
    setSelectedItems(prev => prev.filter(itemId => itemId !== id));
  };

  const handleQtyChange = (id, newQty) => {
    if (newQty > 0) {
      dispatch(updateQty({ id, qty: newQty }));
    }
  };

  const handleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map(i => i._id));
    }
  };

  const handleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(prev => prev.filter(itemId => itemId !== id));
    } else {
      setSelectedItems(prev => [...prev, id]);
    }
  };

  const checkoutHandler = () => {
    if (selectedCartItems.length === 0) {
      toast.error(t('cart.selectItemError'));
      return;
    }
    if (!userInfo) {
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-sm w-full bg-white dark:bg-[#23312B] shadow-xl dark:shadow-black/60 rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 border border-tea-green/50 overflow-hidden`}
        >
          <div className="flex-1 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5 text-3xl">
                🍃
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-bold text-tea-dark dark:text-tea-light">
                  {t('cart.loginRequiredTitle')}
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 leading-tight">
                  {t('cart.loginRequiredDesc')}
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-100 dark:border-[#3A5243]">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none p-4 flex items-center justify-center text-sm font-bold text-tea-gold hover:text-tea-dark dark:text-tea-light hover:bg-gray-50 dark:bg-[#1A2421] transition"
            >
              OK
            </button>
          </div>
        </div>
      ), { duration: 4000 });
      
      setTimeout(() => navigate('/login?redirect=/checkout'), 1500);
    } else {
      navigate('/checkout');
    }
  };

  const selectedCartItems = cartItems.filter(item => selectedItems.includes(item._id));
  const totalItems = selectedCartItems.reduce((acc, item) => acc + item.qty, 0);
  
  const totalWithCard = selectedCartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const totalWithoutCard = selectedCartItems.reduce((acc, item) => {
    const basePrice = item.oldPrice || Math.round(item.price * 1.15);
    return acc + basePrice * item.qty;
  }, 0);
  
  const savings = totalWithoutCard - totalWithCard;

  const FREE_SHIPPING_THRESHOLD = 5000;
  const remainingForFreeShipping = FREE_SHIPPING_THRESHOLD - totalWithCard;

  if (cartItems.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-4xl mx-auto bg-white dark:bg-[#23312B] p-8 rounded-2xl shadow-sm mt-8 border border-gray-100 dark:border-[#3A5243]">
        <h1 className="text-3xl font-bold mb-8 text-tea-dark dark:text-tea-light">{t('cart.titleEmpty')}</h1>
        <div className="text-center py-16">
          <p className="text-2xl text-gray-500 dark:text-gray-400 mb-6 font-medium">{t('cart.emptyDesc')}</p>
          <Link to="/catalog" className="inline-block bg-tea-dark hover:bg-tea-gold text-white px-8 py-3 rounded-xl font-bold transition shadow-md dark:shadow-black/40">
            {t('cart.goCatalog')}
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-6xl mx-auto py-6">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-6 text-tea-dark dark:text-tea-light">{t('cart.title')}<span className="text-gray-400 font-normal">{t('cart.itemsCount').replace('{{count}}', cartItems.length)}</span></h1>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column - Items List */}
        <div className="flex-grow space-y-4">
          <div className="bg-white dark:bg-[#23312B] p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-[#3A5243] flex items-center">
            <button 
              onClick={handleSelectAll}
              className="flex items-center text-tea-dark dark:text-tea-light font-medium hover:text-tea-gold transition"
            >
              <div className={`w-6 h-6 rounded flex items-center justify-center mr-3 transition-colors ${selectedItems.length === cartItems.length ? 'bg-tea-gold border-tea-gold' : 'border-2 border-gray-300'}`}>
                {selectedItems.length === cartItems.length && <Check size={16} className="text-white" />}
              </div>
              {selectedItems.length === cartItems.length ? t('cart.deselectAll') : t('cart.selectAll')}
            </button>
          </div>

          <div className="bg-white dark:bg-[#23312B] rounded-2xl shadow-sm border border-gray-100 dark:border-[#3A5243] p-6 overflow-hidden">
            <div className="mb-4">
              <span className="text-xs text-gray-400 font-medium">{t('cart.deliveryFateLeaf')}</span>
              <h3 className="text-lg font-bold text-tea-dark dark:text-tea-light">{t('cart.deliverTomorrow')}</h3>
            </div>
            
            <div className="space-y-6">
              <AnimatePresence>
              {cartItems.map((item, index) => {
                const isSelected = selectedItems.includes(item._id);
                const itemBasePrice = item.oldPrice || Math.round(item.price * 1.15);

                return (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0, scale: 0.95 }} transition={{ duration: 0.3 }} key={item._id} className={`flex gap-4 ${index !== cartItems.length - 1 ? 'border-b border-gray-100 dark:border-[#3A5243] pb-6' : ''}`}>
                    {/* Checkbox */}
                    <div className="pt-8">
                      <button 
                        onClick={() => handleSelectItem(item._id)}
                        className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${isSelected ? 'bg-tea-gold border-tea-gold' : 'border-2 border-gray-300'}`}
                      >
                        {isSelected && <Check size={16} className="text-white" />}
                      </button>
                    </div>

                    {/* Image */}
                    <Link to={`/product/${item._id}`} className="flex-shrink-0">
                      <img src={getProductImage(item)} alt={item.name} className="w-28 h-28 rounded-xl object-cover border border-gray-50" />
                    </Link>

                    {/* Content */}
                    <div className="flex-grow flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          {item.badge === 'hit' && <span className="bg-tea-gold text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded mb-2 inline-block">{t('cart.badgeHit')}</span>}
                          {item.badge === 'new' && <span className="bg-tea-green text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded mb-2 inline-block">{t('cart.badgeNew')}</span>}
                          {item.badge === 'sale' && <span className="bg-red-500 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded mb-2 inline-block">{t('cart.badgeSale')}</span>}
                          
                          <Link to={`/product/${item._id}`} className="hover:text-tea-gold transition">
                            <h3 className="text-lg text-tea-dark dark:text-tea-light font-medium leading-tight max-w-lg">{item.name}</h3>
                          </Link>
                          
                          <div className="mt-2 text-sm text-gray-400">
                            <p>{t('cart.category')} <span className="text-gray-600 dark:text-gray-400">{item.category}</span></p>
                            <p>{t('cart.weight')} <span className="text-gray-600 dark:text-gray-400">{item.weight}</span></p>
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => handleRemove(item._id)} 
                          className="text-gray-400 hover:text-red-500 transition flex items-center text-sm font-medium"
                        >
                          <Trash2 size={16} className="mr-1" />
                          {t('cart.delete')}
                        </button>
                      </div>

                      <div className="flex justify-between items-end mt-4">
                        {/* Quantity Selector */}
                        <div className="flex items-center border border-gray-200 dark:border-[#3A5243] rounded-lg">
                          <button 
                            onClick={() => handleQtyChange(item._id, item.qty - 1)}
                            className="px-3 py-1.5 text-gray-500 dark:text-gray-400 hover:text-tea-dark dark:text-tea-light hover:bg-gray-50 dark:bg-[#1A2421] transition rounded-l-lg"
                          >
                            &minus;
                          </button>
                          <span className="px-4 py-1.5 font-medium text-tea-dark dark:text-tea-light border-x border-gray-200 dark:border-[#3A5243] min-w-[2.5rem] text-center">
                            {item.qty}
                          </span>
                          <button 
                            onClick={() => handleQtyChange(item._id, item.qty + 1)}
                            className="px-3 py-1.5 text-gray-500 dark:text-gray-400 hover:text-tea-dark dark:text-tea-light hover:bg-gray-50 dark:bg-[#1A2421] transition rounded-r-lg"
                          >
                            +
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <div className="text-2xl font-bold text-tea-dark dark:text-tea-light leading-none mb-1">
                            {item.price * item.qty} ₽ <span className="text-tea-gold ml-1">🍃</span>
                          </div>
                          <div className="text-xs text-gray-400 line-through">
                            {t('cart.withoutCard')} {itemBasePrice * item.qty} ₽
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              </AnimatePresence>
            </div>
            
            {/* Upsell Banner */}
            <div className="mt-6 bg-gray-50 dark:bg-[#1A2421] rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition border border-gray-100 dark:border-[#3A5243]">
              <div className="flex items-center space-x-3">
                <div className="bg-white dark:bg-[#23312B] p-2 rounded-lg shadow-sm border border-gray-100 dark:border-[#3A5243]">
                  <div className="w-8 h-8 rounded bg-tea-light dark:bg-[#1A2421] flex items-center justify-center text-tea-dark dark:text-tea-light font-bold text-xs">☕</div>
                </div>
                <div>
                  <h4 className="font-bold text-tea-dark dark:text-tea-light text-sm">{t('cart.upsellTitle')}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{t('cart.upsellDesc')}</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </div>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="w-full lg:w-[380px] flex-shrink-0 space-y-4">
          {/* Free Shipping Banner */}
          <div className="bg-white dark:bg-[#23312B] p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-[#3A5243] flex items-center justify-between hover:border-tea-gold/30 transition cursor-pointer">
            <span className="text-sm font-medium text-tea-dark dark:text-tea-light">
              {remainingForFreeShipping > 0 
                ? t('cart.freeShippingHint').replace('{{amount}}', remainingForFreeShipping + ' ₽') 
                : t('cart.freeShippingDone')}
            </span>
            <ChevronRight size={20} className="text-gray-400 flex-shrink-0 ml-2" />
          </div>

          {/* Receipt */}
          <div className="bg-white dark:bg-[#23312B] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-[#3A5243]">
            <h2 className="text-xl font-bold text-tea-dark dark:text-tea-light mb-6">{t('cart.yourOrder')}</h2>
            
            <div className="flex justify-between items-center mb-4 text-sm font-medium text-gray-600 dark:text-gray-400">
              <span>{t('cart.itemsLabel').replace('{{count}}', totalItems)}</span>
              <span>{totalWithoutCard} ₽</span>
            </div>

            <div className="border-t border-gray-100 dark:border-[#3A5243] my-4 pt-4">
              <h3 className="font-bold text-tea-dark dark:text-tea-light mb-3 text-lg">{t('cart.totalLabel')}</h3>
              
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-medium text-tea-dark dark:text-tea-light mt-1">{t('cart.withCard')}</span>
                <div className="text-right">
                  <div className="text-2xl font-bold text-tea-gold leading-none">{totalWithCard} ₽</div>
                  {savings > 0 && (
                    <div className="text-xs text-tea-green font-bold mt-1">
                      {t('cart.youSave')} {savings} ₽
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-3 text-sm text-gray-500 dark:text-gray-400">
                <span>{t('cart.withoutCardTotal')}</span>
                <span>{totalWithoutCard} ₽</span>
              </div>
            </div>

            <button 
              onClick={checkoutHandler}
              className={`w-full mt-6 py-4 rounded-xl font-bold text-lg transition shadow-md dark:shadow-black/40 flex items-center justify-center ${
                selectedCartItems.length === 0 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-tea-dark hover:bg-tea-gold text-white hover:shadow-lg dark:shadow-black/50 transform hover:-translate-y-0.5'
              }`}
            >
              {t('cart.checkoutBtn')}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Cart;
