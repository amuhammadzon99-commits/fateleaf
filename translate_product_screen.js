const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend', 'src', 'pages', 'ProductScreen.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace strings
const replacements = [
  ["'Товар добавлен в корзину'", "t('product.addedToCart')"],
  ["'Ошибка загрузки товара'", "t('product.loadError')"],
  ["Загрузка...", "{t('product.loading')}"],
  [">Главная<", ">{t('product.home')}<"],
  [">Каталог<", ">{t('product.catalog')}<"],
  ["отзывов)", "{t('product.reviews')})"],
  ["заказов<", "{t('product.orders')}<"],
  ["ХИТ ПРОДАЖ", "{t('product.badgeHit')}"],
  ["НОВИНКА", "{t('product.badgeNew')}"],
  ["СКИДКА", "{t('product.badgeSale')}"],
  ["Без карты FateLeaf", "{t('cart.withoutCard')}"],
  [">Долями<", ">{t('product.installmentDolyami')}<"],
  [">Сплит<", ">{t('product.installmentSplit')}<"],
  [">Добавить в корзину<", ">{t('product.addToCart')}<"],
  [">Доставим завтра<", ">{t('cart.deliverTomorrow')}<"],
  ["Купить в 1 клик", "{t('product.buyNow')}"],
  [">Описание<", ">{t('product.tabDesc')}<"],
  [">Характеристики<", ">{t('product.tabSpecs')}<"],
  [">Отзывы<", ">{t('product.tabReviews')}<"],
  [">Категория:<", ">{t('product.category')}:<"],
  [">Вес:<", ">{t('product.weight')}:<"],
  [">Наличие:<", ">{t('product.availability') || 'Наличие'}:<"],
  [">В корзине<", ">{t('catalog.addedToCart') || 'В корзине'}<"],
  [">Перейти в корзину<", ">{t('cart.goCatalog') || 'Перейти в корзину'}<"],
  [">Оформить заказ<", ">{t('cart.checkoutBtn')}<"]
];

replacements.forEach(([from, to]) => {
  content = content.replaceAll(from, to);
});

fs.writeFileSync(filePath, content, 'utf8');
console.log("ProductScreen translated");
