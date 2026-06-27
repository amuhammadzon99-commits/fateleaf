import fs from 'fs';

['ru', 'en', 'uz'].forEach(lang => { 
  const path = `../frontend/src/locales/${lang}/translation.json`; 
  const data = JSON.parse(fs.readFileSync(path)); 
  
  data.about = { 
    title: lang==='ru'?'О нас':lang==='en'?'About Us':'Biz haqimizda', 
    fateleaf: 'FateLeaf', 
    philosophy: lang==='ru'?'Наша философия':lang==='en'?'Our Philosophy':'Bizning Falsafa', 
    story_btn: lang==='ru'?'Читать историю':lang==='en'?'Read Story':'Tarixni o\'qish', 
    quality_title: lang==='ru'?'Исключительное качество':lang==='en'?'Exceptional Quality':'Ajoyib sifat', 
    quality_desc: lang==='ru'?'Мы отбираем только лучшие цельные чайные листья...':lang==='en'?'We select only the best whole tea leaves...':'Biz faqat eng yaxshi choy barglarini tanlaymiz...', 
    ritual_title: lang==='ru'?'Ритуал и гармония':lang==='en'?'Ritual and Harmony':'Marosim va Garmoniya', 
    ritual_desc: lang==='ru'?'Для нас чай — это не просто напиток...':lang==='en'?'For us, tea is not just a drink...':'Biz uchun choy shunchaki ichimlik emas...', 
    natural_title: lang==='ru'?'Натуральность во всем':lang==='en'?'Naturalness in everything':'Tabiiylik har bir narsada', 
    natural_desc: lang==='ru'?'Мы категорически против искусственных добавок...':lang==='en'?'We are strictly against artificial additives...':'Biz sun\'iy qo\'shimchalarga mutlaqo qarshimiz...', 
    our_path: lang==='ru'?'Наш путь':lang==='en'?'Our Path':'Bizning yo\'limiz', 
    blog_title: lang==='ru'?'Чайный блог':lang==='en'?'Tea Blog':'Choy Blogi' 
  }; 
  
  data.delivery = { 
    title: lang==='ru'?'Доставка и оплата':lang==='en'?'Delivery & Payment':'Yetkazib berish va to\'lov', 
    subtitle: lang==='ru'?'Мы делаем всё, чтобы премиальный чай FateLeaf оказался в вашей чашке как можно быстрее.':lang==='en'?'We do everything so that premium FateLeaf tea gets into your cup as quickly as possible.':'Biz FateLeaf choyi tezroq sizning piyolangizda bo\'lishi uchun hamma narsani qilamiz.', 
    howItWorks: lang==='ru'?'Как это работает':lang==='en'?'How it works':'Qanday ishlaydi',
    step1_title: lang==='ru'?'Оформление заказа':lang==='en'?'Order Placement':'Buyurtma berish',
    step1_desc: lang==='ru'?'Выберите любимые сорта чая, добавьте в корзину и заполните данные.':lang==='en'?'Choose your favorite tea, add to cart and fill details.':'Choy tanlang, savatga qo\'shing va ma\'lumotlarni to\'ldiring.',
    step2_title: lang==='ru'?'Подтверждение':lang==='en'?'Confirmation':'Tasdiqlash',
    step2_desc: lang==='ru'?'Мы свяжемся с вами для уточнения деталей.':lang==='en'?'We will contact you.':'Biz siz bilan bog\'lanamiz.',
    step3_title: lang==='ru'?'Отправка':lang==='en'?'Shipping':'Yuborish',
    step3_desc: lang==='ru'?'Бережно упаковываем и передаем в курьерскую службу.':lang==='en'?'We pack carefully and ship.':'Diqqat bilan qadoqlaymiz va yuboramiz.',
    step4_title: lang==='ru'?'Наслаждение':lang==='en'?'Enjoy':'Zavqlaning',
    step4_desc: lang==='ru'?'Заваривайте чай и наслаждайтесь моментом.':lang==='en'?'Brew tea and enjoy.':'Choy damlang va zavqlaning.',
    region_title: lang==='ru'?'Доставка по регионам':lang==='en'?'Delivery by regions':'Viloyatlar bo\'yicha yetkazib berish',
    payment_methods: lang==='ru'?'Способы оплаты':lang==='en'?'Payment Methods':'To\'lov usullari'
  }; 
  
  fs.writeFileSync(path, JSON.stringify(data, null, 2)); 
});
console.log('Locales updated!');
