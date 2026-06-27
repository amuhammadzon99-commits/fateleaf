import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Coffee } from 'lucide-react';

const slides = [
  {
    id: 1,
    label: 'ГЛАВА I',
    title: 'Рождение идеи',
    subtitle: '2018 ГОД · ГОРЫ УЦЗИ, КИТАЙ',
    text: 'Всё началось с одной чашки. Основатель FateLeaf, путешествуя по высокогорным районам Китая, попробовал настоящий нефильтрованный Да Хун Пао прямо на плантации. В тот момент он понял: этот вкус нельзя держать в тайне. Так родилась идея привезти настоящий чай к людям.',
    bg: 'https://images.unsplash.com/photo-1566140967404-b8b3932483f5?q=80&w=1920&auto=format&fit=crop',
    accent: '#D4A373',
  },
  {
    id: 2,
    label: 'ГЛАВА II',
    title: 'Высокогорные плантации',
    subtitle: 'НА ВЫСОТЕ 1500 МЕТРОВ НАД УРОВНЕМ МОРЯ',
    text: 'Наши чайные кусты растут там, где заканчивается шум городов и начинается тишина. Туман, чистый горный воздух и особый минеральный состав почвы — вот что делает каждый лист уникальным. Мы работаем напрямую с фермерами, которые ухаживают за своими плантациями уже в четвёртом поколении.',
    bg: 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?q=80&w=1920&auto=format&fit=crop',
    accent: '#D4A373',
  },
  {
    id: 3,
    label: 'ГЛАВА III',
    title: 'Ручной сбор',
    subtitle: 'ТОЛЬКО ДВА ЛИСТОЧКА И ПОЧКА',
    text: 'Каждый лист срывается вручную. Только два верхних нежных листочка и почка — это неписаный закон мастеров чая. Сборщики работают на рассвете, когда роса ещё не высохла, и листья наполнены максимальной энергией и ароматом. Такой подход невозможно автоматизировать — только человеческие руки чувствуют правильный момент.',
    bg: 'https://images.unsplash.com/photo-1596414605929-7c8702330a3b?q=80&w=1920&auto=format&fit=crop', // Updated to tea leaves image
    accent: '#D4A373',
  },
  {
    id: 4,
    label: 'ГЛАВА IV',
    title: 'Искусство обработки',
    subtitle: 'БЕРЕЖНАЯ ТЕХНОЛОГИЯ — БЕЗ КОМПРОМИССОВ',
    text: 'После сбора начинается самое важное — обработка. Завяливание, скручивание, ферментация и обжарка. Каждый этап влияет на вкус. Наши мастера, прошедшие обучение у потомственных чайных мастеров, тщательно контролируют температуру и время. Результат — чай с безупречным, чистым профилем без химии.',
    bg: 'https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?q=80&w=1920&auto=format&fit=crop',
    accent: '#D4A373',
  },
  {
    id: 5,
    label: 'ГЛАВА V',
    title: 'Ваша чашка',
    subtitle: 'КОНЕЦ ПУТИ. НАЧАЛО РИТУАЛА',
    text: 'Путь длиной в тысячи километров завершается в вашей чашке. Каждый глоток — это труд фермера, мастерство обработчика и наша забота о качестве. В FateLeaf мы убеждены: хороший чай меняет настроение, замедляет время и возвращает вас к себе. Добро пожаловать в мир, где вкус и судьба встречаются.',
    bg: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=1920&auto=format&fit=crop',
    accent: '#D4A373',
  },
];

const StoryModal = ({ isOpen, onClose, initialSlide = 0 }) => {
  const [current, setCurrent] = useState(initialSlide);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    if (isOpen) {
      setCurrent(initialSlide);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen, initialSlide]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [current, isOpen]);

  const goNext = () => {
    if (current < slides.length - 1) {
      setDirection(1);
      setCurrent((c) => c + 1);
    } else {
      onClose();
    }
  };

  const goPrev = () => {
    if (current > 0) {
      setDirection(-1);
      setCurrent((c) => c - 1);
    }
  };

  const slide = slides[current];

  const variants = {
    enter: (dir) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
    center: { opacity: 1, x: 0 },
    exit: (dir) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[999] flex items-center justify-center p-4 md:p-8"
        >
          {/* Backdrop Overlay */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="relative w-full max-w-4xl h-[85vh] md:h-[80vh] rounded-[24px] overflow-hidden shadow-2xl flex flex-col"
          >
            {/* Background Image */}
            <AnimatePresence custom={direction} mode="sync">
              <motion.div
                key={`bg-${current}`}
                custom={direction}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${slide.bg}')` }}
              />
            </AnimatePresence>

            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/50 to-black/95 pointer-events-none" />

            {/* Header */}
            <div className="relative z-10 p-6 flex justify-between items-center w-full">
              {/* Progress bars (Stories style) */}
              <div className="flex-1 flex gap-2 mr-6">
                {slides.map((_, i) => (
                  <div
                    key={i}
                    onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                    className="h-1 flex-1 rounded-full cursor-pointer overflow-hidden bg-white dark:bg-[#23312B]/20"
                  >
                    <div 
                      className="h-full rounded-full transition-all duration-300"
                      style={{ 
                        width: i <= current ? '100%' : '0%',
                        backgroundColor: i <= current ? slide.accent : 'transparent',
                        opacity: i < current ? 0.7 : 1
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white transition-colors flex-shrink-0"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Area (Bottom aligned) */}
            <div className="relative z-10 flex-1 flex flex-col justify-end p-8 md:p-12 pb-6 md:pb-8">
              <AnimatePresence custom={direction} mode="wait">
                <motion.div
                  key={`content-${current}`}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                >
                  {/* Badge */}
                  <div
                    className="inline-flex items-center space-x-2 border rounded-full px-4 py-1.5 mb-6 backdrop-blur-sm uppercase tracking-wider"
                    style={{ borderColor: slide.accent + '50', color: slide.accent, backgroundColor: 'rgba(0,0,0,0.4)' }}
                  >
                    <Coffee size={14} />
                    <span className="text-[11px] font-bold">{slide.label} • {slide.subtitle}</span>
                  </div>

                  {/* Title */}
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                    {slide.title}
                  </h2>

                  {/* Body Text */}
                  <p className="text-white/80 text-base md:text-lg leading-relaxed max-w-2xl mb-8 font-light">
                    {slide.text}
                  </p>

                  {/* Footer / Controls */}
                  <div className="flex items-center">
                    {/* Back button */}
                    <button
                      onClick={goPrev}
                      disabled={current === 0}
                      className="w-14 h-14 rounded-full border border-white/20 bg-black/40 hover:bg-black/60 backdrop-blur-sm flex items-center justify-center text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0 mr-4"
                    >
                      <ChevronLeft size={24} />
                    </button>

                    {/* Next / Finish Button */}
                    <button
                      onClick={goNext}
                      className="flex items-center justify-center px-8 py-4 rounded-full text-white font-bold transition-transform hover:scale-105 active:scale-95"
                      style={{ backgroundColor: slide.accent }}
                    >
                      <span>{current === slides.length - 1 ? 'Конец истории' : 'Читать дальше'}</span>
                    </button>

                    {/* Counter */}
                    <span className="text-white/60 text-sm font-medium ml-6 tracking-widest">
                      {current + 1} / {slides.length}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StoryModal;
