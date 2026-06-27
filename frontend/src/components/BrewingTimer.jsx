import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, X, Droplets, Thermometer, Play, Pause, RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Default times for categories (in seconds)
const getTeaSettings = (category) => {
  const cat = category?.toLowerCase() || '';
  if (cat.includes('пуэр') || cat.includes('черный') || cat.includes('красный')) return { time: 180, temp: 95 };
  if (cat.includes('зеленый') || cat.includes('белый') || cat.includes('светлый')) return { time: 120, temp: 80 };
  if (cat.includes('улун')) return { time: 150, temp: 85 };
  if (cat.includes('матча')) return { time: 60, temp: 75 };
  return { time: 180, temp: 90 }; // default
};

const BrewingTimer = ({ category, isOpen, onClose }) => {
  const { t } = useTranslation();
  const settings = getTeaSettings(category);
  const initialTime = settings.time;
  
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeLeft(initialTime);
      setIsActive(false);
    }
  }, [isOpen, initialTime]);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      // Play sound when done
      const audio = new Audio('/done.mp3'); // Mock sound path
      audio.play().catch(e => console.log('Audio play failed', e));
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(initialTime);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progress = ((initialTime - timeLeft) / initialTime) * 100;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white dark:bg-[#1A2421] rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-tea-gold/20"
        >
          {/* Header */}
          <div className="bg-tea-dark p-6 text-white relative">
            <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white transition">
              <X size={24} />
            </button>
            <div className="flex items-center gap-3">
              <Timer className="text-tea-gold" size={28} />
              <h2 className="text-2xl font-bold">Ритуал заваривания</h2>
            </div>
            <p className="text-tea-light/80 mt-2 text-sm">Мы подобрали идеальные параметры для вашего {category}</p>
          </div>

          {/* Settings Info */}
          <div className="flex justify-around bg-tea-light/10 dark:bg-black/20 p-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex flex-col items-center gap-1 text-tea-dark dark:text-tea-light">
              <Thermometer size={20} className="text-red-500" />
              <span className="font-bold">{settings.temp}°C</span>
              <span className="text-xs text-gray-500">Температура</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-tea-dark dark:text-tea-light">
              <Droplets size={20} className="text-blue-500" />
              <span className="font-bold">200 мл</span>
              <span className="text-xs text-gray-500">Вода</span>
            </div>
          </div>

          {/* Timer Circle */}
          <div className="p-10 flex flex-col items-center">
            <div className="relative w-48 h-48 flex items-center justify-center mb-8">
              <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="8" fill="none" className="text-gray-100 dark:text-gray-800" />
                <circle 
                  cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="8" fill="none" 
                  className="text-tea-gold transition-all duration-1000 ease-linear"
                  strokeDasharray={2 * Math.PI * 88}
                  strokeDashoffset={((100 - progress) / 100) * (2 * Math.PI * 88)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="text-5xl font-light tabular-nums text-tea-dark dark:text-tea-light tracking-tight">
                {formatTime(timeLeft)}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-6">
              <button 
                onClick={resetTimer}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 transition"
              >
                <RotateCcw size={20} />
              </button>
              
              <button 
                onClick={toggleTimer}
                className={`w-16 h-16 flex items-center justify-center rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 ${
                  isActive 
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-500' 
                    : 'bg-tea-gold text-white'
                }`}
              >
                {isActive ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
              </button>
            </div>
          </div>
          
          {/* Advice */}
          <div className="bg-gray-50 dark:bg-[#151D1A] p-4 text-center text-sm text-gray-500 dark:text-gray-400">
            {timeLeft === 0 
              ? "Чай заварился! Наслаждайтесь моментом 🍃" 
              : "Прогрейте посуду горячей водой перед завариванием."}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default BrewingTimer;
