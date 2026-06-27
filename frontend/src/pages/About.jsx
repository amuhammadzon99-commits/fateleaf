import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Coffee, Leaf, ArrowRight, Award, Truck, CheckCircle, BookOpen, Quote, ChevronRight } from 'lucide-react';
import StoryModal from '../components/StoryModal';
import BlogPostModal from '../components/BlogPostModal';

// Компонент для анимации цифр
const AnimatedNumber = ({ end, duration = 2, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      let startTime;
      let animationFrame;

      const updateCount = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        
        // Easing function: easeOutQuart
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        setCount(Math.floor(end * easeOutQuart));
        
        if (progress < 1) {
          animationFrame = requestAnimationFrame(updateCount);
        }
      };

      animationFrame = requestAnimationFrame(updateCount);
      return () => cancelAnimationFrame(animationFrame);
    }
  }, [end, duration, isInView]);

  return <span ref={ref}>{count}{suffix}</span>;
};

const About = () => {
  const { t } = useTranslation();
  const [storyOpen, setStoryOpen] = useState(false);
  const [storyInitialSlide, setStoryInitialSlide] = useState(0);
  const [selectedPost, setSelectedPost] = useState(null);
  const [blogModalOpen, setBlogModalOpen] = useState(false);

  const blogPosts = [
    {
      id: 1,
      tag: 'Руководство',
      title: 'Как правильно заваривать церемониальную матчу дома',
      shortDesc: 'Искусство приготовления японского порошкового чая требует правильной посуды и соблюдения температуры воды.',
      img: 'https://images.unsplash.com/photo-1582793988951-9aed5509eb97?q=80&w=600&auto=format&fit=crop',
      content: [
        'Искусство приготовления японского порошкового чая требует правильной посуды и соблюдения температуры воды. Для заваривания матчи используйте специальный бамбуковый венчик (часен) и чашу (чаван).',
        'Вода ни в коем случае не должна быть кипятком — идеальная температура составляет около 75-80°C.',
        'Взбейте матчу интенсивными W-образными движениями до образования однородной, густой нефритовой пены. Это не просто напиток, а настоящий ритуал медитации.'
      ],
      date: '12 Апреля, 2026'
    },
    {
      id: 2,
      tag: 'Посуда',
      title: 'В чем разница между Исинской глиной и фарфором?',
      shortDesc: 'Выбор посуды напрямую влияет на вкус чая. Разбираемся, какой материал лучше раскрывает улуны, а какой — зеленые сорта.',
      img: 'https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?q=80&w=600&auto=format&fit=crop',
      content: [
        'Выбор посуды напрямую влияет на вкус вашего чая. Исинская глина — это особый пористый материал, который со временем впитывает чайные эфирные масла и «нарабатывается», делая вкус чая более плотным и глубоким.',
        'Именно поэтому глиняные чайники принято использовать только для одной категории чая (например, только для темных улунов или пуэров).',
        'Фарфор, напротив, абсолютно нейтрален. Он не впитывает запахи, быстро отдает тепло и идеально подходит для дегустации деликатных сортов: зеленых, белых чаев и светлых улунов.'
      ],
      date: '5 Мая, 2026'
    },
    {
      id: 3,
      tag: 'История',
      title: 'Белый чай: напиток императоров и аристократов',
      shortDesc: 'История происхождения Серебряных игл и почему этот сорт считается самым редким и ценным в чайном мире.',
      img: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=600&auto=format&fit=crop',
      content: [
        'История происхождения белого чая, в частности знаменитого сорта Серебряные иглы (Бай Хао Инь Чжэнь), уходит корнями в глубь веков.',
        'Этот сорт традиционно считался самым редким и ценным в чайном мире, и долгое время поставлялся исключительно к императорскому двору Китая.',
        'Для его производства собирают только самые молодые, еще не раскрывшиеся ворсистые почки. Минимальная термическая обработка (только завяливание и бережная сушка на солнце) позволяет сохранить максимум антиоксидантов и невероятно тонкий, слегка сладковатый вкус с нежными цветочными нотками.'
      ],
      date: '20 Мая, 2026'
    }
  ];

  return (
    <div className="bg-white dark:bg-[#23312B]">
      {/* 1. Главный баннер */}
      <section className="relative h-[75vh] flex items-center justify-center overflow-hidden">
        <motion.div 
          initial={{ scale: 1.05 }}
          animate={{ scale: 1.2 }}
          transition={{ duration: 20, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/fateleaf_about_hero.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/80" />
        <motion.div
          initial={{ opacity: 0.3 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at center, rgba(212,175,55,0.08) 0%, transparent 70%)" }}
        />

        <div className="relative z-10 text-center text-white px-4 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 bg-tea-gold/20 border border-tea-gold/40 backdrop-blur-sm px-4 py-1.5 rounded-full text-tea-gold text-sm font-medium mb-6"
          >
            <span>✦</span>
            <span>FateLeaf · Tea & Destiny</span>
            <span>✦</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="text-6xl md:text-8xl font-bold mb-6 leading-tight"
            style={{ textShadow: "0 0 40px rgba(212,175,55,0.4), 0 4px 20px rgba(0,0,0,0.8)" }}
          >
            <span className="text-white">{t('about.title')} </span>
            <span className="text-tea-gold">{t('about.fateleaf')}</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-xl md:text-2xl font-light text-white/90 max-w-2xl mx-auto leading-relaxed"
          >
            «Премиальный чай для истинных ценителей.<br />
            <span className="text-tea-gold/90 italic">Откройте для себя вкус судьбы в каждой чашке».</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-8 flex flex-col items-center space-y-6"
          >
            <button
              onClick={() => {
                document.getElementById('philosophy').scrollIntoView({ behavior: 'smooth' });
              }}
              className="group relative inline-flex items-center space-x-3 bg-tea-gold hover:bg-yellow-500 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:shadow-[0_0_50px_rgba(212,175,55,0.7)] hover:scale-105 text-lg"
            >
              <BookOpen size={22} className="group-hover:rotate-12 transition-transform duration-300" />
              <span>{t('about.story_btn')}</span>
              <motion.span animate={{ y: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }} className="ml-2 inline-block">
                ↓
              </motion.span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* 2. Наша философия / Ценности */}
      <section className="py-20 bg-tea-light dark:bg-[#1A2421]/30" id="philosophy">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-tea-dark dark:text-tea-light mb-4">{t('about.philosophy')}</h2>
            <div className="w-24 h-1 bg-tea-gold mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-[#23312B] p-8 rounded-2xl shadow-sm border border-tea-green/20 dark:border-[#3A5243] text-center">
              <div className="w-16 h-16 bg-tea-light dark:bg-[#1A2421] rounded-full flex items-center justify-center mx-auto mb-6 text-tea-dark dark:text-tea-light">
                <Award size={32} />
              </div>
              <h3 className="text-xl font-bold text-tea-dark dark:text-tea-light mb-4">{t('about.quality_title')}</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {t('about.quality_desc')}
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-[#23312B] p-8 rounded-2xl shadow-sm border border-tea-green/20 dark:border-[#3A5243] text-center">
              <div className="w-16 h-16 bg-tea-light dark:bg-[#1A2421] rounded-full flex items-center justify-center mx-auto mb-6 text-tea-dark dark:text-tea-light">
                <Coffee size={32} />
              </div>
              <h3 className="text-xl font-bold text-tea-dark dark:text-tea-light mb-4">{t('about.ritual_title')}</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {t('about.ritual_desc')}
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-[#23312B] p-8 rounded-2xl shadow-sm border border-tea-green/20 dark:border-[#3A5243] text-center">
              <div className="w-16 h-16 bg-tea-light dark:bg-[#1A2421] rounded-full flex items-center justify-center mx-auto mb-6 text-tea-dark dark:text-tea-light">
                <Leaf size={32} />
              </div>
              <h3 className="text-xl font-bold text-tea-dark dark:text-tea-light mb-4">{t('about.natural_title')}</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {t('about.natural_desc')}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. Команда / Наши эксперты */}
      <section className="py-20 bg-white dark:bg-[#23312B]">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
            <div className="w-full md:w-5/12">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/5] group">
                <img 
                  src="https://images.unsplash.com/photo-1512485800893-b08ec1ea59b1?q=80&w=800&auto=format&fit=crop" 
                  alt="Основатель FateLeaf" 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-8">
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-2">Александр С.</h3>
                    <p className="text-tea-gold font-medium text-lg">Основатель и главный ти-тестер</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full md:w-7/12">
              <h2 className="text-3xl md:text-4xl font-bold text-tea-dark dark:text-tea-light mb-8">Создано из страсти к чайной культуре</h2>
              <Quote className="text-tea-gold mb-6 opacity-40" size={56} />
              <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-6 italic">
                «Для меня чай всегда был больше, чем просто напиток. Это философия, момент тишины и гармонии в нашем сумасшедшем ритме жизни. Я создал FateLeaf, чтобы поделиться с вами этим удивительным миром настоящих вкусов и ароматов, которые мы находим в самых отдаленных уголках Азии».
              </p>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                Каждый купаж FateLeaf проходит строгий отбор. Мы лично путешествуем по плантациям, знакомимся с фермерами и выбираем только те сорта, которые дарят искреннюю радость и вдохновение. Наша миссия — сделать премиальный чай доступным для каждого ценителя.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Путь чая */}
      <section className="py-20 bg-gray-50 dark:bg-[#1A2421]">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-tea-dark dark:text-tea-light mb-4">{t('about.our_path')}</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">От далеких горных склонов до вашей любимой чашки</p>
            <div className="w-24 h-1 bg-tea-gold mx-auto rounded-full mt-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { title: "Сбор", desc: "Высокогорные экологичные плантации", img: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=600&auto=format&fit=crop" },
              { title: "Сортировка", desc: "Бережный ручной отбор лучших листьев", img: "https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?q=80&w=600&auto=format&fit=crop" },
              { title: "Упаковка", desc: "Герметичная упаковка сохраняет аромат", img: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600&auto=format&fit=crop" },
              { title: "Ваша чашка", desc: "Момент истинного наслаждения", img: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=600&auto=format&fit=crop" },
            ].map((step, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => {
                  setStoryInitialSlide(index + 1);
                  setStoryOpen(true);
                }}
                className="group relative rounded-2xl overflow-hidden shadow-md dark:shadow-black/40 aspect-[4/5] cursor-pointer"
              >
                <img src={step.img} alt={step.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-tea-dark/90 via-tea-dark/40 to-transparent flex flex-col justify-end p-6">
                  <div className="text-tea-gold font-bold text-4xl mb-2 opacity-50">0{index + 1}</div>
                  <h4 className="text-xl font-bold text-white mb-2 group-hover:text-tea-gold transition">{step.title}</h4>
                  <p className="text-tea-light text-sm">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Чайная география (Интерактивная карта) */}
      <section className="py-24 bg-tea-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506804886640-cedec0ed0df5?q=80&w=2000&auto=format&fit=crop')] opacity-10 bg-cover bg-center" />
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">География наших плантаций</h2>
            <p className="text-tea-light max-w-2xl mx-auto text-lg">Прямые поставки из самых знаменитых чайных регионов мира</p>
            <div className="w-24 h-1 bg-tea-gold mx-auto rounded-full mt-6"></div>
          </div>
          
          <div className="relative w-full aspect-[4/3] md:aspect-[21/9] rounded-3xl overflow-hidden bg-[#131b19] border border-tea-green/20 dark:border-[#3A5243] shadow-2xl flex items-center justify-center">
            {/* Используем векторную карту мира в качестве фона */}
            <div 
              className="absolute inset-0 opacity-30" 
              style={{
                backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'invert(1) sepia(1) hue-rotate(90deg) saturate(0.5)'
              }}
            />
            
            {/* Markers */}
            <div className="absolute top-[40%] left-[70%] group z-20">
              <div className="relative">
                <div className="w-5 h-5 bg-tea-gold rounded-full animate-ping absolute"></div>
                <div className="w-5 h-5 bg-tea-gold rounded-full relative z-10 flex items-center justify-center cursor-pointer shadow-[0_0_15px_rgba(212,175,55,0.8)] border-2 border-[#131b19]"></div>
              </div>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 bg-white dark:bg-[#23312B] text-tea-dark dark:text-tea-light p-4 rounded-xl shadow-2xl w-56 opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none transform translate-y-4 group-hover:translate-y-0">
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-[#23312B] rotate-45"></div>
                <h4 className="font-bold border-b border-gray-100 dark:border-[#3A5243] pb-2 mb-2 text-lg">Уишань, Китай</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Родина знаменитых улунов и Да Хун Пао. Скалистая местность придает чаю особый минеральный вкус.</p>
              </div>
            </div>

            <div className="absolute top-[42%] left-[82%] group z-20">
              <div className="relative">
                <div className="w-5 h-5 bg-tea-gold rounded-full animate-ping absolute" style={{ animationDelay: '0.5s' }}></div>
                <div className="w-5 h-5 bg-tea-gold rounded-full relative z-10 flex items-center justify-center cursor-pointer shadow-[0_0_15px_rgba(212,175,55,0.8)] border-2 border-[#131b19]"></div>
              </div>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 bg-white dark:bg-[#23312B] text-tea-dark dark:text-tea-light p-4 rounded-xl shadow-2xl w-56 opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none transform translate-y-4 group-hover:translate-y-0">
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-[#23312B] rotate-45"></div>
                <h4 className="font-bold border-b border-gray-100 dark:border-[#3A5243] pb-2 mb-2 text-lg">Удзи, Япония</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Древняя столица японского чая. Здесь мы закупаем церемониальную матчу высочайшего класса.</p>
              </div>
            </div>

            <div className="absolute top-[52%] left-[68%] group z-20">
              <div className="relative">
                <div className="w-5 h-5 bg-tea-gold rounded-full animate-ping absolute" style={{ animationDelay: '1s' }}></div>
                <div className="w-5 h-5 bg-tea-gold rounded-full relative z-10 flex items-center justify-center cursor-pointer shadow-[0_0_15px_rgba(212,175,55,0.8)] border-2 border-[#131b19]"></div>
              </div>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 bg-white dark:bg-[#23312B] text-tea-dark dark:text-tea-light p-4 rounded-xl shadow-2xl w-56 opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none transform translate-y-4 group-hover:translate-y-0">
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-[#23312B] rotate-45"></div>
                <h4 className="font-bold border-b border-gray-100 dark:border-[#3A5243] pb-2 mb-2 text-lg">Ассам, Индия</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Долина реки Брахмапутра. Отсюда к нам едет насыщенный черный чай с глубоким солодовым вкусом.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. Цифры и Факты (Инфографика) */}
      <section className="py-24 bg-tea-light dark:bg-[#1A2421]/10 relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-tea-dark dark:text-tea-light mb-4">FateLeaf в цифрах</h2>
            <div className="w-24 h-1 bg-tea-gold mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="text-5xl md:text-6xl font-bold text-tea-gold mb-4">
                <AnimatedNumber end={100} suffix="+" />
              </div>
              <h4 className="text-xl font-bold text-tea-dark dark:text-tea-light mb-2">сортов чая</h4>
              <p className="text-gray-500 dark:text-gray-400 text-sm">из разных уголков мира</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <div className="text-5xl md:text-6xl font-bold text-tea-gold mb-4">
                <AnimatedNumber end={15} suffix="+" />
              </div>
              <h4 className="text-xl font-bold text-tea-dark dark:text-tea-light mb-2">семейных плантаций</h4>
              <p className="text-gray-500 dark:text-gray-400 text-sm">в Китае, Японии и Индии</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <div className="text-5xl md:text-6xl font-bold text-tea-gold mb-4">
                <AnimatedNumber end={3} />
              </div>
              <h4 className="text-xl font-bold text-tea-dark dark:text-tea-light mb-2">этапа контроля</h4>
              <p className="text-gray-500 dark:text-gray-400 text-sm">строгой проверки качества</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
              <div className="text-5xl md:text-6xl font-bold text-tea-gold mb-4">
                <AnimatedNumber end={100} suffix="%" />
              </div>
              <h4 className="text-xl font-bold text-tea-dark dark:text-tea-light mb-2">натуральность</h4>
              <p className="text-gray-500 dark:text-gray-400 text-sm">без искусственных добавок</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 7. Социальное доказательство (Отзывы) */}
      <section className="py-24 bg-white dark:bg-[#23312B]">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-tea-dark dark:text-tea-light mb-4">Что говорят эксперты</h2>
            <div className="w-24 h-1 bg-tea-gold mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
            <div className="bg-gray-50 dark:bg-[#1A2421] p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-[#3A5243] relative mt-4 hover:shadow-lg dark:shadow-black/50 transition duration-300">
              <div className="absolute -top-6 left-8 bg-tea-gold w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg dark:shadow-black/50">
                <Quote size={24} fill="currentColor" />
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-8 mt-6 italic leading-relaxed">
                «Матча от FateLeaf — это лучшее, что я пробовал за последние годы. Идеальный изумрудный цвет, тонкий аромат и абсолютно никакой горечи. Гости нашего заведения в полном восторге.»
              </p>
              <div className="flex items-center">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop" alt="Алексей В." className="w-14 h-14 rounded-full object-cover mr-4" />
                <div>
                  <h5 className="font-bold text-tea-dark dark:text-tea-light text-lg">Алексей В.</h5>
                  <p className="text-sm text-tea-gold">Шеф-бариста ресторана</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-[#1A2421] p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-[#3A5243] relative mt-4 hover:shadow-lg dark:shadow-black/50 transition duration-300">
              <div className="absolute -top-6 left-8 bg-tea-gold w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg dark:shadow-black/50">
                <Quote size={24} fill="currentColor" />
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-8 mt-6 italic leading-relaxed">
                «Их Да Хун Пао просто сводит с ума. Глубокий, копченый, с богатыми нотками карамели. Сразу чувствуется, что это настоящий утесный чай премиум-класса с гор Уишань.»
              </p>
              <div className="flex items-center">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop" alt="Елена С." className="w-14 h-14 rounded-full object-cover mr-4" />
                <div>
                  <h5 className="font-bold text-tea-dark dark:text-tea-light text-lg">Елена С.</h5>
                  <p className="text-sm text-tea-gold">Чайный сомелье</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-[#1A2421] p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-[#3A5243] relative mt-4 hover:shadow-lg dark:shadow-black/50 transition duration-300">
              <div className="absolute -top-6 left-8 bg-tea-gold w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg dark:shadow-black/50">
                <Quote size={24} fill="currentColor" />
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-8 mt-6 italic leading-relaxed">
                «Попробовав Серебряные иглы от FateLeaf, я поняла, что такое эталонный белый чай. Очень деликатный и освежающий вкус. А упаковка — это отдельный вид визуального искусства!»
              </p>
              <div className="flex items-center">
                <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop" alt="Мария К." className="w-14 h-14 rounded-full object-cover mr-4" />
                <div>
                  <h5 className="font-bold text-tea-dark dark:text-tea-light text-lg">Мария К.</h5>
                  <p className="text-sm text-tea-gold">Food-блогер</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Блог / Чайная культура */}
      <section className="py-24 bg-tea-light dark:bg-[#1A2421]/10">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12">
            <div className="text-center md:text-left mb-6 md:mb-0">
              <h2 className="text-3xl font-bold text-tea-dark dark:text-tea-light mb-4">Углубитесь в чайную культуру</h2>
              <div className="w-24 h-1 bg-tea-gold rounded-full mx-auto md:mx-0"></div>
            </div>
            <Link to="/blog" className="hidden md:flex items-center text-tea-gold font-bold hover:text-yellow-600 transition text-lg">
              Читать наш блог <ArrowRight size={20} className="ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <div 
                key={post.id}
                onClick={() => {
                  setSelectedPost(post);
                  setBlogModalOpen(true);
                }}
                className="group bg-white dark:bg-[#23312B] rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-[#3A5243] flex flex-col"
              >
                <div className="relative aspect-[4/3] overflow-hidden shrink-0">
                  <img src={post.img} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                  <div className="absolute top-4 left-4 bg-white dark:bg-[#23312B]/90 backdrop-blur text-tea-dark dark:text-tea-light text-xs font-bold px-4 py-1.5 rounded-full">{post.tag}</div>
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <h4 className="text-xl font-bold text-tea-dark dark:text-tea-light mb-3 group-hover:text-tea-gold transition line-clamp-2">{post.title}</h4>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 line-clamp-2 flex-1">{post.shortDesc}</p>
                  <span className="text-tea-gold font-bold text-sm flex items-center group-hover:translate-x-2 transition-transform mt-auto">Читать далее <ChevronRight size={18} className="ml-1" /></span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-10 text-center md:hidden">
            <Link to="/blog" className="inline-flex items-center text-tea-gold font-bold hover:bg-tea-gold hover:text-white transition border-2 border-tea-gold px-8 py-4 rounded-full">
              Все статьи <ArrowRight size={20} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* 9. Призыв к действию (CTA) */}
      <section className="py-24 bg-tea-dark text-center">
        <div className="container mx-auto px-4">
          <Leaf className="mx-auto text-tea-gold mb-6" size={48} />
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">Готовы начать свое чайное путешествие?</h2>
          <Link 
            to="/catalog" 
            className="inline-flex items-center bg-tea-gold hover:bg-yellow-500 text-tea-dark dark:text-tea-light font-bold py-4 px-10 rounded-full transition transform hover:scale-105 shadow-xl dark:shadow-black/60 text-lg"
          >
            Перейти в каталог <ArrowRight className="ml-2" />
          </Link>
        </div>
      </section>
      
      {/* Story Modal (For Path of your tea clicks) */}
      <StoryModal isOpen={storyOpen} onClose={() => setStoryOpen(false)} initialSlide={storyInitialSlide} />
      
      {/* Blog Post Modal */}
      <BlogPostModal isOpen={blogModalOpen} onClose={() => setBlogModalOpen(false)} post={selectedPost} />
    </div>
  );
};

export default About;
