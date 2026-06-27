const fs = require('fs');
const path = require('path');

const locales = ['ru', 'en', 'uz'];

const newTranslations = {
  ru: {
    delivery: {
      title: "Доставка и оплата",
      subtitle: "Мы делаем всё, чтобы премиальный чай FateLeaf оказался в вашей чашке как можно быстрее и безопаснее.",
      howItWorks: "Как это работает",
      deliveryMethods: "Способы доставки",
      paymentMethods: "Способы оплаты",
      faq: "Вопросы и ответы",
      returns: "Возврат и обмен",
      packaging: "Как мы упаковываем заказы",
      anyQuestions: "Остались вопросы?"
    }
  },
  en: {
    delivery: {
      title: "Delivery & Payment",
      subtitle: "We do everything so that FateLeaf premium tea ends up in your cup as quickly and safely as possible.",
      howItWorks: "How it works",
      deliveryMethods: "Delivery Methods",
      paymentMethods: "Payment Methods",
      faq: "FAQ",
      returns: "Returns & Exchanges",
      packaging: "How we pack orders",
      anyQuestions: "Still have questions?"
    }
  },
  uz: {
    delivery: {
      title: "Yetkazib berish va To'lov",
      subtitle: "Biz FateLeaf premium choyi imkon qadar tez va xavfsiz chashkangizga yetib borishi uchun barcha imkoniyatni ishga solamiz.",
      howItWorks: "Bu qanday ishlaydi",
      deliveryMethods: "Yetkazib berish usullari",
      paymentMethods: "To'lov usullari",
      faq: "Savol-Javob",
      returns: "Qaytarish va Almashtirish",
      packaging: "Buyurtmalarni qanday qadoqlaymiz",
      anyQuestions: "Savollaringiz qoldimi?"
    }
  }
};

locales.forEach(locale => {
  const filePath = path.join(__dirname, 'frontend', 'src', 'locales', locale, 'translation.json');
  let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  if (!data.delivery) data.delivery = {};
  data.delivery = newTranslations[locale].delivery;
  
  if (!data.about) data.about = {};
  data.about.title = locale === 'ru' ? "История" : (locale === 'en' ? "History" : "Tarix");
  data.about.fateleaf = "FateLeaf";
  data.about.philosophy = locale === 'ru' ? "Наша философия" : (locale === 'en' ? "Our Philosophy" : "Falsafamiz");
  data.about.blogTitle = locale === 'ru' ? "Чайный блог" : (locale === 'en' ? "Tea Blog" : "Choy Blogi");
  data.about.foundersText = locale === 'ru' ? "Слово основателей" : (locale === 'en' ? "Word from Founders" : "Asoschilardan so'z");
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
});

console.log("JSON Translations updated!");

// Update Delivery.jsx
const deliveryPath = path.join(__dirname, 'frontend', 'src', 'pages', 'Delivery.jsx');
let deliveryContent = fs.readFileSync(deliveryPath, 'utf8');

if (!deliveryContent.includes("import { useTranslation }")) {
  deliveryContent = deliveryContent.replace("import { Link } from 'react-router-dom';", "import { Link } from 'react-router-dom';\nimport { useTranslation } from 'react-i18next';");
  deliveryContent = deliveryContent.replace("const Delivery = () => {", "const Delivery = () => {\n  const { t } = useTranslation();");
}

const delReplacements = [
  [">Доставка и оплата<", ">{t('delivery.title')}<"],
  [">Мы делаем всё, чтобы премиальный чай FateLeaf оказался в вашей чашке как можно быстрее и безопаснее.<", ">{t('delivery.subtitle')}<"],
  [">Как это работает<", ">{t('delivery.howItWorks')}<"],
  [">Способы доставки<", ">{t('delivery.deliveryMethods')}<"],
  [">Способы оплаты<", ">{t('delivery.paymentMethods')}<"],
  [">Вопросы и ответы<", ">{t('delivery.faq')}<"],
  [">Возврат и обмен<", ">{t('delivery.returns')}<"],
  [">Как мы упаковываем заказы<", ">{t('delivery.packaging')}<"],
  [">Остались вопросы?<", ">{t('delivery.anyQuestions')}<"]
];
delReplacements.forEach(([from, to]) => {
  deliveryContent = deliveryContent.replaceAll(from, to);
});
fs.writeFileSync(deliveryPath, deliveryContent, 'utf8');
console.log("Delivery.jsx fixed");

// Update About.jsx
const aboutPath = path.join(__dirname, 'frontend', 'src', 'pages', 'About.jsx');
let aboutContent = fs.readFileSync(aboutPath, 'utf8');

if (!aboutContent.includes("import { useTranslation }")) {
  aboutContent = aboutContent.replace("import { Link } from 'react-router-dom';", "import { Link } from 'react-router-dom';\nimport { useTranslation } from 'react-i18next';");
  aboutContent = aboutContent.replace("const About = () => {", "const About = () => {\n  const { t } = useTranslation();");
}

const aboutReplacements = [
  ["<span className=\"text-white\">История </span>", "<span className=\"text-white\">{t('about.title')} </span>"],
  ["<span className=\"text-tea-gold\">FateLeaf</span>", "<span className=\"text-tea-gold\">{t('about.fateleaf')}</span>"],
  [">Наша философия<", ">{t('about.philosophy')}<"],
  [">Чайный блог<", ">{t('about.blogTitle')}<"],
  [">Слово основателей<", ">{t('about.foundersText')}<"]
];
aboutReplacements.forEach(([from, to]) => {
  aboutContent = aboutContent.replaceAll(from, to);
});
fs.writeFileSync(aboutPath, aboutContent, 'utf8');
console.log("About.jsx fixed");
