const fs = require('fs');
const path = require('path');

const locales = ['ru', 'en', 'uz'];

// 1. Translations
const newTranslations = {
  ru: {
    about: {
      title: "О нас",
      subtitle: "История, страсть и мастерство в каждой чашке чая",
      philosophy: "Наша философия",
      philosophyDesc: "Мы верим, что чай — это не просто напиток. Это искусство, традиция и способ найти гармонию.",
      blogTitle: "Чайный блог",
      blogDesc: "Полезные статьи о заваривании, хранении и выборе лучшего чая",
      readMore: "Читать далее"
    },
    contacts: {
      title: "Свяжитесь с нами",
      subtitle: "Мы всегда рады помочь вам с выбором чая и ответить на любые вопросы",
      address: "Адрес",
      addressText: "г. Ташкент, ул. Амира Темура, 107",
      phone: "Телефон",
      email: "Email",
      workHours: "Время работы",
      workHoursText: "Пн-Сб: 10:00 - 20:00",
      sendMsg: "Написать нам",
      formName: "Ваше имя",
      formContact: "Телефон или Email",
      formMessage: "Сообщение",
      submit: "Отправить",
      wholesale: "Оптовым клиентам"
    }
  },
  en: {
    about: {
      title: "About Us",
      subtitle: "History, passion and mastery in every cup of tea",
      philosophy: "Our Philosophy",
      philosophyDesc: "We believe that tea is not just a drink. It is art, tradition, and a way to find harmony.",
      blogTitle: "Tea Blog",
      blogDesc: "Useful articles about brewing, storing, and choosing the best tea",
      readMore: "Read more"
    },
    contacts: {
      title: "Contact Us",
      subtitle: "We are always happy to help you choose tea and answer any questions",
      address: "Address",
      addressText: "107 Amir Temur st, Tashkent",
      phone: "Phone",
      email: "Email",
      workHours: "Working Hours",
      workHoursText: "Mon-Sat: 10:00 - 20:00",
      sendMsg: "Send a Message",
      formName: "Your Name",
      formContact: "Phone or Email",
      formMessage: "Message",
      submit: "Submit",
      wholesale: "For Wholesale"
    }
  },
  uz: {
    about: {
      title: "Biz haqimizda",
      subtitle: "Har bir choy piyolasida tarix, ishtiyoq va mahorat",
      philosophy: "Falsafamiz",
      philosophyDesc: "Biz ishonamizki, choy shunchaki ichimlik emas. Bu san'at, an'ana va uyg'unlik topish yo'lidir.",
      blogTitle: "Choy blogi",
      blogDesc: "Eng yaxshi choyni tayyorlash, saqlash va tanlash bo'yicha foydali maqolalar",
      readMore: "Batafsil"
    },
    contacts: {
      title: "Biz bilan bog'lanish",
      subtitle: "Sizga choy tanlashda yordam berishdan va savollaringizga javob berishdan doim xursandmiz",
      address: "Manzil",
      addressText: "Toshkent sh., Amir Temur ko'chasi, 107",
      phone: "Telefon",
      email: "Elektron pochta",
      workHours: "Ish vaqti",
      workHoursText: "Du-Shan: 10:00 - 20:00",
      sendMsg: "Xabar yozish",
      formName: "Ismingiz",
      formContact: "Telefon yoki Email",
      formMessage: "Xabar",
      submit: "Yuborish",
      wholesale: "Ulgurji xaridorlarga"
    }
  }
};

locales.forEach(locale => {
  const filePath = path.join(__dirname, 'frontend', 'src', 'locales', locale, 'translation.json');
  let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  data.about = newTranslations[locale].about;
  data.contacts = newTranslations[locale].contacts;
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
});
console.log("Translations added to JSON files.");

// 2. Replace basic elements in Contacts
const contactsPath = path.join(__dirname, 'frontend', 'src', 'pages', 'Contacts.jsx');
let contactsContent = fs.readFileSync(contactsPath, 'utf8');

const contactsReplacements = [
  [">Свяжитесь с нами<", ">{t('contacts.title')}<"],
  [">Мы всегда рады помочь вам с выбором идеального чая и ответить на любые вопросы.<", ">{t('contacts.subtitle')}<"],
  [">Адрес<", ">{t('contacts.address')}<"],
  [">г. Ташкент, ул. Амира Темура, 107<", ">{t('contacts.addressText')}<"],
  [">Телефон<", ">{t('contacts.phone')}<"],
  [">Время работы<", ">{t('contacts.workHours')}<"],
  [">Пн-Сб: 10:00 - 20:00<", ">{t('contacts.workHoursText')}<"],
  [">Оптовым клиентам<", ">{t('contacts.wholesale')}<"],
  [">Отправить сообщение<", ">{t('contacts.submit')}<"],
  [">Написать нам<", ">{t('contacts.sendMsg')}<"],
  ["placeholder=\"Ваше имя\"", "placeholder={t('contacts.formName')}"],
  ["placeholder=\"Телефон или Email\"", "placeholder={t('contacts.formContact')}"],
  ["placeholder=\"Как мы можем вам помочь?\"", "placeholder={t('contacts.formMessage')}"]
];

contactsReplacements.forEach(([from, to]) => {
  contactsContent = contactsContent.replaceAll(from, to);
});
fs.writeFileSync(contactsPath, contactsContent, 'utf8');
console.log("Contacts.jsx translated");

// 3. Replace basic elements in About
const aboutPath = path.join(__dirname, 'frontend', 'src', 'pages', 'About.jsx');
let aboutContent = fs.readFileSync(aboutPath, 'utf8');

if (!aboutContent.includes('useTranslation')) {
  aboutContent = aboutContent.replace("import { Link } from 'react-router-dom';", "import { Link } from 'react-router-dom';\nimport { useTranslation } from 'react-i18next';");
  aboutContent = aboutContent.replace("const About = () => {", "const About = () => {\n  const { t } = useTranslation();");
}

const aboutReplacements = [
  [">О нас<", ">{t('about.title')}<"],
  [">История, страсть и мастерство в каждой чашке чая.<", ">{t('about.subtitle')}<"],
  [">Наша философия<", ">{t('about.philosophy')}<"],
  [">Читать далее<", ">{t('about.readMore')}<"],
  [">Чайный блог<", ">{t('about.blogTitle')}<"],
  [">Полезные статьи о заваривании, хранении и выборе лучшего чая<", ">{t('about.blogDesc')}<"]
];

aboutReplacements.forEach(([from, to]) => {
  aboutContent = aboutContent.replaceAll(from, to);
});
fs.writeFileSync(aboutPath, aboutContent, 'utf8');
console.log("About.jsx translated");

