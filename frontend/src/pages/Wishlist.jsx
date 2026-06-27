import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Heart, ShoppingCart, X, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { removeWishlistItem } from '../store/wishlistSlice';
import { addToCart } from '../store/cartSlice';

const Wishlist = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);

  const handleRemove = (id) => {
    dispatch(removeWishlistItem(id));
    toast.success(t('wishlist.removed_toast'));
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart({ ...product, qty: 1 }));
    toast.success('Товар добавлен в корзину');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/" className="inline-flex items-center text-tea-dark dark:text-tea-light hover:text-tea-gold transition mb-6">
        <ArrowLeft size={20} className="mr-2" />
        {t('wishlist.to_catalog')}
      </Link>

      <h1 className="text-3xl md:text-4xl font-bold text-tea-dark dark:text-tea-light mb-8 flex items-center">
        <Heart className="mr-3 text-tea-gold" fill="currentColor" />
        {t('wishlist.title')}
      </h1>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#23312B] rounded-3xl shadow-sm border border-tea-green/20 dark:border-[#3A5243]">
          <Heart className="mx-auto h-20 w-20 text-gray-200 mb-4" />
          <h2 className="text-2xl font-bold text-gray-500 dark:text-gray-400 mb-6">{t('wishlist.empty')}</h2>
          <Link to="/catalog" className="inline-block bg-tea-dark hover:bg-tea-green text-white font-bold py-3 px-8 rounded-full transition shadow-lg dark:shadow-black/50">
            {t('wishlist.to_catalog')}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-[#23312B] rounded-2xl shadow-sm hover:shadow-xl dark:shadow-black/60 p-4 flex flex-col items-center group transition duration-300 border border-gray-50 relative"
            >
              <button
                onClick={() => handleRemove(item._id)}
                className="absolute top-2 right-2 bg-white dark:bg-[#23312B]/80 hover:bg-red-100 text-red-500 p-2 rounded-full transition shadow-sm z-10"
              >
                <X size={16} />
              </button>

              <Link to={`/product/${item._id}`} className="w-full">
                <div className="w-full h-48 rounded-xl overflow-hidden mb-4 bg-gray-50 dark:bg-[#1A2421] flex items-center justify-center">
                  <img
                    src={item.images?.[0] || '/placeholder.jpg'}
                    alt={item.name}
                    className="h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                </div>
                <div className="w-full text-left px-2 mb-4">
                  <h3 className="text-lg font-bold text-tea-dark dark:text-tea-light line-clamp-2 min-h-[3.5rem]">{item.name}</h3>
                  <span className="text-xl font-bold text-tea-gold mt-2 block">{item.price} ₽</span>
                </div>
              </Link>
              
              <button
                onClick={() => handleAddToCart(item)}
                className="w-full bg-tea-green/10 hover:bg-tea-green text-tea-dark dark:text-tea-light hover:text-white border border-tea-green transition font-bold py-2 px-4 rounded-xl flex items-center justify-center"
              >
                <ShoppingCart size={18} className="mr-2" />
                {t('wishlist.add_to_cart')}
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
