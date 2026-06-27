import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-tea-dark text-tea-light py-8 mt-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold text-tea-gold mb-4">FateLeaf</h3>
          <p className="text-sm">Премиальный чай для истинных ценителей. Откройте для себя вкус судьбы в каждой чашке.</p>
        </div>
        <div>
          <h4 className="text-lg font-bold mb-4">Навигация</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/catalog" className="hover:text-tea-gold">Каталог</Link></li>
            <li><Link to="/about" className="hover:text-tea-gold">О нас</Link></li>
            <li><Link to="/delivery" className="hover:text-tea-gold">Доставка и оплата</Link></li>
            <li><Link to="/contacts" className="hover:text-tea-gold">Контакты</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-bold mb-4">Контакты</h4>
          <ul className="space-y-4 text-gray-300">
            <li>Email: info@fateleaf.com</li>
            <li>Телефон: +998 (91) 009-82-52</li>
            <li>Адрес: г. Ташкент, ул. Амира Темура, 107</li>
          </ul>
        </div>
      </div>
      <div className="text-center text-sm mt-8 border-t border-tea-green pt-4">
        &copy; {new Date().getFullYear()} FateLeaf. Все права защищены.
      </div>
    </footer>
  );
};

export default Footer;
