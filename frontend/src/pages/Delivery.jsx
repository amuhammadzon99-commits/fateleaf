import { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Truck, MapPin, Package, CreditCard, Banknote, Building2, HelpCircle, ArrowRight, Clock, ShieldAlert, Globe, MessageCircle, Coffee, Leaf, ChevronDown, X, Lock } from 'lucide-react';

const Delivery = () => {
  const { t } = useTranslation();
  const { items } = useSelector((state) => state.cart);
  const [selectedRegion, setSelectedRegion] = useState('samarkand');
  const [activeGalleryItem, setActiveGalleryItem] = useState(null);
  const progressRef = useRef(null);
  const isProgressInView = useInView(progressRef, { once: true, margin: "-50px" });

  const cartTotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const freeDeliveryThreshold = 300000;
  const remainingForFreeDelivery = freeDeliveryThreshold - cartTotal;
  const progressPercent = Math.min(100, (cartTotal / freeDeliveryThreshold) * 100);

  const regionData = {
    samarkand: { name: 'Самарканд', days: '1-2 дня', price: '30 000 сум', methods: ['Курьером Fargo до двери', 'До пункта выдачи BTS'] },
    bukhara: { name: 'Бухара', days: '2-3 дня', price: '35 000 сум', methods: ['Курьером Fargo до двери', 'До пункта выдачи BTS'] },
    andijan: { name: 'Андижан', days: '2-3 дня', price: '35 000 сум', methods: ['Курьером Fargo до двери', 'До пункта выдачи BTS'] },
    nukus: { name: 'Нукус', days: '3-4 дня', price: '45 000 сум', methods: ['Почта Узбекистана', 'До пункта выдачи BTS'] },
    other: { name: 'Другие регионы', days: '2-5 дней', price: 'от 25 000 сум', methods: ['Почта Узбекистана'] },
  };

  const currentRegion = regionData[selectedRegion];

  return (
    <div className="bg-white dark:bg-[#23312B]">
      {/* Hero Banner */}
      <section className="bg-tea-dark text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/magical_tea_banner.png')] bg-cover bg-center opacity-40" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-4 text-tea-gold"
          >
            {t('delivery.title')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-tea-light max-w-2xl mx-auto"
          >
            {t('delivery.subtitle')}
          </motion.p>
        </div>
      </section>

      {/* Free Delivery Informer */}
      <section className="bg-white dark:bg-[#23312B] border-b border-gray-100 dark:border-[#3A5243]">
        <div className="container mx-auto px-4 max-w-4xl py-6">
          <div className="bg-tea-light dark:bg-[#1A2421]/20 rounded-2xl p-6 border border-tea-green/30 dark:border-[#3A5243] shadow-sm text-center">
            {remainingForFreeDelivery > 0 ? (
              <>
                <h3 className="text-lg md:text-xl font-bold text-tea-dark dark:text-tea-light mb-3">
                  {cartTotal > 0 ? (
                    <>Добавьте товары еще на <span className="text-tea-gold">{remainingForFreeDelivery.toLocaleString()} сум</span> для бесплатной доставки!</>
                  ) : (
                    <>Добавьте в корзину товары на <span className="text-tea-gold">300 000 сум</span>, и мы доставим заказ бесплатно!</>
                  )}
                </h3>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2" ref={progressRef}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 1.0, ease: "easeOut" }}
                    className="bg-tea-gold h-3 rounded-full"
                  ></motion.div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Бесплатная доставка от 300 000 сум</p>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3">
                  <Package size={24} />
                </div>
                <h3 className="text-xl font-bold text-tea-dark dark:text-tea-light mb-1">
                  Ура! Доставка вашего заказа будет <span className="text-tea-gold">бесплатной</span>!
                </h3>
                <p className="text-gray-500 dark:text-gray-400">Ваша корзина превышает 300 000 сум.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. Пошаговая цепочка: «Как это работает» */}
      <section className="py-16 bg-tea-light dark:bg-[#1A2421]/30">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-tea-dark dark:text-tea-light mb-4">{t('delivery.howItWorks')}</h2>
            <div className="w-16 h-1 bg-tea-gold mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: <Package size={32} />, title: 'Шаг 1: Заказ', desc: 'Вы выбираете любимый чай и оформляете заказ на сайте.' },
              { icon: <MessageCircle size={32} />, title: 'Шаг 2: Подтверждение', desc: 'Наш менеджер связывается с вами в Telegram или по телефону.' },
              { icon: <Truck size={32} />, title: 'Шаг 3: Отправка', desc: 'Мы бережно упаковываем ваш заказ и передаем в доставку.' },
              { icon: <Coffee size={32} />, title: 'Шаг 4: Наслаждение', desc: 'Вы получаете посылку и наслаждаетесь вкусом FateLeaf!' },
            ].map((step, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative text-center"
              >
                <div className="w-20 h-20 mx-auto bg-tea-dark text-tea-gold rounded-full flex items-center justify-center mb-6 shadow-lg dark:shadow-black/50 relative z-10">
                  {step.icon}
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-full h-0.5 border-t-2 border-dashed border-tea-green/50 -z-0"></div>
                )}
                <h4 className="text-lg font-bold text-tea-dark dark:text-tea-light mb-2">{step.title}</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 1. Способы доставки и 2. Способы оплаты (Две колонки) */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-stretch">
            
            {/* Левая колонка - Доставка */}
            <div className="flex flex-col h-full">
              <div className="flex items-center space-x-3 mb-8">
                <Truck className="text-tea-gold" size={36} />
                <h2 className="text-3xl font-bold text-tea-dark dark:text-tea-light">{t('delivery.deliveryMethods')}</h2>
              </div>
              
              <div className="space-y-6 flex-1 flex flex-col">
                <div className="bg-white dark:bg-[#23312B] p-6 rounded-2xl border border-tea-green/20 dark:border-[#3A5243] shadow-sm hover:shadow-md dark:shadow-black/40 transition">
                  <h4 className="text-xl font-bold text-tea-dark dark:text-tea-light mb-2 flex items-center">
                    <Truck className="mr-2 text-tea-gold" size={20} />
                    Курьерская доставка (Ташкент)
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">Доставка курьером до вашей двери.</p>
                  <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
                    <li className="flex items-start"><Clock className="mr-2 text-tea-gold shrink-0 mt-0.5" size={16} /> <span><span className="font-semibold text-tea-dark dark:text-tea-light">Сроки:</span> При заказе до 14:00 доставим в тот же день, после 14:00 — на следующий.</span></li>
                    <li className="flex items-start"><Truck className="mr-2 text-tea-gold shrink-0 mt-0.5" size={16} /> <span><span className="font-semibold text-tea-dark dark:text-tea-light">Стоимость:</span> 25 000 сум (бесплатно при заказе от 300 000 сум).</span></li>
                    <li className="flex items-start"><Package className="mr-2 text-tea-gold shrink-0 mt-0.5" size={16} /> <span><span className="font-semibold text-tea-dark dark:text-tea-light">Экспресс-доставка:</span> За 1–2 часа через Яндекс.Доставку (в среднем от 15 000 до 35 000 сум в зависимости от расстояния).</span></li>
                  </ul>
                </div>

                <div className="bg-white dark:bg-[#23312B] p-6 rounded-2xl border border-tea-green/20 dark:border-[#3A5243] shadow-sm hover:shadow-md dark:shadow-black/40 transition">
                  <h4 className="text-xl font-bold text-tea-dark dark:text-tea-light mb-4 flex items-center">
                    <MapPin className="mr-2 text-tea-gold" size={20} />
                    Доставка по Узбекистану
                  </h4>
                  <div className="mb-4 relative">
                    <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Выберите ваш регион/город:</label>
                    <div className="relative">
                      <select 
                        value={selectedRegion}
                        onChange={(e) => setSelectedRegion(e.target.value)}
                        className="w-full appearance-none bg-gray-50 dark:bg-[#1A2421] border border-gray-200 dark:border-[#3A5243] text-tea-dark dark:text-tea-light rounded-lg pl-4 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-tea-gold/50 cursor-pointer"
                      >
                        {Object.entries(regionData).map(([key, data]) => (
                          <option key={key} value={key}>{data.name}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-400">
                        <ChevronDown size={16} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-tea-light dark:bg-[#1A2421]/20 rounded-xl p-4 flex justify-between items-center mb-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Срок доставки</p>
                      <p className="font-bold text-tea-dark dark:text-tea-light">{currentRegion.days}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Стоимость</p>
                      <p className="font-bold text-tea-gold">{currentRegion.price}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Доступные способы для региона:</p>
                    <div className="flex flex-wrap gap-2">
                      {currentRegion.methods.map((m, i) => (
                        <span key={i} className="bg-gray-100 text-tea-dark dark:text-tea-light text-xs px-2.5 py-1.5 rounded-md font-bold border border-gray-200 dark:border-[#3A5243]">{m}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-4 flex gap-2">
                    <div className="font-bold text-yellow-500 bg-gray-900 px-3 py-1 rounded text-xs tracking-wider border border-gray-800 shadow-sm">BTS</div>
                    <div className="font-bold text-white bg-blue-600 px-3 py-1 rounded text-xs tracking-wider border border-blue-700 shadow-sm">FARGO</div>
                  </div>
                  <p className="text-xs text-gray-400 mt-3">
                    Доставка осуществляется курьерскими службами BTS, Fargo или Почтой Узбекистана. Доступна доставка до двери или до ближайшего склада.
                  </p>
                </div>

                <div className="bg-white dark:bg-[#23312B] p-6 rounded-2xl border border-tea-green/20 dark:border-[#3A5243] shadow-sm hover:shadow-md dark:shadow-black/40 transition">
                  <h4 className="text-xl font-bold text-tea-dark dark:text-tea-light mb-2 flex items-center">
                    <Building2 className="mr-2 text-tea-gold" size={20} />
                    Самовывоз (Бесплатно)
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">Заберите заказ из нашего шоурума.</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold text-tea-dark dark:text-tea-light">Адрес:</span> г. Ташкент, ул. Амира Темура, 107<br/>
                    <span className="font-semibold text-tea-dark dark:text-tea-light">График:</span> Пн–Сб с 10:00 до 20:00
                  </p>
                  <div className="mt-4 p-3 bg-tea-light dark:bg-[#1A2421]/30 rounded-lg border border-tea-green/30 dark:border-[#3A5243] text-sm">
                    <p className="text-gray-600 dark:text-gray-400 mb-2 text-xs">Пожалуйста, предупредите о визите, чтобы мы успели собрать заказ:</p>
                    <div className="flex flex-col gap-1">
                      <a href="tel:+998901234567" className="text-tea-dark dark:text-tea-light font-bold hover:text-tea-gold transition flex items-center"><MessageCircle size={14} className="mr-2 text-tea-gold"/> +998 90 123-45-67</a>
                      <a href="https://t.me/fateleaf_support_bot" target="_blank" rel="noreferrer" className="text-[#2AABEE] font-bold hover:text-[#229ED9] transition flex items-center"><MessageCircle size={14} className="mr-2 text-[#2AABEE]"/> @fateleaf_support_bot</a>
                    </div>
                  </div>
                </div>
                
                {/* 3. Международная доставка */}
                <div className="bg-tea-dark text-white p-6 rounded-2xl shadow-sm">
                  <h4 className="text-lg font-bold text-tea-gold mb-2 flex items-center">
                    <Globe className="mr-2" size={20} />
                    Международная доставка
                  </h4>
                  <p className="text-sm text-tea-light">
                    Доставка в страны СНГ и дальнее зарубежье осуществляется службами EMS / DHL. Расчет стоимости производится менеджером индивидуально после оформления заказа.
                  </p>
                </div>
              </div>
            </div>

            {/* Правая колонка - Оплата */}
            <div className="flex flex-col h-full">
              <div className="flex items-center space-x-3 mb-8">
                <CreditCard className="text-tea-gold" size={36} />
                <h2 className="text-3xl font-bold text-tea-dark dark:text-tea-light">{t('delivery.paymentMethods')}</h2>
              </div>
              
              <div className="space-y-6 flex-1 flex flex-col">
                <div className="bg-white dark:bg-[#23312B] p-6 rounded-2xl border border-tea-green/20 dark:border-[#3A5243] shadow-sm hover:shadow-md dark:shadow-black/40 transition flex-1 flex flex-col">
                  <h4 className="text-xl font-bold text-tea-dark dark:text-tea-light mb-2 flex items-center">
                    <CreditCard className="mr-2 text-tea-gold" size={20} />
                    Онлайн-оплата на сайте
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Быстрая и безопасная оплата банковскими картами через популярные платежные системы.</p>
                  <div className="flex flex-wrap gap-3 items-center mt-6">
                    <div className="font-bold text-white bg-[#33CCCC] px-3 py-1.5 rounded-lg text-sm shadow-sm flex items-center tracking-wide">Payme</div>
                    <div className="font-bold text-white bg-[#00AEEF] px-3 py-1.5 rounded-lg text-sm shadow-sm flex items-center tracking-wide">CLICK</div>
                    <div className="font-bold text-white bg-[#003B73] px-3 py-1.5 rounded-lg text-sm shadow-sm flex items-center tracking-wide">UZCARD</div>
                    <div className="font-bold text-white bg-[#F39C12] px-3 py-1.5 rounded-lg text-sm shadow-sm flex items-center tracking-wide">HUMO</div>
                    
                    <div className="font-bold text-purple-700 bg-purple-50 px-3 py-1.5 rounded-lg text-sm border border-purple-100 shadow-sm flex items-center">
                      Uzum Pay
                    </div>
                    
                    <div className="font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg text-sm border border-red-100 shadow-sm flex items-center">
                      Anorbank
                    </div>

                    <div className="flex space-x-2 items-center bg-gray-50 dark:bg-[#1A2421] px-2 py-1.5 rounded-lg border border-gray-200 dark:border-[#3A5243] font-bold text-blue-900 text-sm">
                      VISA <span className="text-gray-300 mx-1">|</span> <span className="text-red-500">Master</span><span className="text-orange-500">card</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-[#23312B] p-6 rounded-2xl border border-tea-green/20 dark:border-[#3A5243] shadow-sm hover:shadow-md dark:shadow-black/40 transition flex-1 flex flex-col">
                  <h4 className="text-xl font-bold text-tea-dark dark:text-tea-light mb-2 flex items-center">
                    <Banknote className="mr-2 text-tea-gold" size={20} />
                    Оплата при получении
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">Оплата наличными или картой (через терминал) курьеру при вручении заказа. Доступно только для доставки по Ташкенту.</p>
                </div>

                <div className="bg-white dark:bg-[#23312B] p-6 rounded-2xl border border-tea-green/20 dark:border-[#3A5243] shadow-sm hover:shadow-md dark:shadow-black/40 transition flex-1 flex flex-col">
                  <h4 className="text-xl font-bold text-tea-dark dark:text-tea-light mb-2 flex items-center">
                    <Building2 className="mr-2 text-tea-gold" size={20} />
                    Для юридических лиц
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">Безналичный расчет по договору (оплата на расчетный счет). Мы предоставляем все закрывающие документы.</p>
                </div>
                
                {/* Безопасность платежей */}
                <div className="mt-auto pt-6 flex items-start space-x-3 text-gray-500 dark:text-gray-400">
                  <Lock size={20} className="text-tea-gold shrink-0 mt-0.5" />
                  <p className="text-sm">
                    Все транзакции защищены сквозным шифрованием SSL. Мы не сохраняем данные ваших банковских карт.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Как мы упаковываем (Галерея) */}
      <section className="py-20 bg-tea-light dark:bg-[#1A2421]/10">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-tea-dark dark:text-tea-light mb-4">{t('delivery.packaging')}</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">Мы заботимся о том, чтобы каждый чайный лист и хрупкая пиала доехали до вас в идеальном состоянии.</p>
            <div className="w-16 h-1 bg-tea-gold mx-auto rounded-full mt-6"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Эко-упаковка чая',
                img: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=1000&auto=format&fit=crop',
                text: 'Наш чай фасуется в плотные многослойные крафт-пакеты с зип-локом. Внутри каждого пакета есть специальный металлизированный слой, который полностью блокирует солнечные лучи, влагу и посторонние запахи. Это гарантирует, что эфирные масла и тонкий аромат чая сохранятся в первозданном виде вплоть до момента, когда вы откроете упаковку дома.'
              },
              {
                title: 'Надежная защита посуды',
                img: 'https://images.pexels.com/photos/227908/pexels-photo-227908.jpeg?auto=compress&cs=tinysrgb&w=1000',
                text: 'Доставка хрупкой керамики и фарфора требует особой осторожности. Каждую гайвань, пиалу или чайник мы оборачиваем в 3-4 слоя плотной воздушно-пузырьковой пленки. Пустоты в транспортировочной коробке заполняются экологичным бумажным наполнителем, чтобы посуда не двигалась во время перевозки.'
              },
              {
                title: 'Премиальный вид',
                img: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1000&auto=format&fit=crop',
                text: 'Мы хотим, чтобы распаковка заказа от FateLeaf была для вас маленьким праздником. Заказы бережно укладываются в плотные картонные коробки с минималистичным дизайном, обвязываются джутовой нитью и запечатываются фирменным стикером. Отличный вариант, даже если вы заказываете чай в подарок!'
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setActiveGalleryItem(item)}
                className="relative group rounded-2xl overflow-hidden shadow-md dark:shadow-black/40 aspect-[4/3] cursor-pointer"
              >
                <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                  <h4 className="text-white font-bold text-xl group-hover:text-tea-gold transition-colors">{item.title}</h4>
                  <p className="text-tea-light/80 text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                    Нажмите, чтобы узнать подробнее →
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Модальное окно для галереи */}
      <AnimatePresence>
        {activeGalleryItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setActiveGalleryItem(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white dark:bg-[#23312B] rounded-3xl overflow-hidden max-w-2xl w-full shadow-2xl z-10 flex flex-col md:flex-row"
            >
              <button 
                onClick={() => setActiveGalleryItem(null)}
                className="absolute top-4 right-4 z-20 w-8 h-8 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center transition"
              >
                <X size={18} />
              </button>
              <div className="w-full md:w-1/2 h-64 md:h-auto relative">
                <img src={activeGalleryItem.img} alt={activeGalleryItem.title} className="w-full h-full object-cover" />
              </div>
              <div className="w-full md:w-1/2 p-8 flex flex-col justify-center bg-tea-light dark:bg-[#1A2421]/10">
                <h3 className="text-2xl font-bold text-tea-dark dark:text-tea-light mb-4">{activeGalleryItem.title}</h3>
                <div className="w-12 h-1 bg-tea-gold mb-6 rounded-full"></div>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                  {activeGalleryItem.text}
                </p>
                <button 
                  onClick={() => setActiveGalleryItem(null)}
                  className="mt-8 text-tea-gold font-bold hover:text-yellow-600 transition flex items-center"
                >
                  Понятно <ArrowRight size={16} className="ml-2" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Условия возврата и обмена & FAQ */}
      <section className="py-20 bg-gray-50 dark:bg-[#1A2421]">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* FAQ */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <HelpCircle className="text-tea-gold" size={28} />
                <h3 className="text-2xl font-bold text-tea-dark dark:text-tea-light">{t('delivery.faq')}</h3>
              </div>
              <div className="space-y-6">
                <div>
                  <h5 className="font-bold text-tea-dark dark:text-tea-light mb-2">Как отследить заказ?</h5>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">После отправки посылки мы вышлем вам трек-номер в СМС или Telegram для отслеживания перемещения в реальном времени.</p>
                </div>
                <div>
                  <h5 className="font-bold text-tea-dark dark:text-tea-light mb-2">Что делать, если товар повредился?</h5>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Мы надежно упаковываем каждую пачку чая и хрупкую посуду в пузырчатую пленку. Если при получении вы заметили повреждения, свяжитесь с нами, и мы бесплатно заменим товар.</p>
                </div>
              </div>
            </div>

            {/* Возврат */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <ShieldAlert className="text-tea-gold" size={28} />
                <h3 className="text-2xl font-bold text-tea-dark dark:text-tea-light">{t('delivery.returns')}</h3>
              </div>
              <div className="space-y-6">
                <div className="bg-white dark:bg-[#23312B] p-5 rounded-xl border border-red-100 shadow-sm">
                  <h5 className="font-bold text-tea-dark dark:text-tea-light mb-2 flex items-center">
                    <Leaf className="mr-2 text-tea-gold" size={16} /> Чайная продукция
                  </h5>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Согласно законодательству, продовольственные товары (чай) надлежащего качества обмену и возврату не подлежат. Однако, если у вас возникли претензии к качеству упаковки или содержимого — обязательно напишите нам, и мы решим проблему.</p>
                </div>
                <div className="bg-white dark:bg-[#23312B] p-5 rounded-xl border border-gray-200 dark:border-[#3A5243] shadow-sm">
                  <h5 className="font-bold text-tea-dark dark:text-tea-light mb-2 flex items-center">
                    <Coffee className="mr-2 text-tea-dark dark:text-tea-light" size={16} /> Посуда и аксессуары
                    <Coffee className="mr-2 text-tea-dark dark:text-tea-light" size={16} /> {t('delivery.dishes')}
                  </h5>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{t('delivery.dishesDesc')}</p>
                </div>
                
                {/* Памятка по проверке */}
                <div className="bg-yellow-50 p-5 rounded-xl border border-yellow-200 shadow-sm mt-6">
                  <h5 className="font-bold text-yellow-800 mb-2 flex items-center">
                    <Package className="mr-2 text-yellow-600" size={16} /> {t('delivery.checkOrderTitle')}
                  </h5>
                  <p className="text-yellow-700 text-sm leading-relaxed">
                    <strong>{t('delivery.important')}:</strong> {t('delivery.checkOrderDesc')}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Интерактивная карта */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="rounded-2xl overflow-hidden shadow-lg dark:shadow-black/50 h-[400px] relative bg-gray-200 mb-6 border border-gray-200 dark:border-[#3A5243]">
            <iframe 
              src="https://yandex.ru/map-widget/v1/?ll=69.282928%2C41.332314&z=16&pt=69.282928,41.332314,pm2rdm" 
              width="100%" 
              height="100%" 
              frameBorder="0"
              title="FateLeaf Showroom Yandex"
            ></iframe>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="https://yandex.ru/maps/?pt=69.282928,41.332314,pm2rdm&z=16"
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center justify-center bg-white dark:bg-[#23312B] hover:bg-gray-50 dark:bg-[#1A2421] border border-gray-200 dark:border-[#3A5243] text-tea-dark dark:text-tea-light font-bold py-3 px-6 rounded-xl transition shadow-sm"
            >
              <div className="w-6 h-6 mr-3 rounded-full bg-red-500 text-white flex items-center justify-center text-[11px] font-bold shadow-inner">Я</div>
              Открыть в Яндекс Навигаторе
            </a>
            <a 
              href="https://www.google.com/maps/search/?api=1&query=41.332314,69.282928"
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center justify-center bg-white dark:bg-[#23312B] hover:bg-gray-50 dark:bg-[#1A2421] border border-gray-200 dark:border-[#3A5243] text-tea-dark dark:text-tea-light font-bold py-3 px-6 rounded-xl transition shadow-sm"
            >
              <div className="w-6 h-6 mr-3 rounded-full bg-blue-500 text-white flex items-center justify-center text-[11px] font-bold shadow-inner">G</div>
              Открыть в Google Maps
            </a>
          </div>
        </div>
      </section>

      {/* 5. Блок «Остались вопросы?» (CTA) */}
      <section className="py-20 bg-tea-dark text-center px-4">
        <div className="max-w-2xl mx-auto text-white">
          <MessageCircle className="mx-auto text-tea-gold mb-4" size={40} />
          <h2 className="text-2xl md:text-3xl font-bold mb-4">{t('delivery.anyQuestions')}</h2>
          <p className="text-tea-light mb-8">
            Не нашли удобный способ доставки или оплаты? Напишите нам в Telegram, и мы подберем персональное решение!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="https://t.me/fateleaf_support_bot" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center justify-center bg-[#2AABEE] hover:bg-[#229ED9] text-white font-bold py-3 px-8 rounded-full transition shadow-lg dark:shadow-black/50"
            >
              Написать в Telegram
            </a>
            <Link 
              to="/catalog" 
              className="group inline-flex items-center justify-center bg-tea-gold hover:bg-yellow-500 text-white font-bold py-3 px-8 rounded-full transition shadow-lg dark:shadow-black/50"
            >
              Перейти в каталог <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Delivery;
