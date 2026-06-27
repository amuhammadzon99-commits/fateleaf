const fs = require('fs');
const path = require('path');

const locales = ['ru', 'en', 'uz'];
const translations = {
  ru: {
    catalog: {
      addedToCart: "Товар добавлен в корзину",
      loadError: "Ошибка загрузки каталога",
      titleCategory: "Каталог: {{category}}",
      title: "Каталог чая",
      reset: "Сбросить",
      searchPlaceholder: "Поиск товаров (например: Сенча, Пуэр)...",
      noProducts: "По вашему запросу товары не найдены.",
      resetSearch: "Сбросить поиск",
      badgeNew: "NEW",
      badgeSale: "-20%",
      badgeHit: "HIT",
      tea: "Чай",
      addToCart: "В корзину"
    },
    product: {
      addedToCart: "Товар добавлен в корзину",
      loadError: "Ошибка загрузки товара",
      loading: "Загрузка...",
      home: "Главная",
      catalog: "Каталог",
      reviews: "отзывов",
      orders: "заказов",
      inStock: "В наличии",
      outOfStock: "Нет в наличии",
      addToCart: "Добавить в корзину",
      addToCartPrice: "В корзину за",
      buyNow: "Купить в 1 клик",
      tabDesc: "Описание",
      tabSpecs: "Характеристики",
      tabReviews: "Отзывы",
      installmentDolyami: "Долями",
      installmentSplit: "Сплит",
      installmentDolyamiDesc: "4 платежа по",
      installmentSplitDesc: "Яндекс Сплит 4x",
      pcs: "шт.",
      weight: "Вес",
      category: "Категория",
      badgeNew: "НОВИНКА",
      badgeSale: "СКИДКА",
      badgeHit: "ХИТ"
    }
  },
  en: {
    catalog: {
      addedToCart: "Item added to cart",
      loadError: "Error loading catalog",
      titleCategory: "Catalog: {{category}}",
      title: "Tea Catalog",
      reset: "Reset",
      searchPlaceholder: "Search products (e.g. Sencha, Puer)...",
      noProducts: "No products found for your query.",
      resetSearch: "Reset Search",
      badgeNew: "NEW",
      badgeSale: "-20%",
      badgeHit: "HIT",
      tea: "Tea",
      addToCart: "Add to Cart"
    },
    product: {
      addedToCart: "Item added to cart",
      loadError: "Error loading product",
      loading: "Loading...",
      home: "Home",
      catalog: "Catalog",
      reviews: "reviews",
      orders: "orders",
      inStock: "In Stock",
      outOfStock: "Out of Stock",
      addToCart: "Add to Cart",
      addToCartPrice: "Add to Cart for",
      buyNow: "Buy Now",
      tabDesc: "Description",
      tabSpecs: "Specifications",
      tabReviews: "Reviews",
      installmentDolyami: "Dolyami",
      installmentSplit: "Split",
      installmentDolyamiDesc: "4 payments of",
      installmentSplitDesc: "Yandex Split 4x",
      pcs: "pcs",
      weight: "Weight",
      category: "Category",
      badgeNew: "NEW",
      badgeSale: "SALE",
      badgeHit: "HIT"
    }
  },
  uz: {
    catalog: {
      addedToCart: "Maxsulot savatga qo'shildi",
      loadError: "Katalogni yuklashda xatolik",
      titleCategory: "Katalog: {{category}}",
      title: "Choy Katalogi",
      reset: "Bekor qilish",
      searchPlaceholder: "Maxsulotlarni izlash (masalan: Sencha, Puer)...",
      noProducts: "So'rovingiz bo'yicha maxsulotlar topilmadi.",
      resetSearch: "Izlashni bekor qilish",
      badgeNew: "YANGI",
      badgeSale: "-20%",
      badgeHit: "HIT",
      tea: "Choy",
      addToCart: "Savatga"
    },
    product: {
      addedToCart: "Maxsulot savatga qo'shildi",
      loadError: "Maxsulotni yuklashda xatolik",
      loading: "Yuklanmoqda...",
      home: "Asosiy",
      catalog: "Katalog",
      reviews: "sharhlar",
      orders: "buyurtmalar",
      inStock: "Mavjud",
      outOfStock: "Qolmagan",
      addToCart: "Savatga qo'shish",
      addToCartPrice: "Savatga qo'shish:",
      buyNow: "1 marta bosish orqali xarid",
      tabDesc: "Tavsif",
      tabSpecs: "Xususiyatlar",
      tabReviews: "Sharhlar",
      installmentDolyami: "Bo'lib",
      installmentSplit: "Split",
      installmentDolyamiDesc: "4 ta to'lov",
      installmentSplitDesc: "Yandex Split 4x",
      pcs: "dona",
      weight: "Og'irligi",
      category: "Kategoriyasi",
      badgeNew: "YANGI",
      badgeSale: "CHEGIRMA",
      badgeHit: "HIT"
    }
  }
};

locales.forEach(locale => {
  const filePath = path.join(__dirname, 'frontend', 'src', 'locales', locale, 'translation.json');
  let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  data.catalog = translations[locale].catalog;
  data.product = translations[locale].product;
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
});

console.log("Translations added successfully!");
