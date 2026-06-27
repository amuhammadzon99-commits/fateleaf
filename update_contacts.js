const fs = require('fs');
const path = require('path');

const contactsPath = path.join(__dirname, 'frontend', 'src', 'pages', 'Contacts.jsx');
let content = fs.readFileSync(contactsPath, 'utf8');

// 1. Height alignment
content = content.replace(
  'className="grid grid-cols-1 lg:grid-cols-2 gap-8"',
  'className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch"'
);
content = content.replace(
  'className="bg-white rounded-3xl p-8 md:p-10 shadow-lg border border-gray-100 flex flex-col justify-between"',
  'className="bg-white rounded-3xl p-8 md:p-10 shadow-lg border border-gray-100 flex flex-col justify-between h-full"'
);
content = content.replace(
  'className="bg-white rounded-3xl p-8 md:p-10 shadow-lg border border-gray-100 min-h-[500px] flex flex-col justify-center relative overflow-hidden"',
  'className="bg-white rounded-3xl p-8 md:p-10 shadow-lg border border-gray-100 h-full flex flex-col justify-center relative overflow-hidden"'
);

// 2. Telegram button styling
content = content.replace(
  'className="w-full bg-[#0088cc] hover:bg-[#0077b5] text-white font-bold py-4 rounded-2xl flex items-center justify-center transition shadow-md hover:shadow-lg transform hover:-translate-y-1 mb-8"',
  'className="w-full bg-white hover:bg-tea-dark border-2 border-tea-dark text-tea-dark hover:text-tea-gold font-bold py-3.5 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-1 mb-8"'
);

// 3. Active badge styling
content = content.replace(
  `                                  ? 'bg-tea-dark text-white border-tea-dark shadow-sm'`,
  `                                  ? 'bg-tea-gold/20 border-tea-gold text-tea-dark shadow-sm'`
);

// 4. Map deep-links & Coordinates update (updating to 41.332314,69.282928)
content = content.replace(
  'src="https://yandex.ru/map-widget/v1/?ll=69.279737%2C41.311151&z=14"',
  'src="https://yandex.ru/map-widget/v1/?ll=69.282928%2C41.332314&z=16&pt=69.282928,41.332314,pm2rdm"'
);
content = content.replace(
  'href="https://yandex.ru/maps/?rtext=~41.311151%2C69.279737"',
  'href="https://yandex.ru/maps/?rtext=~41.332314,69.282928"'
);
content = content.replace(
  'href="https://www.google.com/maps/dir/?api=1&destination=41.311151,69.279737"',
  'href="https://www.google.com/maps/dir/?api=1&destination=41.332314,69.282928"'
);

// 5. Slider arrows contrast
content = content.replaceAll(
  'className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-md text-white flex items-center justify-center transition active:scale-90 z-20"',
  'className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/30 hover:bg-tea-dark hover:text-tea-gold border border-white/50 backdrop-blur-md text-white flex items-center justify-center transition-all duration-300 shadow-md active:scale-90 z-20"'
);
content = content.replaceAll(
  'className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-md text-white flex items-center justify-center transition active:scale-90 z-20"',
  'className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/30 hover:bg-tea-dark hover:text-tea-gold border border-white/50 backdrop-blur-md text-white flex items-center justify-center transition-all duration-300 shadow-md active:scale-90 z-20"'
);

fs.writeFileSync(contactsPath, content, 'utf8');
console.log('Contacts.jsx successfully updated');

// Update translations
const locales = ['ru', 'en', 'uz'];
const faqs = {
  ru: {
    faq_q3: "Как оформить возврат или обмен?",
    faq_a3: "Вы можете оформить возврат или обмен товара в течение 14 дней с момента покупки при условии сохранения товарного вида и чека. Напишите нам в форму обратной связи или в Telegram.",
    faq_q2: "Можно ли забрать заказ самовывозом из шоурума?",
    faq_a2: "Да, конечно! Наш шоурум работает с понедельника по субботу с 10:00 до 20:00. Пожалуйста, предупредите нас заранее, чтобы мы успели собрать ваш заказ."
  },
  en: {
    faq_q3: "How to return or exchange an item?",
    faq_a3: "You can return or exchange goods within 14 days of purchase, provided the original packaging and receipt are preserved. Please contact us via the feedback form or Telegram.",
    faq_q2: "Can I pick up my order from the showroom?",
    faq_a2: "Yes, of course! Our showroom is open Monday to Saturday from 10:00 to 20:00. Please let us know in advance so we can prepare your order."
  },
  uz: {
    faq_q3: "Mahsulotni qaytarish yoki almashtirish qanday amalga oshiriladi?",
    faq_a3: "Xarid qilingan kundan boshlab 14 kun ichida mahsulot ko'rinishi va chek saqlangan holda uni qaytarishingiz yoki almashtirishingiz mumkin. Bizga Telegram orqali yozing.",
    faq_q2: "Buyurtmani shourumdan o'zim olib ketsam bo'ladimi?",
    faq_a2: "Ha, albatta! Shourumimiz dushanbadan shanbagacha 10:00 dan 20:00 gacha ishlaydi. Buyurtmangizni tayyorlab qo'yishimiz uchun bizni oldindan ogohlantiring."
  }
};

locales.forEach(locale => {
  const filePath = path.join(__dirname, 'frontend', 'src', 'locales', locale, 'translation.json');
  let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  if (data.contacts_page) {
    data.contacts_page.faq_q3 = faqs[locale].faq_q3;
    data.contacts_page.faq_a3 = faqs[locale].faq_a3;
    data.contacts_page.faq_q2 = faqs[locale].faq_q2;
    data.contacts_page.faq_a2 = faqs[locale].faq_a2;
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
});

console.log("Translations updated");
