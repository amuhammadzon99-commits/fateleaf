import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { ShoppingCart, Search, Heart } from 'lucide-react';
import { toggleWishlistItem } from '../store/wishlistSlice';
import { motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { getProductImage } from '../utils/imageHelper';
import { useTranslation } from 'react-i18next';

const Catalog = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearch = searchParams.get('search');
  const urlCategory = searchParams.get('category');
  
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState(urlSearch || '');
  const [category, setCategory] = useState(urlCategory || '');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const dispatch = useDispatch();
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  const handleWishlistToggle = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleWishlistItem(product));
    const isWishlisted = wishlistItems.some((i) => i._id === product._id);
    if (isWishlisted) {
      toast(t('wishlist.removed_toast'), { icon: '🗑️' });
    } else {
      toast.success(t('wishlist.added_toast'), { icon: '🍃', style: { border: '1px solid #71b280', color: '#1a2e21' } });
    }
  };

  useEffect(() => {
    if (urlSearch !== null) setSearch(urlSearch);
    if (urlCategory !== null) setCategory(urlCategory);
  }, [urlSearch, urlCategory]);

  const handleAddToCart = (product) => {
    dispatch(addToCart({ ...product, qty: 1 }));
    toast.success(t('catalog.addedToCart'));
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/api/products?search=${search}&category=${category}&active=true&pageNumber=${page}`);
        setProducts(data.products);
        setPages(data.pages);
      } catch (error) {
        toast.error(t('catalog.loadError'));
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, category, page]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto"
    >
      <Toaster position="top-right" />
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4"
      >
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-tea-dark dark:text-tea-light">
            {category ? t('catalog.titleCategory', { category }) : t('catalog.title')}
          </h1>
          {category && (
            <button 
              onClick={() => {
                setCategory('');
                setSearchParams(search ? { search } : {});
              }}
              className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-full transition"
            >
              {t('catalog.reset')}
            </button>
          )}
        </div>
        
        {/* Поиск товаров */}
        <div className="relative w-full md:w-96">
            <input 
              type="text" 
              placeholder={t('catalog.searchPlaceholder')} 
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSearchParams(e.target.value ? { search: e.target.value } : {});
              }}
              className="w-full pl-10 pr-4 py-3 border-2 border-tea-green/50 rounded-full focus:border-tea-gold focus:ring-2 focus:ring-tea-gold/20 outline-none transition shadow-sm"
            />
          <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
        </div>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tea-gold"></div>
        </div>
      ) : products.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20 bg-white dark:bg-[#23312B] rounded-2xl shadow-sm border border-gray-100 dark:border-[#3A5243]"
        >
          <p className="text-xl text-gray-500 dark:text-gray-400">{t('catalog.noProducts')}</p>
          <button 
            onClick={() => setSearch('')}
            className="mt-4 text-tea-gold hover:underline font-bold"
          >
            {t('catalog.resetSearch')}
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, idx) => {
            let badgeText = '';
            let badgeColor = '';
            if (product.badge === 'new') { badgeText = t('catalog.badgeNew'); badgeColor = 'bg-tea-green text-white'; }
            if (product.badge === 'sale' || product.oldPrice) { badgeText = t('catalog.badgeSale'); badgeColor = 'bg-red-500 text-white'; }
            if (product.badge === 'hit') { badgeText = t('catalog.badgeHit'); badgeColor = 'bg-tea-gold text-white'; }

            return (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={product._id} 
              className="bg-white dark:bg-[#23312B] rounded-2xl shadow-sm hover:shadow-xl dark:shadow-black/60 p-4 flex flex-col items-center group transition duration-300 border border-gray-50 relative"
            >
              <Link to={`/product/${product._id}`} className="w-full">
                <div className="w-full h-56 rounded-xl overflow-hidden mb-4 bg-gray-50 dark:bg-[#1A2421] relative">
                  <img 
                    src={getProductImage(product)} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700" 
                  />
                  {badgeText && (
                    <span className={`absolute top-3 left-3 ${badgeColor} text-xs font-bold px-2.5 py-1 rounded-full shadow-md dark:shadow-black/40 z-10`}>
                      {badgeText}
                    </span>
                  )}
                </div>
              </Link>
              
              <button 
                onClick={(e) => handleWishlistToggle(e, product)} 
                className="absolute top-7 right-7 bg-white dark:bg-[#23312B]/80 backdrop-blur-sm p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-white dark:bg-[#23312B] shadow-sm transition z-10"
              >
                <Heart 
                  size={20} 
                  fill={wishlistItems.some(i => i._id === product._id) ? "currentColor" : "none"} 
                  className={wishlistItems.some(i => i._id === product._id) ? "text-red-500" : ""} 
                />
              </button>
              
              <div className="w-full flex-grow flex flex-col text-left px-1">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 uppercase tracking-widest font-semibold">FateLeaf | {product.category || t('catalog.tea')}</p>
                  <span className="text-[11px] text-gray-400 font-medium border border-gray-200 dark:border-[#3A5243] px-1.5 py-0.5 rounded">{product.weight || '50g'}</span>
                </div>
                
                <Link to={`/product/${product._id}`} className="hover:text-tea-gold transition mt-1 mb-3">
                  <h3 className="text-lg font-bold text-tea-dark dark:text-tea-light line-clamp-2 leading-tight">{product.name}</h3>
                </Link>
                
                <div className="mt-auto flex justify-between items-end pt-3 border-t border-gray-100 dark:border-[#3A5243]">
                  <div className="flex flex-col">
                    {product.oldPrice && (
                      <span className="text-xs text-gray-400 line-through mb-0.5">{product.oldPrice} ₽</span>
                    )}
                    <span className="text-2xl font-bold text-tea-dark dark:text-tea-light">{product.price} ₽</span>
                  </div>
                  <button 
                    onClick={() => handleAddToCart(product)}
                    className="bg-tea-dark hover:bg-tea-gold text-white px-4 py-2.5 rounded-xl transition shadow-md dark:shadow-black/40 hover:shadow-lg dark:shadow-black/50 transform hover:-translate-y-1 flex items-center font-bold text-sm"
                  >
                    <ShoppingCart size={16} className="mr-2" />
                    {t('catalog.addToCart')}
                  </button>
                </div>
              </div>
            </motion.div>
          )})}
        </div>
      )}

      {/* Pagination */}
      {!loading && pages > 1 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center mt-12 mb-4 space-x-2"
        >
          {[...Array(pages).keys()].map((x) => (
            <button
              key={x + 1}
              onClick={() => {
                setPage(x + 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`w-10 h-10 rounded-xl font-bold flex items-center justify-center transition-all ${
                x + 1 === page 
                  ? 'bg-tea-gold text-white shadow-md dark:shadow-black/40 transform scale-110' 
                  : 'bg-white dark:bg-[#23312B] text-gray-600 dark:text-gray-400 hover:bg-tea-light dark:bg-[#1A2421] border border-gray-200 dark:border-[#3A5243]'
              }`}
            >
              {x + 1}
            </button>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Catalog;
