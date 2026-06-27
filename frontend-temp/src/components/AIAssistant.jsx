import { useState, useEffect } from 'react';
import axios from 'axios';
import { MessageCircle, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ sender: 'ai', text: 'Привет! Я AI-ассистент FateLeaf. Какой чай вы ищете сегодня?' }]);
  const [input, setInput] = useState('');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/products?active=true');
        setProducts(data.products || []);
      } catch (error) {
        console.error('Failed to fetch products for AI', error);
      }
    };
    fetchProducts();
  }, []);

  const generateAIResponse = (userInput) => {
    const lowerInput = userInput.toLowerCase();
    let responseText = '';
    let productMatch = null;
    
    if (lowerInput.includes('сон') || lowerInput.includes('спать') || lowerInput.includes('вечер') || lowerInput.includes('успоко')) {
      responseText = 'Для крепкого сна и вечернего расслабления идеально подойдет наш травяной сбор или легкий зеленый чай. Он поможет снять стресс после тяжелого дня 🌙';
      productMatch = products.find(p => p.name.includes('Zenith Zen') || p.category.includes('Травяной')) || products[0];
    } else if (lowerInput.includes('гост') || lowerInput.includes('друзь') || lowerInput.includes('компани')) {
      responseText = 'Для чаепития с гостями отлично подойдет наш классический черный чай или премиальные улуны. Их вкус понравится абсолютно каждому! 🫖';
      productMatch = products.find(p => p.name.includes('Golden Monkey') || p.name.includes('Solstice')) || products[0];
    } else if (lowerInput.includes('бодрост') || lowerInput.includes('утр') || lowerInput.includes('проснут') || lowerInput.includes('энерг')) {
      responseText = 'Чтобы зарядиться энергией, очень рекомендую церемониальный Mystic Matcha. Отличная альтернатива кофе с мощным зарядом чистой энергии! ⚡';
      productMatch = products.find(p => p.name.includes('Mystic Matcha')) || products[0];
    } else if (lowerInput.includes('подар') || lowerInput.includes('праздн')) {
      responseText = 'В качестве подарка рекомендую обратить внимание на наши подарочные наборы или премиальный связанный чай. 🎁';
      productMatch = products.find(p => p.name.includes('Silver Needles') || p.name.includes('Emerald')) || products[0];
    } else if (lowerInput.includes('похуд') || lowerInput.includes('детокс') || lowerInput.includes('фигур')) {
      responseText = 'Для детокса и поддержания формы отлично подойдет наш зеленый чай. Он ускоряет метаболизм! 🌿';
      productMatch = products.find(p => p.category.includes('Зеленый')) || products[0];
    } else {
      const defaultResponses = [
        'Интересный выбор! А какой вкус вам больше нравится: фруктовый, цветочный или классический терпкий?',
        'Звучит здорово! У нас в каталоге есть много отличных сортов. Может быть, вас интересуют улуны или зеленый чай?',
        'Поняла вас! Рекомендую заглянуть в наш каталог, там вы точно найдете чай по душе. Подсказать что-то конкретное?',
        'Отличный запрос! Любите добавлять в чай молоко или лимон?'
      ];
      responseText = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
      if (products.length > 0 && Math.random() > 0.5) {
        productMatch = products[Math.floor(Math.random() * products.length)];
        responseText = `Кстати, могу порекомендовать один из наших хитов продаж. Как вам такой вариант?`;
      }
    }

    return { text: responseText, product: productMatch || null };
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');
    
    setTimeout(() => {
      const response = generateAIResponse(userMsg);
      setMessages(prev => [...prev, { sender: 'ai', text: response.text, product: response.product }]);
    }, 1000);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-tea-dark text-tea-gold p-4 rounded-full shadow-2xl hover:scale-110 transition z-50"
      >
        <MessageCircle size={32} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-80 sm:w-96 bg-white dark:bg-[#23312B] rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-tea-green/30 dark:border-[#3A5243]"
          >
            <div className="bg-tea-dark p-4 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-tea-gold rounded-full animate-pulse"></div>
                <h3 className="text-tea-light font-bold">FateLeaf AI</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-tea-light hover:text-tea-gold transition">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 h-80 overflow-y-auto bg-tea-light dark:bg-[#1A2421]/30 flex flex-col space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`max-w-[85%] flex flex-col space-y-2 ${msg.sender === 'ai' ? 'self-start' : 'self-end'}`}>
                  <div className={`p-3 rounded-2xl text-sm shadow-sm ${msg.sender === 'ai' ? 'bg-white dark:bg-[#23312B] text-tea-dark dark:text-tea-light rounded-bl-none' : 'bg-tea-gold text-white rounded-br-none'}`}>
                    {msg.text}
                  </div>
                  {msg.product && (
                    <div className="bg-white dark:bg-[#23312B] rounded-xl shadow-md dark:shadow-black/40 overflow-hidden border border-tea-green/30 dark:border-[#3A5243] mt-1 max-w-[240px]">
                      <img src={msg.product.images?.[0] || '/placeholder.svg'} alt={msg.product.name} className="w-full h-32 object-cover" />
                      <div className="p-3">
                        <h4 className="font-bold text-tea-dark dark:text-tea-light text-sm mb-1">{msg.product.name}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-3 mb-2">{msg.product.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-tea-gold text-sm">{msg.product.price} сум</span>
                          <Link to={`/product/${msg.product._id}`} onClick={() => setIsOpen(false)} className="bg-tea-dark text-tea-gold px-3 py-1 rounded text-xs font-bold hover:bg-tea-green transition">
                            Смотреть
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="p-3 bg-white dark:bg-[#23312B] border-t flex space-x-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Спросите о чае..."
                className="flex-grow p-2 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-tea-gold/50"
              />
              <button onClick={handleSend} className="bg-tea-dark text-tea-gold p-2 rounded-xl hover:bg-tea-green transition">
                <Send size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAssistant;
