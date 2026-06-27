import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Zap, 
  Compass, 
  Gift, 
  ChevronRight, 
  Check, 
  RotateCcw, 
  ShoppingBag, 
  Loader2,
  Sparkles,
  Leaf,
  Coffee,
  Heart
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { addToCart } from '../store/cartSlice';
import toast from 'react-hot-toast';
import { getProductImage } from '../utils/imageHelper';

const TeaQuizModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({ step1: '', step2: '', step3: '' });
  const [direction, setDirection] = useState(1);
  const [dbProducts, setDbProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setStep(1);
      setAnswers({ step1: '', step2: '', step3: '' });
      fetchProducts();
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const fetchProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const { data } = await axios.get('/api/products');
      setDbProducts(data.products || []);
    } catch (error) {
      console.error('Failed to load products for quiz', error);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const handleSelectOption = (optionValue) => {
    setDirection(1);
    if (step === 1) {
      setAnswers({ ...answers, step1: optionValue });
      setStep(2);
    } else if (step === 2) {
      setAnswers({ ...answers, step2: optionValue });
      setStep(3);
    } else if (step === 3) {
      setAnswers({ ...answers, step3: optionValue });
      setStep(4); // Result step
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setDirection(-1);
      setStep(step - 1);
    }
  };

  const resetQuiz = () => {
    setDirection(-1);
    setAnswers({ step1: '', step2: '', step3: '' });
    setStep(1);
  };

  const getRecommendationKey = () => {
    if (answers.step1 === 'gift') return 'gift';
    if (answers.step1 === 'energy') {
      if (answers.step3 === 'powder') return 'matcha';
      return 'focus';
    }
    // relax
    if (answers.step2 === 'fresh') return 'fresh';
    if (answers.step2 === 'sweet') return 'sweet';
    if (answers.step2 === 'woody') return 'warm';
    return 'berry';
  };

  const quizSets = {
    focus: {
      titleKey: 'quiz.set_focus_title',
      descKey: 'quiz.set_focus_desc',
      productNames: ['Да Хун Пао', 'Пуэр']
    },
    matcha: {
      titleKey: 'quiz.set_matcha_title',
      descKey: 'quiz.set_matcha_desc',
      productNames: ['Матча']
    },
    fresh: {
      titleKey: 'quiz.set_fresh_title',
      descKey: 'quiz.set_fresh_desc',
      productNames: ['Лунцзин', 'Серебряные']
    },
    sweet: {
      titleKey: 'quiz.set_sweet_title',
      descKey: 'quiz.set_sweet_desc',
      productNames: ['Молочный Улун', 'Те Гуань Инь']
    },
    warm: {
      titleKey: 'quiz.set_warm_title',
      descKey: 'quiz.set_warm_desc',
      productNames: ['Дянь Хун', 'Черный']
    },
    berry: {
      titleKey: 'quiz.set_berry_title',
      descKey: 'quiz.set_berry_desc',
      productNames: ['Сбор', 'Ягод']
    },
    gift: {
      titleKey: 'quiz.set_gift_title',
      descKey: 'quiz.set_gift_desc',
      productNames: ['Набор']
    }
  };

  const getRecommendedProducts = () => {
    const recKey = getRecommendationKey();
    const setInfo = quizSets[recKey];
    if (!setInfo) return [];

    return setInfo.productNames.map(name => {
      const match = dbProducts.find(p => p.name.toLowerCase().includes(name.toLowerCase()));
      if (match) {
        return match;
      }
      // Mock fallback if DB product not found (to ensure it doesn't crash)
      return {
        _id: 'mock-' + name,
        name: name,
        price: name.includes('Набор') ? 2400 : 750,
        images: ['/placeholder.jpg'],
        category: 'Чай'
      };
    });
  };

  const handleAddToCart = () => {
    const recProducts = getRecommendedProducts();
    if (recProducts.length === 0) return;

    setIsAddingToCart(true);
    
    // Add each product with a 10% discount
    setTimeout(() => {
      recProducts.forEach(product => {
        dispatch(addToCart({
          _id: product._id,
          name: product.name,
          price: Math.round(product.price * 0.9), // 10% discount
          images: product.images,
          qty: 1
        }));
      });
      setIsAddingToCart(false);
      toast.success(t('wishlist.added_toast', 'Товар добавлен в корзину!'), { icon: '🛍️' });
      onClose();
    }, 1000);
  };

  // Animations
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', duration: 0.5 } },
    exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.3 } }
  };

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { duration: 0.3 } },
    exit: (dir) => ({ x: dir < 0 ? 300 : -300, opacity: 0, transition: { duration: 0.3 } })
  };

  if (!isOpen) return null;

  const recKey = getRecommendationKey();
  const recommendedSet = quizSets[recKey];
  const recProducts = getRecommendedProducts();

  const originalPrice = recProducts.reduce((acc, p) => acc + p.price, 0);
  const discountedPrice = Math.round(originalPrice * 0.9);

  return (
    <AnimatePresence>
      <motion.div
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="bg-white dark:bg-[#23312B] rounded-3xl p-6 md:p-10 shadow-2xl w-full max-w-2xl relative overflow-hidden border border-gray-100 dark:border-[#3A5243] flex flex-col justify-between min-h-[480px]"
        >
          {/* Decorative Sparkles */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-tea-light dark:bg-[#1A2421]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-tea-gold/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top header & Close button */}
          <div className="flex justify-between items-center mb-6 z-10">
            <div className="flex items-center gap-2">
              <Sparkles className="text-tea-gold w-5 h-5 animate-pulse" />
              <span className="font-semibold text-xs tracking-wider text-tea-dark dark:text-tea-light/60 uppercase">
                {t('quiz.title')}
              </span>
            </div>
            
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 dark:text-gray-400 flex items-center justify-center transition active:scale-95"
            >
              <X size={18} />
            </button>
          </div>

          {/* Progress Bar (Visible for steps 1-3) */}
          {step <= 3 && (
            <div className="mb-6 z-10">
              <div className="flex justify-between items-center text-xs font-semibold text-gray-400 mb-2">
                <span>{t('quiz.step')} {step} {t('quiz.of')} 3</span>
                <span className="text-tea-gold">{Math.round((step / 3) * 100)}%</span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(step / 3) * 100}%` }}
                  transition={{ duration: 0.3 }}
                  className="h-full bg-tea-gold rounded-full"
                />
              </div>
            </div>
          )}

          {/* Steps Content Slider */}
          <div className="flex-grow flex items-center justify-center z-10 relative">
            <AnimatePresence mode="wait" custom={direction}>
              {step === 1 && (
                <motion.div
                  key="step1"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="w-full space-y-6"
                >
                  <h3 className="text-xl md:text-2xl font-bold text-tea-dark dark:text-tea-light text-center mb-6">
                    {t('quiz.step1_q')}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      onClick={() => handleSelectOption('energy')}
                      className="group p-5 bg-gray-50 dark:bg-[#1A2421] hover:bg-tea-light dark:bg-[#1A2421]/10 border border-gray-200 dark:border-[#3A5243] hover:border-tea-gold/50 rounded-2xl flex flex-col items-center text-center transition duration-300 transform active:scale-95"
                    >
                      <div className="w-12 h-12 rounded-full bg-tea-green/20 text-tea-dark dark:text-tea-light flex items-center justify-center mb-4 group-hover:scale-110 transition duration-300">
                        <Zap className="w-6 h-6 text-tea-gold" />
                      </div>
                      <span className="font-bold text-tea-dark dark:text-tea-light block mb-2">{t('quiz.step1_opt1_t')}</span>
                      <span className="text-xs text-gray-400 leading-snug">{t('quiz.step1_opt1_d')}</span>
                    </button>

                    <button
                      onClick={() => handleSelectOption('relax')}
                      className="group p-5 bg-gray-50 dark:bg-[#1A2421] hover:bg-tea-light dark:bg-[#1A2421]/10 border border-gray-200 dark:border-[#3A5243] hover:border-tea-gold/50 rounded-2xl flex flex-col items-center text-center transition duration-300 transform active:scale-95"
                    >
                      <div className="w-12 h-12 rounded-full bg-tea-green/20 text-tea-dark dark:text-tea-light flex items-center justify-center mb-4 group-hover:scale-110 transition duration-300">
                        <Compass className="w-6 h-6 text-tea-gold" />
                      </div>
                      <span className="font-bold text-tea-dark dark:text-tea-light block mb-2">{t('quiz.step1_opt2_t')}</span>
                      <span className="text-xs text-gray-400 leading-snug">{t('quiz.step1_opt2_d')}</span>
                    </button>

                    <button
                      onClick={() => handleSelectOption('gift')}
                      className="group p-5 bg-gray-50 dark:bg-[#1A2421] hover:bg-tea-light dark:bg-[#1A2421]/10 border border-gray-200 dark:border-[#3A5243] hover:border-tea-gold/50 rounded-2xl flex flex-col items-center text-center transition duration-300 transform active:scale-95"
                    >
                      <div className="w-12 h-12 rounded-full bg-tea-green/20 text-tea-dark dark:text-tea-light flex items-center justify-center mb-4 group-hover:scale-110 transition duration-300">
                        <Gift className="w-6 h-6 text-tea-gold" />
                      </div>
                      <span className="font-bold text-tea-dark dark:text-tea-light block mb-2">{t('quiz.step1_opt3_t')}</span>
                      <span className="text-xs text-gray-400 leading-snug">{t('quiz.step1_opt3_d')}</span>
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="w-full space-y-6"
                >
                  <h3 className="text-xl md:text-2xl font-bold text-tea-dark dark:text-tea-light text-center mb-4">
                    {t('quiz.step2_q')}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
                    {[
                      { val: 'fresh', tKey: 'quiz.step2_opt1_t', dKey: 'quiz.step2_opt1_d', icon: <Leaf className="w-5 h-5 text-tea-gold" /> },
                      { val: 'sweet', tKey: 'quiz.step2_opt2_t', dKey: 'quiz.step2_opt2_d', icon: <Sparkles className="w-5 h-5 text-tea-gold" /> },
                      { val: 'woody', tKey: 'quiz.step2_opt3_t', dKey: 'quiz.step2_opt3_d', icon: <Coffee className="w-5 h-5 text-tea-gold" /> },
                      { val: 'fruity', tKey: 'quiz.step2_opt4_t', dKey: 'quiz.step2_opt4_d', icon: <Heart className="w-5 h-5 text-tea-gold" /> }
                    ].map(opt => (
                      <button
                        key={opt.val}
                        onClick={() => handleSelectOption(opt.val)}
                        className="group flex items-start text-left p-4 bg-gray-50 dark:bg-[#1A2421] hover:bg-tea-light dark:bg-[#1A2421]/10 border border-gray-200 dark:border-[#3A5243] hover:border-tea-gold/50 rounded-2xl transition duration-300 transform active:scale-95"
                      >
                        <div className="bg-white dark:bg-[#23312B] p-2.5 rounded-xl border border-gray-100 dark:border-[#3A5243] mr-3.5 group-hover:scale-105 transition">
                          {opt.icon}
                        </div>
                        <div>
                          <span className="font-bold text-tea-dark dark:text-tea-light block text-sm mb-1">{t(opt.tKey)}</span>
                          <span className="text-xxs text-gray-400 leading-tight block">{t(opt.dKey)}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="w-full space-y-6"
                >
                  <h3 className="text-xl md:text-2xl font-bold text-tea-dark dark:text-tea-light text-center mb-6">
                    {t('quiz.step3_q')}
                  </h3>

                  <div className="space-y-3.5 max-w-md mx-auto">
                    {[
                      { val: 'traditional', tKey: 'quiz.step3_opt1_t', dKey: 'quiz.step3_opt1_d' },
                      { val: 'quick', tKey: 'quiz.step3_opt2_t', dKey: 'quiz.step3_opt2_d' },
                      { val: 'powder', tKey: 'quiz.step3_opt3_t', dKey: 'quiz.step3_opt3_d' }
                    ].map(opt => (
                      <button
                        key={opt.val}
                        onClick={() => handleSelectOption(opt.val)}
                        className="group w-full flex items-center justify-between p-5 bg-gray-50 dark:bg-[#1A2421] hover:bg-tea-light dark:bg-[#1A2421]/10 border border-gray-200 dark:border-[#3A5243] hover:border-tea-gold/50 rounded-2xl text-left transition duration-300 transform active:scale-[0.98]"
                      >
                        <div className="pr-4">
                          <span className="font-bold text-tea-dark dark:text-tea-light block text-base mb-1">{t(opt.tKey)}</span>
                          <span className="text-xs text-gray-400 leading-snug">{t(opt.dKey)}</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-tea-gold group-hover:translate-x-1 transition" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 4 && recommendedSet && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="w-full text-center space-y-6"
                >
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    {t('quiz.result_title')}
                  </h3>

                  {/* Recommendation Card */}
                  <div className="bg-stone-50 border border-stone-200/60 rounded-3xl p-6 md:p-8 max-w-xl mx-auto shadow-inner relative overflow-hidden text-left">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-tea-gold/10 rounded-full blur-2xl pointer-events-none" />
                    
                    <span className="inline-block px-3 py-1 bg-tea-gold/20 text-tea-dark dark:text-tea-light border border-tea-gold/20 text-xxs font-extrabold rounded-full uppercase tracking-wider mb-3">
                      {t('quiz.title')} Recommendation
                    </span>

                    <h4 className="text-2xl font-bold text-tea-dark dark:text-tea-light mb-3 flex items-center">
                      <Leaf className="text-tea-gold w-6 h-6 mr-2 flex-shrink-0" />
                      {t(recommendedSet.titleKey)}
                    </h4>

                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6 font-medium">
                      {t(recommendedSet.descKey)}
                    </p>

                    {/* Products Grid list */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                      {recProducts.map((p, idx) => (
                        <div key={idx} className="flex items-center gap-3 bg-white dark:bg-[#23312B] p-3 rounded-xl border border-gray-100 dark:border-[#3A5243]">
                          <img 
                            src={getProductImage(p)} 
                            alt={p.name} 
                            className="w-12 h-12 object-cover rounded-lg border border-gray-100 dark:border-[#3A5243]" 
                          />
                          <div>
                            <span className="font-bold text-xs text-tea-dark dark:text-tea-light block line-clamp-1">{p.name}</span>
                            <span className="text-xxs text-gray-400">{p.category} · {p.weight || '1 шт'}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pricing details */}
                    <div className="border-t border-stone-200 pt-4 flex justify-between items-center">
                      <div>
                        <span className="text-xs text-gray-400 block font-semibold uppercase">{t('header.delivery', 'Стоимость сета')}:</span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-bold text-tea-gold">{discountedPrice} ₽</span>
                          <span className="text-sm text-gray-400 line-through">{originalPrice} ₽</span>
                        </div>
                      </div>
                      
                      <div className="bg-tea-dark text-white px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest animate-bounce">
                        -10% Скидка
                      </div>
                    </div>
                  </div>

                  {/* Call to Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto pt-2">
                    <button
                      onClick={handleAddToCart}
                      disabled={isAddingToCart}
                      className="flex-1 bg-tea-dark hover:bg-tea-green text-white font-bold py-4 px-6 rounded-xl transition shadow-lg dark:shadow-black/50 flex items-center justify-center transform active:scale-95 disabled:opacity-75 disabled:active:scale-100 text-sm"
                    >
                      {isAddingToCart ? (
                        <Loader2 className="animate-spin text-tea-gold mr-2" size={18} />
                      ) : (
                        <ShoppingBag className="mr-2" size={18} />
                      )}
                      {t('quiz.btn_cart')}
                    </button>
                    
                    <button
                      onClick={resetQuiz}
                      className="bg-white dark:bg-[#23312B] hover:bg-gray-50 dark:bg-[#1A2421] border border-gray-200 dark:border-[#3A5243] text-gray-700 dark:text-gray-300 font-bold py-4 px-6 rounded-xl transition shadow-sm hover:shadow active:scale-95 flex items-center justify-center text-sm"
                    >
                      <RotateCcw className="mr-2" size={18} />
                      {t('quiz.btn_again')}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Back Button (Only visible on steps 2-3) */}
          {step > 1 && step <= 3 && (
            <div className="flex justify-start border-t border-gray-100 dark:border-[#3A5243] pt-4 mt-6 z-10">
              <button
                onClick={handleBack}
                className="text-sm font-semibold text-gray-400 hover:text-tea-dark dark:text-tea-light transition flex items-center active:scale-95"
              >
                <ChevronRight className="rotate-180 mr-1 w-4 h-4" />
                {t('contacts_page.wholesale_modal_close', 'Назад')}
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TeaQuizModal;
