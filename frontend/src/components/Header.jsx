import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart, User, LogOut, Leaf, Search, Heart, Phone, Send, Menu, X } from 'lucide-react';
import { logout } from '../store/authSlice';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const wishlistCount = wishlistItems?.length || 0; 

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchTerm)}`);
    } else {
      navigate('/catalog');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full flex flex-col shadow-md">
      {/* Над-шапка (Top bar) */}
      <div className="bg-[#1a2e21] text-tea-light/80 py-1.5 text-xs hidden sm:block border-b border-white/5">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex space-x-6">
            <a href="tel:+998910098252" className="flex items-center hover:text-tea-gold transition font-medium">
              <Phone size={12} className="mr-1.5 text-tea-gold" />
              +998 (91) 009-82-52
            </a>
            <a href="https://t.me/fateleaf_support_bot" target="_blank" rel="noreferrer" className="flex items-center hover:text-tea-gold transition font-medium">
              <Send size={12} className="mr-1.5 text-tea-gold" />
              Telegram Чат
            </a>
          </div>
          <div className="flex space-x-4">
            <span>Ежедневно с 09:00 до 21:00</span>
          </div>
        </div>
      </div>

      {/* Основная шапка */}
      <div className="bg-tea-dark text-tea-light py-3 relative">
        <div className="container mx-auto px-4 flex justify-between items-center gap-4 lg:gap-8">
          
          {/* 1. Логотип и Бургер-меню (для мобильных) */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            <button 
              className="lg:hidden text-tea-gold hover:text-tea-light transition"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
            <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-tea-gold">
              <Leaf className="h-8 w-8" />
              <span>FateLeaf</span>
            </Link>
          </div>

          {/* 2. Навигация (По центру) */}
          <nav className="hidden lg:flex space-x-3 xl:space-x-8 items-center flex-1 justify-center whitespace-nowrap text-sm xl:text-base">
            <Link to="/catalog" className="hover:text-tea-gold transition font-medium">{t('header.catalog')}</Link>
            <Link to="/gift" className="hover:text-tea-gold transition font-medium">🎁 Подарки</Link>
            <Link to="/about" className="hover:text-tea-gold transition font-medium">{t('header.about')}</Link>
            <Link to="/delivery" className="hover:text-tea-gold transition font-medium">{t('header.delivery')}</Link>
            <Link to="/contacts" className="hover:text-tea-gold transition font-medium">{t('header.contacts')}</Link>
          </nav>

          {/* 3. Действия и Поиск (Справа) */}
          <div className="flex items-center space-x-2 xl:space-x-5 flex-shrink-0">
            
            <form onSubmit={handleSearch} className="relative hidden md:block">
              <input 
                type="text" 
                placeholder={t('header.search_placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm text-tea-light placeholder-tea-light/60 focus:outline-none focus:ring-1 focus:ring-tea-gold w-32 lg:w-40 xl:w-60 transition-all"
              />
              <button type="submit" className="absolute left-2.5 top-2 text-tea-light/70 hover:text-tea-gold transition">
                <Search size={16} />
              </button>
            </form>

            <div className="hidden sm:flex items-center border border-tea-green/30 rounded-md overflow-hidden bg-tea-green/10 text-xs font-bold cursor-pointer">
              <button 
                onClick={() => i18n.changeLanguage('ru')}
                className={`px-2 py-1 transition ${i18n.language === 'ru' ? 'bg-tea-gold text-tea-dark' : 'text-tea-light hover:bg-tea-green/20'}`}
              >RU</button>
              <button 
                onClick={() => i18n.changeLanguage('uz')}
                className={`px-2 py-1 transition ${i18n.language === 'uz' ? 'bg-tea-gold text-tea-dark' : 'text-tea-light hover:bg-tea-green/20'}`}
              >UZ</button>
              <button 
                onClick={() => i18n.changeLanguage('en')}
                className={`px-2 py-1 transition ${i18n.language === 'en' ? 'bg-tea-gold text-tea-dark' : 'text-tea-light hover:bg-tea-green/20'}`}
              >EN</button>
            </div>

            <Link to="/wishlist" className="relative hover:text-tea-gold transition" title="Избранное">
              <Heart className="h-6 w-6" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-tea-gold text-tea-dark rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative hover:text-tea-gold transition" title="Корзина">
              <ShoppingCart className="h-6 w-6" />
              {items.length > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-tea-gold text-tea-dark rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold shadow-sm">
                  {items.length}
                </span>
              )}
            </Link>
            
            {userInfo ? (
              <div className="flex items-center space-x-3 pl-1 xl:pl-3 border-l border-white/20">
                {userInfo.role === 'admin' && (
                  <Link to="/admin" className="hidden lg:inline text-[10px] xl:text-[11px] uppercase tracking-wider font-bold bg-tea-green/80 text-white px-2 py-1 rounded hover:bg-tea-gold transition">
                    Админ
                  </Link>
                )}
                <Link to="/profile" className="flex items-center space-x-2 hover:text-tea-gold transition">
                  {userInfo.avatar ? (
                    <img 
                      src={userInfo.avatar} 
                      alt={userInfo.name} 
                      className="h-6 w-6 rounded-full object-cover border border-tea-gold/50" 
                    />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                  <span className="hidden md:inline text-sm font-medium">{userInfo.name}</span>
                </Link>
                <button onClick={handleLogout} className="hover:text-red-400 transition ml-1" title="Выйти">
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="flex items-center space-x-1 hover:text-tea-gold transition pl-1 xl:pl-3 border-l border-white/20">
                <User className="h-5 w-5" />
                <span className="hidden md:inline text-sm font-medium">{t('header.login')}</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Мобильное Бургер-меню (Dropdown) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-tea-dark border-t border-white/10 absolute top-full left-0 w-full shadow-xl">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {/* Поиск для мобилок */}
            <form onSubmit={(e) => { handleSearch(e); setIsMobileMenuOpen(false); }} className="relative mb-2">
              <input 
                type="text" 
                placeholder={t('header.search_placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded-lg bg-white/10 border border-white/20 text-tea-light placeholder-tea-light/60 focus:outline-none focus:ring-1 focus:ring-tea-gold transition-all"
              />
              <button type="submit" className="absolute left-3 top-2.5 text-tea-light/70 hover:text-tea-gold transition">
                <Search size={18} />
              </button>
            </form>

            <Link to="/catalog" onClick={() => setIsMobileMenuOpen(false)} className="text-tea-light hover:text-tea-gold text-lg font-medium border-b border-white/5 pb-2">{t('header.catalog')}</Link>
            <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-tea-light hover:text-tea-gold text-lg font-medium border-b border-white/5 pb-2">{t('header.about')}</Link>
            <Link to="/delivery" onClick={() => setIsMobileMenuOpen(false)} className="text-tea-light hover:text-tea-gold text-lg font-medium border-b border-white/5 pb-2">{t('header.delivery')}</Link>
            <Link to="/contacts" onClick={() => setIsMobileMenuOpen(false)} className="text-tea-light hover:text-tea-gold text-lg font-medium border-b border-white/5 pb-2">{t('header.contacts')}</Link>
            
            {userInfo?.role === 'admin' && (
              <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-tea-gold font-bold text-lg pb-2 border-b border-white/5">Админ-панель</Link>
            )}
            
            <div className="flex flex-col space-y-3 pt-2 text-tea-light/70 text-sm">
              <div className="flex items-center">
                <Phone size={14} className="mr-2 text-tea-gold" />
                <a href="tel:+998910098252" className="hover:text-tea-gold transition font-medium">
                  +998 (91) 009-82-52
                </a>
              </div>
              <a href="https://t.me/fateleaf_support_bot" target="_blank" rel="noreferrer" className="flex items-center hover:text-tea-gold">
                <Send size={16} className="mr-2" />
                Telegram Чат
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
