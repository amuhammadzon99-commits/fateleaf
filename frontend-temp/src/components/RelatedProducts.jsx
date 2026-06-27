import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { toggleWishlistItem } from '../store/wishlistSlice';
import { getProductImage } from '../utils/imageHelper';
import toast from 'react-hot-toast';

const RelatedProducts = ({ currentProductId, category }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const dispatch = useDispatch();
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  useEffect(() => {
    const fetchRelated = async () => {
      if (!category) return;
      try {
        setLoading(true);
        // Fetch products in the same category
        const { data } = await axios.get(`/api/products?category=${category}`);
        // Filter out the current product and take up to 4
        const filtered = data.products
          .filter(p => p._id !== currentProductId)
          .slice(0, 4);
        
        setProducts(filtered);
      } catch (error) {
        console.error('Failed to load related products', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRelated();
  }, [category, currentProductId]);

  if (loading) return <div className="py-10 text-center animate-pulse text-gray-400">Загрузка рекомендаций...</div>;
  if (products.length === 0) return null;

  return (
    <div className="mt-16 mb-10">
      <div className="flex items-center justify-between mb-8 border-b border-gray-100 dark:border-gray-800 pb-4">
        <h2 className="text-2xl font-bold text-tea-dark dark:text-tea-light">С этим чаем покупают</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map(product => {
          const isWishlisted = wishlistItems.some(i => i._id === product._id);
          
          return (
            <div key={product._id} className="bg-white dark:bg-[#23312B] rounded-2xl shadow-sm hover:shadow-xl dark:shadow-black/60 p-4 flex flex-col items-center group transition duration-300 border border-gray-50 relative">
              <Link to={`/product/${product._id}`} className="w-full">
                <div className="w-full h-48 rounded-xl overflow-hidden mb-4 bg-gray-50 dark:bg-[#1A2421] relative">
                  <img 
                    src={getProductImage(product)} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700" 
                  />
                  {product.badge && product.badge !== 'none' && (
                    <span className="absolute top-2 left-2 bg-tea-gold text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full shadow-sm">
                      {product.badge}
                    </span>
                  )}
                </div>
              </Link>
              
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(toggleWishlistItem(product));
                  toast.success(isWishlisted ? "Удалено из избранного" : "Добавлено в избранное", { icon: isWishlisted ? '💔' : '❤️' });
                }} 
                className="absolute top-6 right-6 bg-white/80 dark:bg-[#23312B]/80 backdrop-blur-sm p-1.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-white transition z-10 shadow-sm"
              >
                <Heart size={18} className={isWishlisted ? "text-red-500" : ""} fill={isWishlisted ? "currentColor" : "none"} />
              </button>
              
              <div className="w-full text-left px-1 flex flex-col h-full justify-between">
                <div>
                  <Link to={`/product/${product._id}`} className="hover:text-tea-gold transition mb-2 block">
                    <h3 className="text-base font-bold text-tea-dark dark:text-tea-light line-clamp-2 leading-snug">{product.name}</h3>
                  </Link>
                </div>
                
                <div className="mt-3 flex justify-between items-center">
                  <span className="text-lg font-bold text-tea-gold">{product.price} ₽</span>
                  <button 
                    onClick={() => {
                      dispatch(addToCart({ ...product, qty: 1 }));
                      toast.success("Добавлено в корзину");
                    }}
                    className="bg-gray-100 hover:bg-tea-gold text-tea-dark hover:text-white dark:bg-[#1A2421] dark:text-gray-300 p-2 rounded-lg transition"
                  >
                    <ShoppingCart size={18} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RelatedProducts;
