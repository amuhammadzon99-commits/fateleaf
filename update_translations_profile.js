const fs = require('fs');
const path = require('path');

const locales = ['ru', 'en', 'uz'];
const translations = {
  ru: {
    profile: {
      errorLoadOrders: "Не удалось загрузить историю заказов",
      avatarSuccess: "Фото профиля успешно загружено!",
      avatarError: "Ошибка при загрузке фото",
      passwordMismatch: "Пароли не совпадают!",
      saving: "Сохранение изменений...",
      updateSuccess: "Профиль успешно обновлен!",
      updateError: "Не удалось обновить профиль",
      title: "Личный кабинет",
      welcome: "Добро пожаловать",
      adminPanel: "Панель управления",
      myData: "Мои данные",
      edit: "Изменить",
      logout: "Выход из аккаунта",
      name: "Имя",
      notSpecified: "Не указан",
      editData: "Изменение данных",
      fullName: "Имя и Фамилия",
      newPassword: "Новый пароль",
      confirmPassword: "Повторите пароль",
      cancel: "Отмена",
      save: "Сохранить",
      orderHistory: "История ваших заказов",
      loadingOrders: "Загружаем историю ваших заказов...",
      noOrders: "Вы еще не делали заказов",
      noOrdersDesc: "Откройте наш каталог изысканных чайных купажей и соберите свой первый заказ прямо сейчас!",
      goCatalog: "Перейти в каталог",
      statusProcessing: "В обработке",
      statusDelivered: "Доставлен",
      statusCancelled: "Отменен",
      orderNum: "Заказ",
      orderTotal: "Сумма заказа",
      shippingAddress: "Адрес доставки",
      payment: "Оплата",
      cashOnDelivery: "Наличными при получении"
    }
  },
  en: {
    profile: {
      errorLoadOrders: "Failed to load order history",
      avatarSuccess: "Profile photo uploaded successfully!",
      avatarError: "Error uploading photo",
      passwordMismatch: "Passwords do not match!",
      saving: "Saving changes...",
      updateSuccess: "Profile successfully updated!",
      updateError: "Failed to update profile",
      title: "My Account",
      welcome: "Welcome",
      adminPanel: "Dashboard",
      myData: "My Details",
      edit: "Edit",
      logout: "Log Out",
      name: "Name",
      notSpecified: "Not specified",
      editData: "Edit Details",
      fullName: "Full Name",
      newPassword: "New Password",
      confirmPassword: "Confirm Password",
      cancel: "Cancel",
      save: "Save",
      orderHistory: "Your Order History",
      loadingOrders: "Loading your order history...",
      noOrders: "You have no orders yet",
      noOrdersDesc: "Explore our catalog of exquisite tea blends and place your first order now!",
      goCatalog: "Go to Catalog",
      statusProcessing: "Processing",
      statusDelivered: "Delivered",
      statusCancelled: "Cancelled",
      orderNum: "Order",
      orderTotal: "Order Total",
      shippingAddress: "Shipping Address",
      payment: "Payment",
      cashOnDelivery: "Cash on delivery"
    }
  },
  uz: {
    profile: {
      errorLoadOrders: "Buyurtmalar tarixini yuklab bo'lmadi",
      avatarSuccess: "Profil rasmi muvaffaqiyatli yuklandi!",
      avatarError: "Rasmni yuklashda xatolik",
      passwordMismatch: "Parollar mos kelmadi!",
      saving: "O'zgarishlar saqlanmoqda...",
      updateSuccess: "Profil muvaffaqiyatli yangilandi!",
      updateError: "Profilni yangilab bo'lmadi",
      title: "Shaxsiy kabinet",
      welcome: "Xush kelibsiz",
      adminPanel: "Boshqaruv paneli",
      myData: "Mening ma'lumotlarim",
      edit: "O'zgartirish",
      logout: "Tizimdan chiqish",
      name: "Ism",
      notSpecified: "Ko'rsatilmagan",
      editData: "Ma'lumotlarni o'zgartirish",
      fullName: "Ism va Familiya",
      newPassword: "Yangi parol",
      confirmPassword: "Parolni takrorlang",
      cancel: "Bekor qilish",
      save: "Saqlash",
      orderHistory: "Buyurtmalaringiz tarixi",
      loadingOrders: "Buyurtmalar tarixi yuklanmoqda...",
      noOrders: "Siz hali buyurtma qilmadingiz",
      noOrdersDesc: "Bizning ajoyib choylar katalogini oching va hoziroq birinchi buyurtmangizni yig'ing!",
      goCatalog: "Katalogga o'tish",
      statusProcessing: "Jarayonda",
      statusDelivered: "Yetkazib berilgan",
      statusCancelled: "Bekor qilingan",
      orderNum: "Buyurtma",
      orderTotal: "Buyurtma summasi",
      shippingAddress: "Yetkazib berish manzili",
      payment: "To'lov",
      cashOnDelivery: "Qabul qilinganda naqd pul orqali"
    }
  }
};

locales.forEach(locale => {
  const filePath = path.join(__dirname, 'frontend', 'src', 'locales', locale, 'translation.json');
  let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  data.profile = translations[locale].profile;
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
});

console.log("Profile translations added successfully!");
