const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend', 'src', 'pages', 'Profile.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Import useTranslation if not exists
if (!content.includes('useTranslation')) {
  content = content.replace("import { Navigate, Link } from 'react-router-dom';", "import { Navigate, Link } from 'react-router-dom';\nimport { useTranslation } from 'react-i18next';");
  content = content.replace("const Profile = () => {", "const Profile = () => {\n  const { t } = useTranslation();");
}

const replacements = [
  ["'Не удалось загрузить историю заказов'", "t('profile.errorLoadOrders')"],
  ["'Фото профиля успешно загружено!'", "t('profile.avatarSuccess')"],
  ["'Ошибка при загрузке фото'", "t('profile.avatarError')"],
  ["'Пароли не совпадают!'", "t('profile.passwordMismatch')"],
  ["'Сохранение изменений...'", "t('profile.saving')"],
  ["'Профиль успешно обновлен!'", "t('profile.updateSuccess')"],
  ["'Ошибка обновления профиля:'", "t('profile.updateError')"],
  ["'Не удалось обновить профиль'", "t('profile.updateError')"],
  [">Личный кабинет<", ">{t('profile.title')}<"],
  [">Добро пожаловать, <", ">{t('profile.welcome')}, <"],
  [">Панель управления<", ">{t('profile.adminPanel')}<"],
  [">Мои данные<", ">{t('profile.myData')}<"],
  [">Изменить<", ">{t('profile.edit')}<"],
  [">Выход из аккаунта<", ">{t('profile.logout')}<"],
  [">Имя<", ">{t('profile.name')}<"],
  [">Не указан<", ">{t('profile.notSpecified')}<"],
  [">Изменение данных<", ">{t('profile.editData')}<"],
  [">Имя и Фамилия<", ">{t('profile.fullName')}<"],
  [">Новый пароль<", ">{t('profile.newPassword')}<"],
  [">Повторите пароль<", ">{t('profile.confirmPassword')}<"],
  [">Отмена<", ">{t('profile.cancel')}<"],
  [">Сохранить<", ">{t('profile.save')}<"],
  [">История ваших заказов<", ">{t('profile.orderHistory')}<"],
  [">Загружаем историю ваших заказов...<", ">{t('profile.loadingOrders')}<"],
  [">Вы еще не делали заказов<", ">{t('profile.noOrders')}<"],
  [">Откройте наш каталог изысканных чайных купажей и соберите свой первый заказ прямо сейчас!<", ">{t('profile.noOrdersDesc')}<"],
  ["> Перейти в каталог<", "> {t('profile.goCatalog')}<"],
  ["'В обработке'", "t('profile.statusProcessing')"],
  ["'Доставлен'", "t('profile.statusDelivered')"],
  ["'Отменен'", "t('profile.statusCancelled')"],
  [">Заказ #<", ">{t('profile.orderNum')} #<"],
  [">Сумма заказа<", ">{t('profile.orderTotal')}<"],
  [">Адрес доставки: <", ">{t('profile.shippingAddress')}: <"],
  [">Оплата: <", ">{t('profile.payment')}: <"],
  ["'Наличными при получении'", "t('profile.cashOnDelivery')"]
];

replacements.forEach(([from, to]) => {
  content = content.replaceAll(from, to);
});

fs.writeFileSync(filePath, content, 'utf8');
console.log("Profile translated");
