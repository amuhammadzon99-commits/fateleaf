const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend', 'src', 'pages', 'Delivery.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Progress Bar Dynamic Logic & Text
content = content.replace(
  `const regionData = {
    samarkand: { name: 'Самарканд', days: '1-2 дня', price: '30 000 сум' },
    bukhara: { name: 'Бухара', days: '2-3 дня', price: '35 000 сум' },
    andijan: { name: 'Андижан', days: '2-3 дня', price: '35 000 сум' },
    nukus: { name: 'Нукус', days: '3-4 дня', price: '45 000 сум' },
    other: { name: 'Другие регионы', days: '2-5 дней', price: 'от 25 000 сум' },
  };`,
  `const regionData = {
    samarkand: { name: 'Самарканд', days: '1-2 дня', price: '30 000 сум', methods: ['Курьером Fargo до двери', 'До пункта выдачи BTS'] },
    bukhara: { name: 'Бухара', days: '2-3 дня', price: '35 000 сум', methods: ['Курьером Fargo до двери', 'До пункта выдачи BTS'] },
    andijan: { name: 'Андижан', days: '2-3 дня', price: '35 000 сум', methods: ['Курьером Fargo до двери', 'До пункта выдачи BTS'] },
    nukus: { name: 'Нукус', days: '3-4 дня', price: '45 000 сум', methods: ['Почта Узбекистана', 'До пункта выдачи BTS'] },
    other: { name: 'Другие регионы', days: '2-5 дней', price: 'от 25 000 сум', methods: ['Почта Узбекистана'] },
  };`
);

content = content.replace(
  `                <h3 className="text-lg md:text-xl font-bold text-tea-dark mb-3">
                  Добавьте в корзину товары еще на <span className="text-tea-gold">{remainingForFreeDelivery.toLocaleString()} сум</span>, и мы доставим ваш заказ бесплатно!
                </h3>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2" ref={progressRef}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: isProgressInView ? \`\${progressPercent}%\` : 0 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="bg-tea-gold h-3 rounded-full"
                  ></motion.div>
                </div>`,
  `                <h3 className="text-lg md:text-xl font-bold text-tea-dark mb-3">
                  {cartTotal > 0 ? (
                    <>Добавьте товары еще на <span className="text-tea-gold">{remainingForFreeDelivery.toLocaleString()} сум</span> для бесплатной доставки!</>
                  ) : (
                    <>Добавьте в корзину товары на <span className="text-tea-gold">300 000 сум</span>, и мы доставим заказ бесплатно!</>
                  )}
                </h3>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2" ref={progressRef}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: \`\${progressPercent}%\` }}
                    transition={{ duration: 1.0, ease: "easeOut" }}
                    className="bg-tea-gold h-3 rounded-full"
                  ></motion.div>
                </div>`
);

// 2. City region dynamic display
content = content.replace(
  `                  <div className="bg-tea-light/20 rounded-xl p-4 flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Срок доставки</p>
                      <p className="font-bold text-tea-dark">{currentRegion.days}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Стоимость</p>
                      <p className="font-bold text-tea-gold">{currentRegion.price}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex gap-3 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition duration-300">
                    <img src="https://logobank.uz:8005/media/logos_png/BTS-01.png" alt="BTS" className="h-6 object-contain" />
                    <img src="https://logobank.uz:8005/media/logos_png/Fargo-01.png" alt="Fargo" className="h-6 object-contain" />
                  </div>`,
  `                  <div className="bg-tea-light/20 rounded-xl p-4 flex justify-between items-center mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Срок доставки</p>
                      <p className="font-bold text-tea-dark">{currentRegion.days}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Стоимость</p>
                      <p className="font-bold text-tea-gold">{currentRegion.price}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-2">Доступные способы для региона:</p>
                    <div className="flex flex-wrap gap-2">
                      {currentRegion.methods.map((m, i) => (
                        <span key={i} className="bg-gray-100 text-tea-dark text-xs px-2.5 py-1.5 rounded-md font-bold border border-gray-200">{m}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-4 flex gap-2">
                    <div className="font-bold text-yellow-500 bg-gray-900 px-3 py-1 rounded text-xs tracking-wider border border-gray-800 shadow-sm">BTS</div>
                    <div className="font-bold text-white bg-blue-600 px-3 py-1 rounded text-xs tracking-wider border border-blue-700 shadow-sm">FARGO</div>
                  </div>`
);

// 3. Yandex Copywriting
content = content.replace(
  `<li className="flex items-start"><Package className="mr-2 text-tea-gold shrink-0 mt-0.5" size={16} /> <span><span className="font-semibold text-tea-dark">Экспресс-доставка:</span> За 1–2 часа через Яндекс.Доставку (по тарифам сервиса, оплачивается клиентом).</span></li>`,
  `<li className="flex items-start"><Package className="mr-2 text-tea-gold shrink-0 mt-0.5" size={16} /> <span><span className="font-semibold text-tea-dark">Экспресс-доставка:</span> За 1–2 часа через Яндекс.Доставку (в среднем от 15 000 до 35 000 сум в зависимости от расстояния).</span></li>`
);

// 4. Pickup Contacts
content = content.replace(
  `                    <span className="font-semibold text-tea-dark">График:</span> Пн–Сб с 10:00 до 20:00
                  </p>
                </div>`,
  `                    <span className="font-semibold text-tea-dark">График:</span> Пн–Сб с 10:00 до 20:00
                  </p>
                  <div className="mt-4 p-3 bg-tea-light/30 rounded-lg border border-tea-green/30 text-sm">
                    <p className="text-gray-600 mb-2 text-xs">Пожалуйста, предупредите о визите, чтобы мы успели собрать заказ:</p>
                    <div className="flex flex-col gap-1">
                      <a href="tel:+998901234567" className="text-tea-dark font-bold hover:text-tea-gold transition flex items-center"><MessageCircle size={14} className="mr-2 text-tea-gold"/> +998 90 123-45-67</a>
                      <a href="https://t.me/fateleaf_support" target="_blank" rel="noreferrer" className="text-[#2AABEE] font-bold hover:text-[#229ED9] transition flex items-center"><MessageCircle size={14} className="mr-2 text-[#2AABEE]"/> @fateleaf_support</a>
                    </div>
                  </div>
                </div>`
);

// 5. Payment icons + Make Payment blocks equal flex-1
content = content.replace(
  `                  <div className="flex flex-wrap gap-4 items-center mt-6">
                    <img src="https://logobank.uz:8005/media/logos_png/Payme-01.png" alt="Payme" className="h-8 object-contain" />
                    <img src="https://logobank.uz:8005/media/logos_png/Click-01.png" alt="Click" className="h-8 object-contain" />
                    <img src="https://logobank.uz:8005/media/logos_png/Uzcard-01.png" alt="Uzcard" className="h-8 object-contain" />
                    <img src="https://logobank.uz:8005/media/logos_png/Humo-01.png" alt="Humo" className="h-8 object-contain" />
                    
                    <div className="font-bold text-purple-700 bg-purple-50 px-3 py-1.5 rounded-lg text-sm border border-purple-100 shadow-sm flex items-center">
                      Uzum Pay
                    </div>
                    
                    <div className="font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg text-sm border border-red-100 shadow-sm flex items-center">
                      Anorbank
                    </div>

                    <div className="flex space-x-2 items-center bg-gray-50 px-2 py-1 rounded border border-gray-200">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" className="h-4 object-contain" />
                      <span className="text-gray-300">|</span>
                      <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-5 object-contain" />
                    </div>
                  </div>`,
  `                  <div className="flex flex-wrap gap-3 items-center mt-6">
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

                    <div className="flex space-x-2 items-center bg-gray-50 px-2 py-1.5 rounded-lg border border-gray-200 font-bold text-blue-900 text-sm">
                      VISA <span className="text-gray-300 mx-1">|</span> <span className="text-red-500">Master</span><span className="text-orange-500">card</span>
                    </div>
                  </div>`
);

content = content.replace(
  `                <div className="bg-white p-6 rounded-2xl border border-tea-green/20 shadow-sm hover:shadow-md transition">
                  <h4 className="text-xl font-bold text-tea-dark mb-2 flex items-center">
                    <CreditCard className="mr-2 text-tea-gold" size={20} />
                    Онлайн-оплата на сайте
                  </h4>`,
  `                <div className="bg-white p-6 rounded-2xl border border-tea-green/20 shadow-sm hover:shadow-md transition flex-1 flex flex-col">
                  <h4 className="text-xl font-bold text-tea-dark mb-2 flex items-center">
                    <CreditCard className="mr-2 text-tea-gold" size={20} />
                    Онлайн-оплата на сайте
                  </h4>`
);

content = content.replace(
  `                <div className="bg-white p-6 rounded-2xl border border-tea-green/20 shadow-sm hover:shadow-md transition">
                  <h4 className="text-xl font-bold text-tea-dark mb-2 flex items-center">
                    <Banknote className="mr-2 text-tea-gold" size={20} />
                    Оплата при получении
                  </h4>`,
  `                <div className="bg-white p-6 rounded-2xl border border-tea-green/20 shadow-sm hover:shadow-md transition flex-1 flex flex-col">
                  <h4 className="text-xl font-bold text-tea-dark mb-2 flex items-center">
                    <Banknote className="mr-2 text-tea-gold" size={20} />
                    Оплата при получении
                  </h4>`
);

content = content.replace(
  `                <div className="bg-white p-6 rounded-2xl border border-tea-green/20 shadow-sm hover:shadow-md transition">
                  <h4 className="text-xl font-bold text-tea-dark mb-2 flex items-center">
                    <Building2 className="mr-2 text-tea-gold" size={20} />
                    Для юридических лиц
                  </h4>`,
  `                <div className="bg-white p-6 rounded-2xl border border-tea-green/20 shadow-sm hover:shadow-md transition flex-1 flex flex-col">
                  <h4 className="text-xl font-bold text-tea-dark mb-2 flex items-center">
                    <Building2 className="mr-2 text-tea-gold" size={20} />
                    Для юридических лиц
                  </h4>`
);

// 6. Map pin and broken map icons
content = content.replace(
  `              src="https://yandex.ru/map-widget/v1/?ll=69.282928%2C41.332314&z=16&text=Ташкент%2C%20улица%20Амира%20Темура%2C%20107"`,
  `              src="https://yandex.ru/map-widget/v1/?ll=69.282928%2C41.332314&z=16&pt=69.282928,41.332314,pm2rdm"`
);

content = content.replace(
  `              href="https://yandex.ru/maps/?text=Ташкент,+улица+Амира+Темура,+107"
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center justify-center bg-white hover:bg-gray-50 border border-gray-200 text-tea-dark font-bold py-3 px-6 rounded-xl transition shadow-sm"
            >
              <img src="https://yastatic.net/s3/front-maps-static/maps-front-maps/build/client/images/favicon/apple-touch-icon.png" className="w-5 h-5 mr-2" alt="Yandex" />
              Открыть в Яндекс Навигаторе`,
  `              href="https://yandex.ru/maps/?pt=69.282928,41.332314,pm2rdm&z=16"
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center justify-center bg-white hover:bg-gray-50 border border-gray-200 text-tea-dark font-bold py-3 px-6 rounded-xl transition shadow-sm"
            >
              <div className="w-6 h-6 mr-3 rounded-full bg-red-500 text-white flex items-center justify-center text-[11px] font-bold shadow-inner">Я</div>
              Открыть в Яндекс Навигаторе`
);

content = content.replace(
  `              href="https://www.google.com/maps/search/?api=1&query=Ташкент,+улица+Амира+Темура,+107"
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center justify-center bg-white hover:bg-gray-50 border border-gray-200 text-tea-dark font-bold py-3 px-6 rounded-xl transition shadow-sm"
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Google_Maps_icon.svg" className="w-5 h-5 mr-2" alt="Google Maps" />
              Открыть в Google Maps`,
  `              href="https://www.google.com/maps/search/?api=1&query=41.332314,69.282928"
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center justify-center bg-white hover:bg-gray-50 border border-gray-200 text-tea-dark font-bold py-3 px-6 rounded-xl transition shadow-sm"
            >
              <div className="w-6 h-6 mr-3 rounded-full bg-blue-500 text-white flex items-center justify-center text-[11px] font-bold shadow-inner">G</div>
              Открыть в Google Maps`
);

// 7. Arrow animation in footer
content = content.replace(
  `            <Link 
              to="/catalog" 
              className="inline-flex items-center justify-center bg-tea-gold hover:bg-yellow-500 text-white font-bold py-3 px-8 rounded-full transition shadow-lg"
            >
              Перейти в каталог <ArrowRight className="ml-2" size={18} />
            </Link>`,
  `            <Link 
              to="/catalog" 
              className="group inline-flex items-center justify-center bg-tea-gold hover:bg-yellow-500 text-white font-bold py-3 px-8 rounded-full transition shadow-lg"
            >
              Перейти в каталог <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
            </Link>`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Delivery.jsx successfully updated');
