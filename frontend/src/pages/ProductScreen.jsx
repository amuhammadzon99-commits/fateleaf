import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart, updateQty } from '../store/cartSlice';
import { toggleWishlistItem } from '../store/wishlistSlice';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Star, ShoppingBag, Heart, ChevronRight, Truck, CreditCard, RefreshCw, Check, Timer } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { getProductImage } from '../utils/imageHelper';
import BrewingTimer from '../components/BrewingTimer';
import RelatedProducts from '../components/RelatedProducts';
import ProductReviews from '../components/ProductReviews';

const ProductScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items: cartItems } = useSelector((state) => state.cart);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const cartItem = cartItems.find((i) => i._id === id);
  const isWishlisted = wishlistItems.some((i) => i._id === id);
  const { t } = useTranslation();

  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  const [installmentTab, setInstallmentTab] = useState('dolyami');
  const [isTimerOpen, setIsTimerOpen] = useState(false);

  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(`/api/products/${id}`);
      setProduct(data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || t('product.loadError'));
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, qty: 1 }));
    toast.success(t('product.addedToCart'));
  };

  const handleWishlistToggle = () => {
    dispatch(toggleWishlistItem(product));
    if (isWishlisted) {
      toast(t('wishlist.removed_toast'), { icon: '💔' });
    } else {
      toast.success(t('wishlist.added_toast'), { icon: '❤️', style: { border: '1px solid #71b280', color: '#1a2e21' } });
    }
  };

  if (loading) return <div className="text-center py-20 text-tea-dark dark:text-tea-light font-bold">{t('product.loading')}</div>;
  if (error) return <div className="text-center py-20 text-red-500 font-bold">{error}</div>;

  const itemBasePrice = product.oldPrice || Math.round(product.price * 1.15);
  const savings = itemBasePrice - product.price;

  // Mock data for reviews
  const rating = 4.8;
  const numReviews = 148;
  const orders = "700+";

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
      
      {/* Breadcrumbs */}
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex items-center space-x-2">
        <Link to="/" className="hover:text-tea-dark dark:text-tea-light transition">{t('product.home')}</Link>
        <ChevronRight size={14} />
        <Link to="/catalog" className="hover:text-tea-dark dark:text-tea-light transition">{t('product.catalog')}</Link>
        <ChevronRight size={14} />
        <span className="text-gray-900 dark:text-gray-100 truncate max-w-[200px]">{product.name}</span>
      </div>

      {/* Header Info */}
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">{product.name}</h1>
      
      <div className="flex items-center space-x-4 mb-6 text-sm">
        <div className="flex items-center text-yellow-400">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={16} fill={i < Math.floor(rating) ? "currentColor" : "none"} />
          ))}
          <span className="text-gray-600 dark:text-gray-400 ml-2 font-medium">{rating} ({numReviews} {t('product.reviews')})</span>
        </div>
        <span className="text-gray-300">•</span>
        <span className="text-gray-500 dark:text-gray-400">{orders} {t('product.orders')}</span>
      </div>

      {/* Main Content 2 Columns */}
      <div className="flex flex-col lg:flex-row gap-8 mb-12">
        
        {/* Left Col: Images */}
        <div className="flex-grow flex gap-4">
          {/* Thumbnails (mocked to just show the main image for now) */}
          <div className="hidden sm:flex flex-col space-y-3 w-16">
            <div className="border-2 border-tea-gold rounded-lg overflow-hidden cursor-pointer">
              <img src={getProductImage(product)} alt="thumbnail" className="w-full h-16 object-cover" />
            </div>
          </div>
          
          {/* Main Image */}
          <div className="flex-grow relative bg-gray-50 dark:bg-[#1A2421] rounded-2xl overflow-hidden aspect-square sm:aspect-auto sm:h-[500px] flex items-center justify-center">
            {product.badge === 'hit' && <span className="absolute top-4 left-4 z-10 bg-tea-gold text-white text-xs uppercase font-bold px-3 py-1 rounded-md shadow-sm">{t('product.badgeHit')}</span>}
            {product.badge === 'new' && <span className="absolute top-4 left-4 z-10 bg-tea-green text-white text-xs uppercase font-bold px-3 py-1 rounded-md shadow-sm">{t('product.badgeNew')}</span>}
            {product.badge === 'sale' && <span className="absolute top-4 left-4 z-10 bg-red-500 text-white text-xs uppercase font-bold px-3 py-1 rounded-md shadow-sm">{t('product.badgeSale')}</span>}
            
            <img src={getProductImage(product)} alt={product.name} className="w-full h-full object-contain" />
          </div>
        </div>

        {/* Right Col: Buy Box */}
        <div className="w-full lg:w-[400px] flex-shrink-0">
          <div className="bg-white dark:bg-[#23312B] rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-100 dark:border-[#3A5243] overflow-hidden">
            {/* Promo Banner */}
            <div className="bg-tea-gold px-6 py-3 flex justify-between items-center text-white">
              <span className="font-bold text-sm">Чайная коллекция FateLeaf</span>
              <span className="bg-white dark:bg-[#23312B]/20 px-2 py-0.5 rounded text-xs font-bold">Осталось 3 дня</span>
            </div>

            <div className="p-6">
              {/* Price */}
              <div className="mb-6">
                <div className="text-4xl font-bold text-tea-dark dark:text-tea-light mb-1 leading-none">
                  {product.price} ₽ <span className="text-tea-gold text-2xl">🍃</span>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <span>{t('cart.withoutCard')}</span>
                  <span className="line-through">{itemBasePrice} ₽</span>
                </div>
              </div>

              {/* Buttons */}
              {!cartItem ? (
                <>
                  <div className="flex gap-3 mb-4">
                    <button 
                      onClick={handleAddToCart}
                      className="flex-grow bg-tea-dark hover:bg-tea-gold text-white font-bold py-4 rounded-xl transition shadow-md dark:shadow-black/40 hover:shadow-lg dark:shadow-black/50 hover:-translate-y-0.5 flex flex-col items-center justify-center leading-tight"
                    >
                      <span className="text-lg">{t('product.addToCart')}</span>
                      <span className="text-xs font-normal opacity-80 mt-1">{t('cart.deliverTomorrow')}</span>
                    </button>
                    <button 
                      onClick={handleWishlistToggle}
                      className="w-14 h-14 rounded-xl bg-gray-100 text-gray-600 dark:text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all active:scale-90 flex items-center justify-center flex-shrink-0"
                    >
                      <Heart size={24} className={isWishlisted ? "text-red-500" : ""} fill={isWishlisted ? "currentColor" : "none"} />
                    </button>
                  </div>
                  <button className="w-full bg-gray-100 hover:bg-gray-200 text-tea-dark dark:text-tea-light font-bold py-3 rounded-xl transition mb-6 text-sm">
                    {t('product.buyNow')}
                  </button>
                </>
              ) : (
                <>
                  <div className="flex gap-3 mb-4">
                    <button className="flex-grow bg-gray-100 hover:bg-gray-200 text-tea-dark dark:text-tea-light font-bold py-3.5 rounded-xl transition text-sm">
                      {t('product.buyNow')}
                    </button>
                    <button 
                      onClick={handleWishlistToggle}
                      className="w-[52px] h-[52px] rounded-xl bg-gray-100 text-gray-600 dark:text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all active:scale-90 flex items-center justify-center flex-shrink-0"
                    >
                      <Heart size={22} className={isWishlisted ? "text-red-500" : ""} fill={isWishlisted ? "currentColor" : "none"} />
                    </button>
                  </div>
                  <div className="flex gap-3 mb-6 h-[52px]">
                    <div className="flex items-center justify-between border border-gray-300 rounded-xl px-4 py-2 w-32 bg-white dark:bg-[#23312B] flex-shrink-0">
                      <button 
                        onClick={() => cartItem.qty > 1 ? dispatch(updateQty({ id: product._id, qty: cartItem.qty - 1 })) : dispatch(removeFromCart(product._id))}
                        className="text-gray-500 dark:text-gray-400 hover:text-black text-xl w-6 text-center"
                      >
                        −
                      </button>
                      <span className="font-bold text-gray-800 dark:text-gray-200">{cartItem.qty}</span>
                      <button 
                        onClick={() => dispatch(updateQty({ id: product._id, qty: cartItem.qty + 1 }))}
                        className="text-gray-500 dark:text-gray-400 hover:text-black text-xl w-6 text-center"
                      >
                        +
                      </button>
                    </div>

                    <Link to="/cart" className="flex-grow bg-purple-100 hover:bg-purple-200 text-purple-700 font-bold rounded-xl transition flex items-center justify-center space-x-2">
                      <ShoppingBag size={18} />
                      <span>Перейти</span>
                    </Link>
                  </div>
                </>
              )}

              {/* Installment mockup */}
              <div className="bg-gray-50 dark:bg-[#1A2421] rounded-xl p-4 mb-6 border border-gray-100 dark:border-[#3A5243]">
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium">
                  <button 
                    onClick={() => setInstallmentTab('dolyami')}
                    className={`flex-1 py-1 px-2 text-center rounded transition ${installmentTab === 'dolyami' ? 'bg-white dark:bg-[#23312B] shadow-sm text-tea-dark dark:text-tea-light' : 'hover:text-gray-700 dark:text-gray-300'}`}
                  >
                    Долями
                  </button>
                  <button 
                    onClick={() => setInstallmentTab('split')}
                    className={`flex-1 py-1 px-2 text-center rounded transition ${installmentTab === 'split' ? 'bg-white dark:bg-[#23312B] shadow-sm text-tea-dark dark:text-tea-light' : 'hover:text-gray-700 dark:text-gray-300'}`}
                  >
                    Сплит
                  </button>
                  <button 
                    onClick={() => setInstallmentTab('credit')}
                    className={`flex-1 py-1 px-2 text-center rounded transition ${installmentTab === 'credit' ? 'bg-white dark:bg-[#23312B] shadow-sm text-tea-dark dark:text-tea-light' : 'hover:text-gray-700 dark:text-gray-300'}`}
                  >
                    Кредит
                  </button>
                </div>
                <div className="flex justify-between items-center bg-white dark:bg-[#23312B] p-3 rounded-lg border border-gray-100 dark:border-[#3A5243] cursor-pointer hover:border-tea-gold transition">
                  <span className="font-bold text-tea-dark dark:text-tea-light bg-tea-light dark:bg-[#1A2421] px-2 py-1 rounded text-sm">
                    {installmentTab === 'dolyami' && `${Math.round(product.price / 4)} ₽ × 4 платежа`}
                    {installmentTab === 'split' && `${Math.round(product.price / 6)} ₽ × 6 мес`}
                    {installmentTab === 'credit' && `${Math.round((product.price * 1.15) / 12)} ₽ × 12 мес`}
                  </span>
                  <ChevronRight size={16} className="text-gray-400" />
                </div>
              </div>

              {/* Stock info */}
              <div className="space-y-3">
                <div className="flex items-center text-sm text-green-600 font-medium">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <Check size={14} />
                  </div>
                  В наличии {product.stock} шт
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 font-medium">
                  <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center mr-3 text-purple-600">
                    <ShoppingBag size={14} />
                  </div>
                  7 человек купили на этой неделе
                </div>
              </div>
              
              {/* Timer Button */}
              <button 
                onClick={() => setIsTimerOpen(true)}
                className="mt-6 w-full bg-tea-light/10 dark:bg-tea-light/5 hover:bg-tea-light/20 text-tea-dark dark:text-tea-light font-bold py-3 px-4 rounded-xl border border-tea-green/30 dark:border-tea-green/20 transition flex items-center justify-center"
              >
                <Timer className="mr-2 text-tea-gold" size={20} />
                Интерактивный таймер заваривания
              </button>
            </div>
          </div>
        </div>
      </div>

      <BrewingTimer 
        isOpen={isTimerOpen} 
        onClose={() => setIsTimerOpen(false)} 
        category={product.category} 
      />

      {/* Bottom Section: Tabs and Delivery info */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Col: Description & Reviews */}
        <div className="flex-grow">
          {/* Tabs */}
          <div className="flex space-x-8 border-b border-gray-200 dark:border-[#3A5243] mb-6">
            <button 
              onClick={() => setActiveTab('description')}
              className={`pb-3 font-bold text-lg transition ${activeTab === 'description' ? 'border-b-2 border-tea-dark text-tea-dark dark:text-tea-light' : 'text-gray-400 hover:text-gray-600 dark:text-gray-400'}`}
            >
              Описание
            </button>
            <button 
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 font-bold text-lg transition flex items-center ${activeTab === 'reviews' ? 'border-b-2 border-tea-dark text-tea-dark dark:text-tea-light' : 'text-gray-400 hover:text-gray-600 dark:text-gray-400'}`}
            >
              Отзывы <span className="ml-2 text-sm font-normal text-gray-400">{numReviews}</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="bg-white dark:bg-[#23312B] rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-[#3A5243]">
            {activeTab === 'description' && (
              <div className="prose max-w-none text-gray-700 dark:text-gray-300">
                <h3 className="text-xl font-bold text-tea-dark dark:text-tea-light mb-4">О товаре</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="flex border-b border-dotted border-gray-300 pb-2">
                    <span className="text-gray-500 dark:text-gray-400 w-1/2">Категория</span>
                    <span className="font-medium text-tea-dark dark:text-tea-light w-1/2">{product.category}</span>
                  </div>
                  <div className="flex border-b border-dotted border-gray-300 pb-2">
                    <span className="text-gray-500 dark:text-gray-400 w-1/2">Вес/Объем</span>
                    <span className="font-medium text-tea-dark dark:text-tea-light w-1/2">{product.weight}</span>
                  </div>
                </div>
                <div className="whitespace-pre-line text-gray-600 dark:text-gray-400 leading-relaxed">
                  {product.description}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <ProductReviews product={product} onReviewSubmitted={fetchProduct} />
            )}
          </div>
        </div>

        {/* Right Col: Info Cards */}
        <div className="w-full lg:w-[320px] flex-shrink-0 space-y-4">
          <div className="bg-white dark:bg-[#23312B] rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-[#3A5243] flex items-start space-x-4">
            <div className="text-tea-gold mt-1"><Truck size={24} /></div>
            <div>
              <h4 className="font-bold text-tea-dark dark:text-tea-light">{t('cart.deliverTomorrow')}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">В пункт выдачи или курьером</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-[#23312B] rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-[#3A5243] flex items-start space-x-4">
            <div className="text-tea-gold mt-1"><CreditCard size={24} /></div>
            <div>
              <h4 className="font-bold text-tea-dark dark:text-tea-light mb-2">Безопасная оплата</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 leading-tight">Оплачивайте картой, наличными или в рассрочку</p>
              <div className="flex gap-2">
                <div className="w-8 h-5 bg-gray-200 rounded text-[8px] flex items-center justify-center font-bold text-white bg-gradient-to-r from-blue-500 to-purple-600">Uzcard</div>
                <div className="w-8 h-5 bg-gray-200 rounded text-[8px] flex items-center justify-center font-bold text-white bg-green-500">Humo</div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#23312B] rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-[#3A5243] flex items-start space-x-4">
            <div className="text-tea-gold mt-1"><RefreshCw size={24} /></div>
            <div>
              <h4 className="font-bold text-tea-dark dark:text-tea-light">Простой возврат</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-tight">Примем товары в течение 10 дней и сразу вернём деньги.</p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#23312B] rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-[#3A5243]">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-tea-light dark:bg-[#1A2421] flex items-center justify-center text-2xl">🍃</div>
              <div>
                <h4 className="font-bold text-tea-dark dark:text-tea-light">FateLeaf Market</h4>
                <div className="flex items-center text-sm mt-0.5">
                  <Star size={14} fill="#facc15" className="text-yellow-400 mr-1" />
                  <span className="font-bold mr-1">4.9</span>
                  <span className="text-gray-400">10k+ оценок</span>
                </div>
              </div>
            </div>
            <button className="w-full py-2.5 bg-gray-50 dark:bg-[#1A2421] hover:bg-gray-100 text-tea-dark dark:text-tea-light font-bold rounded-xl transition text-sm">
              Перейти в магазин
            </button>
          </div>
        </div>
      </div>
      
      {/* С этим чаем покупают */}
      <RelatedProducts currentProductId={product._id} category={product.category} />
    </div>
  );
};

export default ProductScreen;
