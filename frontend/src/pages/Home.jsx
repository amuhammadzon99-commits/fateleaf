import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Award, Truck, ShieldCheck, ArrowRight, PlayCircle, BookOpen, Search, Coffee } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import TeaQuizModal from '../components/TeaQuizModal';
import { getProductImage } from '../utils/imageHelper';

const Home = () => {
  const { t } = useTranslation();
  const [bestsellers, setBestsellers] = useState([]);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  
  // Newsletter state
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@') || !email.includes('.')) {
      setStatus('error');
      setErrorMsg('Пожалуйста, проверьте формат email');
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    try {
      await axios.post('/api/subscribe', { email });
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.response?.data?.message || 'Ошибка подписки');
    }
  };

  useEffect(() => {
    const fetchBestsellers = async () => {
      try {
        const { data } = await axios.get('/api/products?active=true');
        // Показываем первые 4 товара как "Хиты"
        setBestsellers(data.products.slice(0, 4));
      } catch (error) {
        console.error('Ошибка загрузки хитов', error);
      }
    };
    fetchBestsellers();
  }, []);

  return (
    <div className="space-y-24 pb-12">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center rounded-3xl overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-tea-dark/90 to-tea-green/70" />
        <div className="relative z-10 text-center text-white px-4 max-w-4xl">
          <motion.h1 
            initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg dark:shadow-black/50"
          >
            {t('home.hero_title')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl mb-10 text-tea-light font-light"
          >
            {t('home.hero_subtitle')}
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link to="/catalog" className="bg-tea-gold hover:bg-yellow-600 text-white font-bold py-4 px-10 rounded-full transition transform hover:scale-105 shadow-lg dark:shadow-black/50 text-lg flex items-center justify-center">
              {t('home.hero_catalog')} <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            
            {/* Чайный конструктор (Кнопка) */}
            <button 
              onClick={() => setIsQuizOpen(true)}
              className="bg-white/20 dark:bg-[#23312B]/20 hover:bg-white/30 dark:bg-[#23312B]/30 backdrop-blur-md text-white border border-white/40 font-bold py-4 px-10 rounded-full transition transform hover:scale-105 shadow-lg dark:shadow-black/50 text-lg flex items-center justify-center"
            >
              <Search className="mr-2 h-5 w-5 text-tea-gold" />
              {t('home.hero_constructor')}
            </button>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-tea-dark dark:text-tea-light mb-12 flex items-center justify-center">
          <Leaf className="mr-3 text-tea-gold" /> {t('home.collections_title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: t('home.cat_green'), img: 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?q=80&w=800&auto=format&fit=crop', link: `/catalog?category=${encodeURIComponent('Зеленый чай')}` },
            { title: t('home.cat_black'), img: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=800&auto=format&fit=crop', link: `/catalog?category=${encodeURIComponent('Черный чай')}` },
            { title: t('home.cat_herbal'), img: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=800&auto=format&fit=crop', link: `/catalog?category=${encodeURIComponent('Травяные сборы')}` },
          ].map((cat, idx) => (
            <Link to={cat.link} key={idx} className="group relative h-80 rounded-2xl overflow-hidden shadow-lg dark:shadow-black/50 cursor-pointer">
              <img src={cat.img} alt={cat.title} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <h3 className="text-2xl font-bold text-white mb-2">{cat.title}</h3>
                <span className="text-tea-gold flex items-center opacity-0 group-hover:opacity-100 transition duration-300">
                  {t('home.to_catalog')} <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Почему выбирают нас */}
      <section className="bg-tea-light dark:bg-[#1A2421] py-12 rounded-3xl mx-4 sm:mx-0 shadow-sm border border-tea-green/20 dark:border-[#3A5243]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-tea-green/20 p-4 rounded-full mb-4">
                <Award className="h-10 w-10 text-tea-dark dark:text-tea-light" />
              </div>
              <h3 className="font-bold text-lg text-tea-dark dark:text-tea-light mb-2">{t('home.feat_direct_title')}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{t('home.feat_direct_desc')}</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-tea-green/20 p-4 rounded-full mb-4">
                <ShieldCheck className="h-10 w-10 text-tea-dark dark:text-tea-light" />
              </div>
              <h3 className="font-bold text-lg text-tea-dark dark:text-tea-light mb-2">{t('home.feat_eco_title')}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{t('home.feat_eco_desc')}</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-tea-green/20 p-4 rounded-full mb-4">
                <Truck className="h-10 w-10 text-tea-dark dark:text-tea-light" />
              </div>
              <h3 className="font-bold text-lg text-tea-dark dark:text-tea-light mb-2">{t('home.feat_fast_title')}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{t('home.feat_fast_desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Хиты продаж (Карусель/Сетка) */}
      <section className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-tea-dark dark:text-tea-light mb-2 flex items-center">
              <Coffee className="mr-3 text-tea-gold" /> {t('home.hits_title')}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">{t('home.hits_desc')}</p>
          </div>
          <Link to="/catalog" className="hidden sm:flex text-tea-dark dark:text-tea-light font-bold hover:text-tea-gold transition items-center">
            {t('home.all_hits')} <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestsellers.length > 0 ? bestsellers.map((product) => (
            <Link to={`/product/${product._id}`} key={product._id} className="bg-white dark:bg-[#23312B] rounded-2xl shadow-sm hover:shadow-xl dark:shadow-black/60 p-4 flex flex-col items-center group transition duration-300 border border-gray-50">
              <div className="w-full h-64 rounded-xl overflow-hidden mb-4 bg-gray-50 dark:bg-[#1A2421] relative">
                <img 
                  src={getProductImage(product)} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500" 
                />
                <span className="absolute top-2 right-2 bg-tea-gold text-white text-xs font-bold px-2 py-1 rounded-full shadow-md dark:shadow-black/40">
                  {t('home.hit_badge')}
                </span>
              </div>
              <div className="w-full text-left px-2">
                <h3 className="text-lg font-bold text-tea-dark dark:text-tea-light line-clamp-2">{product.name}</h3>
                <span className="text-xl font-bold text-tea-gold mt-2 block">{product.price} ₽</span>
              </div>
            </Link>
          )) : (
            [1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-gray-100 rounded-2xl h-80 animate-pulse"></div>
            ))
          )}
        </div>
      </section>

      {/* Чайный Блог */}
      <section className="container mx-auto px-4">
        <div className="bg-tea-dark text-white rounded-3xl overflow-hidden shadow-2xl">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 p-10 md:p-16 flex flex-col justify-center">
              <div className="inline-block bg-tea-gold/20 text-tea-gold font-bold px-3 py-1 rounded-full text-sm mb-6 w-max">
                {t('home.blog_badge')}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('home.blog_title')}</h2>
              <p className="text-tea-light mb-8 text-lg opacity-80 leading-relaxed">
                {t('home.blog_desc')}
              </p>
              <button className="bg-white dark:bg-[#23312B] text-tea-dark dark:text-tea-light hover:bg-tea-gold hover:text-white transition font-bold py-3 px-8 rounded-full self-start flex items-center">
                <BookOpen className="mr-2 h-5 w-5" /> {t('home.blog_read')}
              </button>
            </div>
            <div className="md:w-1/2 relative h-64 md:h-auto">
              <img 
                src="https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?q=80&w=1000&auto=format&fit=crop" 
                alt="Заваривание чая" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <PlayCircle className="h-20 w-20 text-white/80 hover:text-white hover:scale-110 transition cursor-pointer" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-tea-green/10 py-16 text-center rounded-3xl mx-4 sm:mx-0">
        <div className="max-w-2xl mx-auto px-4 min-h-[220px]">
          <h2 className="text-3xl font-bold text-tea-dark dark:text-tea-light mb-4">{t('home.news_title')}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">{t('home.news_desc')}</p>
          
          <div className="relative h-24 w-full flex justify-center mt-4">
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute inset-0 flex flex-col items-center justify-center text-tea-dark dark:text-tea-light"
                >
                  <Leaf className="h-10 w-10 text-tea-gold mb-3" />
                  <p className="font-bold text-lg">Спасибо! Вы в чайном клубе FateLeaf.</p>
                  <p className="text-sm opacity-80 mt-1">Мы отправили вам приветственное письмо с секретным промокодом!</p>
                </motion.div>
              ) : (
                <motion.form 
                  key="form"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  onSubmit={handleSubscribe} 
                  className="absolute inset-0 flex flex-col sm:flex-row gap-4 justify-center items-start sm:items-start"
                >
                  <div className="relative flex-grow max-w-sm w-full">
                    <input 
                      type="text" 
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setStatus('idle'); setErrorMsg(''); }}
                      placeholder={t('home.news_email')}
                      className={`w-full px-6 py-3 rounded-full border-2 focus:outline-none transition ${status === 'error' ? 'border-red-400 focus:border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-tea-green/30 dark:border-[#3A5243] focus:border-tea-gold'} ${status === 'loading' ? 'opacity-70 cursor-not-allowed' : ''}`}
                      disabled={status === 'loading'}
                    />
                    {status === 'error' && (
                      <span className="absolute -bottom-6 left-4 text-xs text-red-500 font-medium">{errorMsg}</span>
                    )}
                  </div>
                  <button 
                    type="submit" 
                    disabled={status === 'loading' || status === 'error'}
                    className={`bg-tea-dark hover:bg-tea-green text-white font-bold py-3 px-8 rounded-full transition shadow-lg dark:shadow-black/50 ${status === 'loading' || status === 'error' ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {status === 'loading' ? 'Отправка...' : t('home.news_subscribe')}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
      
      {/* Чайный Навигатор Квиз */}
      <TeaQuizModal isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />
    </div>
  );
};

export default Home;
