import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ChevronRight, Check, Gift, ArrowLeft } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { addToCart } from '../store/cartSlice';
import toast from 'react-hot-toast';

const BOXES = [
  { id: 'box1', name: 'Изумрудный Лес', price: 500, image: '/placeholder.jpg', color: 'bg-emerald-800' },
  { id: 'box2', name: 'Золотой Рассвет', price: 600, image: '/placeholder.jpg', color: 'bg-amber-600' },
  { id: 'box3', name: 'Черный Бархат', price: 700, image: '/placeholder.jpg', color: 'bg-gray-900' },
];

const GiftConstructor = () => {
  const [step, setStep] = useState(1);
  const [selectedBox, setSelectedBox] = useState(BOXES[0]);
  const [selectedTeas, setSelectedTeas] = useState([]);
  const [postcardText, setPostcardText] = useState('');
  const [products, setProducts] = useState([]);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/products');
        setProducts(data.products || []);
      } catch (e) {
        console.error(e);
      }
    };
    fetchProducts();
  }, []);

  const toggleTea = (product) => {
    if (selectedTeas.find(t => t._id === product._id)) {
      setSelectedTeas(selectedTeas.filter(t => t._id !== product._id));
    } else {
      if (selectedTeas.length >= 3) {
        toast.error('В набор помещается только 3 сорта чая');
        return;
      }
      setSelectedTeas([...selectedTeas, product]);
    }
  };

  const calculateTotal = () => {
    const teasSum = selectedTeas.reduce((acc, t) => acc + t.price, 0);
    return selectedBox.price + teasSum;
  };

  const handleAddToCart = () => {
    if (selectedTeas.length < 3) {
      toast.error('Выберите 3 сорта чая');
      return;
    }
    
    const giftItem = {
      _id: `gift_${Date.now()}`,
      name: `Подарочный набор "${selectedBox.name}"`,
      price: calculateTotal(),
      image: selectedBox.image,
      qty: 1,
      isGiftBox: true,
      description: `Чай: ${selectedTeas.map(t => t.name).join(', ')}. Открытка: ${postcardText || 'Без текста'}`,
    };

    dispatch(addToCart(giftItem));
    toast.success('Подарочный набор добавлен в корзину');
    navigate('/cart');
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <Link to="/" className="inline-flex items-center text-tea-dark dark:text-tea-light hover:text-tea-gold transition mb-6">
        <ArrowLeft size={20} className="mr-2" />
        На главную
      </Link>

      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-tea-dark dark:text-tea-light flex items-center justify-center gap-3">
          <Gift className="text-tea-gold" size={36} />
          Собери свой подарок
        </h1>
        <p className="text-gray-500 mt-2">Идеальный набор из 3 сортов премиального чая</p>
      </div>

      <div className="flex gap-4 mb-8 justify-center">
        {[1, 2, 3].map(s => (
          <div key={s} className={`flex items-center ${s < 3 ? 'w-24 md:w-32' : ''}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm z-10 transition ${step >= s ? 'bg-tea-dark text-white' : 'bg-gray-200 text-gray-500'}`}>
              {s}
            </div>
            {s < 3 && <div className={`h-1 flex-grow -ml-2 -mr-2 transition ${step > s ? 'bg-tea-dark' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-[#23312B] rounded-3xl p-6 md:p-10 shadow-xl border border-tea-gold/20">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: BOX */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-2xl font-bold mb-6 text-center">Выберите дизайн коробки</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {BOXES.map(box => (
                  <div 
                    key={box.id} 
                    onClick={() => setSelectedBox(box)}
                    className={`cursor-pointer rounded-2xl overflow-hidden border-4 transition ${selectedBox.id === box.id ? 'border-tea-gold scale-105' : 'border-transparent hover:border-gray-200'}`}
                  >
                    <div className={`h-48 ${box.color} flex items-center justify-center`}>
                      <Gift size={64} className="text-white/50" />
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-[#1A2421] text-center">
                      <h3 className="font-bold text-lg">{box.name}</h3>
                      <p className="text-tea-gold font-bold">{box.price} ₽</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-10 flex justify-end">
                <button onClick={() => setStep(2)} className="bg-tea-dark hover:bg-tea-gold text-white font-bold py-3 px-8 rounded-xl transition flex items-center">
                  Далее <ChevronRight className="ml-2" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: TEA */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-2xl font-bold mb-2 text-center">Выберите 3 сорта чая</h2>
              <p className="text-center text-gray-500 mb-6">Осталось выбрать: {3 - selectedTeas.length}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-96 overflow-y-auto pr-2 pb-4">
                {products.map(product => {
                  const isSelected = selectedTeas.find(t => t._id === product._id);
                  return (
                    <div 
                      key={product._id} 
                      onClick={() => toggleTea(product)}
                      className={`cursor-pointer rounded-xl p-3 border-2 transition flex flex-col relative ${isSelected ? 'border-tea-gold bg-tea-gold/5' : 'border-gray-100 dark:border-gray-800 hover:border-tea-green'}`}
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2 bg-tea-gold text-white rounded-full p-1">
                          <Check size={14} />
                        </div>
                      )}
                      <div className="h-24 bg-gray-50 dark:bg-black/20 rounded-lg mb-3 overflow-hidden flex items-center justify-center">
                        {product.images && product.images[0] ? (
                          <img src={product.images[0]} alt={product.name} className="h-full object-cover" />
                        ) : (
                          <span className="text-4xl">🍃</span>
                        )}
                      </div>
                      <h4 className="font-bold text-sm leading-tight mb-1 flex-grow line-clamp-2">{product.name}</h4>
                      <p className="text-tea-gold font-bold text-sm">{product.price} ₽</p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 flex justify-between">
                <button onClick={() => setStep(1)} className="text-gray-500 hover:text-black font-bold py-3 px-6 rounded-xl transition">
                  Назад
                </button>
                <button 
                  onClick={() => selectedTeas.length === 3 ? setStep(3) : toast.error('Нужно выбрать 3 сорта чая')} 
                  className={`font-bold py-3 px-8 rounded-xl transition flex items-center ${selectedTeas.length === 3 ? 'bg-tea-dark hover:bg-tea-gold text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                >
                  Далее <ChevronRight className="ml-2" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: POSTCARD */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <h2 className="text-2xl font-bold mb-6">Текст для открытки</h2>
                  <p className="text-gray-500 mb-4">Напишите теплые слова, и мы вложим их в красивую открытку ручной работы абсолютно бесплатно.</p>
                  <textarea 
                    rows="6" 
                    value={postcardText}
                    onChange={(e) => setPostcardText(e.target.value)}
                    placeholder="Дорогой друг, поздравляю тебя с..."
                    className="w-full rounded-2xl border-gray-300 shadow-sm focus:border-tea-gold focus:ring-tea-gold dark:bg-[#1A2421] dark:border-[#3A5243] p-4 resize-none"
                  ></textarea>
                </div>

                <div className="bg-gray-50 dark:bg-[#1A2421] p-6 rounded-3xl border border-tea-green/20">
                  <h3 className="text-xl font-bold mb-4">Ваш набор</h3>
                  <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <div className={`w-16 h-16 rounded-xl ${selectedBox.color} flex items-center justify-center`}>
                       <Gift size={24} className="text-white/50" />
                    </div>
                    <div>
                      <p className="font-bold">Коробка "{selectedBox.name}"</p>
                      <p className="text-tea-gold">{selectedBox.price} ₽</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    {selectedTeas.map(t => (
                      <div key={t._id} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 dark:text-gray-300 line-clamp-1 mr-4">{t.name}</span>
                        <span className="font-bold whitespace-nowrap">{t.price} ₽</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center text-xl font-bold pt-4 border-t border-gray-200 dark:border-gray-700 mb-6">
                    <span>Итого:</span>
                    <span className="text-tea-gold">{calculateTotal()} ₽</span>
                  </div>

                  <button onClick={handleAddToCart} className="w-full bg-tea-dark hover:bg-tea-gold text-white font-bold py-4 rounded-xl transition flex items-center justify-center shadow-xl">
                    <ShoppingBag className="mr-2" /> Добавить в корзину
                  </button>
                </div>
              </div>

              <div className="mt-8 flex justify-start">
                <button onClick={() => setStep(2)} className="text-gray-500 hover:text-black font-bold py-3 px-6 rounded-xl transition">
                  Назад
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

export default GiftConstructor;
