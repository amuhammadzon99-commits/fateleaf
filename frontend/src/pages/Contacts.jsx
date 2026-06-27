import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  MapPin, 
  ChevronDown, 
  MessageCircle, 
  Briefcase, 
  FileText, 
  X, 
  Loader2, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Navigation, 
  Compass 
} from 'lucide-react';

const InstagramIcon = ({ size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);
import toast, { Toaster } from 'react-hot-toast';

const Contacts = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: '', contact: '', message: '' });
  const [openFaq, setOpenFaq] = useState(null);
  const [showLegal, setShowLegal] = useState(false);
  
  // Wholesale Form States
  const [isWholesaleModalOpen, setIsWholesaleModalOpen] = useState(false);
  const [wholesaleForm, setWholesaleForm] = useState({ name: '', company: '', phone: '', email: '', type: 'restaurant' });
  const [isSubmittingWholesale, setIsSubmittingWholesale] = useState(false);
  const [isWholesaleSuccess, setIsWholesaleSuccess] = useState(false);

  // Feedback Form States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [activeBadge, setActiveBadge] = useState(null);

  // Carousel States
  const [currentSlide, setCurrentSlide] = useState(0);
  const [carouselDirection, setCarouselDirection] = useState(0);

  const formatPhoneNumber = (value) => {
    const digits = value.replace(/\D/g, '');
    if (!digits) return value.startsWith('+') ? '+' : '';
    
    let rawDigits = digits;
    // Auto-prepend 998 for Uzbek numbers if the user types a local number digit first
    if (rawDigits.length > 0 && !rawDigits.startsWith('998') && rawDigits.length <= 9) {
      rawDigits = '998' + rawDigits;
    }
    
    if (rawDigits.startsWith('998')) {
      let formatted = '+998';
      if (rawDigits.length > 3) {
        formatted += ' (' + rawDigits.substring(3, 5);
      }
      if (rawDigits.length > 5) {
        formatted += ') ' + rawDigits.substring(5, 8);
      }
      if (rawDigits.length > 8) {
        formatted += '-' + rawDigits.substring(8, 10);
      }
      if (rawDigits.length > 10) {
        formatted += '-' + rawDigits.substring(10, 12);
      }
      return formatted;
    }
    return value;
  };

  const handleContactChange = (e) => {
    const val = e.target.value;
    // If the input starts with a plus or digit, apply Uzbek phone formatting
    if (/^[+\d]/.test(val)) {
      setFormData({ ...formData, contact: formatPhoneNumber(val) });
    } else {
      setFormData({ ...formData, contact: val });
    }
  };

  const selectBadge = (badgeText) => {
    const prefix = `[${badgeText}]: `;
    let cleanMessage = formData.message.replace(/^\[.*?\]:\s*/, '');
    setFormData({
      ...formData,
      message: prefix + cleanMessage
    });
    setActiveBadge(badgeText);
  };

  const handleWholesaleSubmit = (e) => {
    e.preventDefault();
    setIsSubmittingWholesale(true);
    setTimeout(() => {
      setIsSubmittingWholesale(false);
      setIsWholesaleSuccess(true);
    }, 1500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsFormSubmitted(true);
      toast.success(t('contacts_page.form_success'), { icon: '🍃' });
      setFormData({ name: '', contact: '', message: '' });
      setActiveBadge(null);
    }, 1200);
  };

  const faqs = [
    { q: t('contacts_page.faq_q1'), a: t('contacts_page.faq_a1') },
    { q: t('contacts_page.faq_q2'), a: t('contacts_page.faq_a2') },
    { q: t('contacts_page.faq_q3'), a: t('contacts_page.faq_a3') },
  ];

  const slides = [
    {
      image: '/images/showroom_shelves.png',
      tag: t('contacts_page.slide_tag_1'),
      title: t('contacts_page.slide_title_1'),
      description: t('contacts_page.slide_desc_1')
    },
    {
      image: '/images/tea_tasting.png',
      tag: t('contacts_page.slide_tag_2'),
      title: t('contacts_page.slide_title_2'),
      description: t('contacts_page.slide_desc_2')
    },
    {
      image: '/images/tea_sommelier.png',
      tag: t('contacts_page.slide_tag_3'),
      title: t('contacts_page.slide_title_3'),
      description: t('contacts_page.slide_desc_3')
    },
    {
      image: '/images/tea_club_interior.png',
      tag: t('contacts_page.slide_tag_4'),
      title: t('contacts_page.slide_title_4'),
      description: t('contacts_page.slide_desc_4')
    }
  ];

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 800 : -800,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 800 : -800,
      opacity: 0
    })
  };

  const nextSlide = () => {
    setCarouselDirection(1);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCarouselDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const badges = [
    t('contacts_page.form_badge_gift'),
    t('contacts_page.form_badge_order'),
    t('contacts_page.form_badge_coop')
  ];

  return (
    <div className="bg-gray-50 dark:bg-[#1A2421] min-h-screen pb-20">
      <Toaster position="top-right" />
      
      {/* Header Banner */}
      <div className="bg-tea-dark text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            {t('contacts_page.title')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-tea-light max-w-2xl mx-auto"
          >
            {t('contacts_page.subtitle')}
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Left Column: Contact Info & Socials */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-[#23312B] rounded-3xl p-8 md:p-10 shadow-lg dark:shadow-black/50 border border-gray-100 dark:border-[#3A5243] flex flex-col justify-between h-full"
          >
            <div>
              <h2 className="text-2xl font-bold text-tea-dark dark:text-tea-light mb-8 flex items-center">
                <MessageCircle className="mr-3 text-tea-gold" />
                {t('contacts_page.direct_title')}
              </h2>

              <div className="space-y-6 mb-8">
                <div className="flex items-start group">
                  <div className="bg-tea-green/20 p-3 rounded-full mr-4 text-tea-dark dark:text-tea-light group-hover:scale-110 transition-transform duration-300">
                    <Phone size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('contacts_page.phone')}</p>
                    <a href="tel:+998910098252" className="text-xl font-bold text-tea-dark dark:text-tea-light hover:text-tea-gold transition">
                      +998 (91) 009-82-52
                    </a>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="bg-tea-green/20 p-3 rounded-full mr-4 text-tea-dark dark:text-tea-light group-hover:scale-110 transition-transform duration-300">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('contacts_page.email')}</p>
                    <a href="mailto:info@fateleaf.com" className="text-xl font-bold text-tea-dark dark:text-tea-light hover:text-tea-gold transition">
                      info@fateleaf.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="bg-tea-green/20 p-3 rounded-full mr-4 text-tea-dark dark:text-tea-light group-hover:scale-110 transition-transform duration-300">
                    <Clock size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('contacts_page.working_hours')}</p>
                    <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
                      {t('contacts_page.hours_value')}
                    </p>
                  </div>
                </div>
              </div>

              <a 
                href="https://t.me/fateleaf_support_bot" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full bg-white dark:bg-[#23312B] hover:bg-tea-dark border-2 border-tea-dark text-tea-dark dark:text-tea-light hover:text-tea-gold font-bold py-3.5 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-md dark:shadow-black/40 transform hover:-translate-y-1 mb-8"
              >
                <Send size={20} className="mr-2" />
                {t('contacts_page.telegram_btn')}
              </a>
            </div>

            {/* Premium Social Media Icons Block */}
            <div className="border-t border-gray-100 dark:border-[#3A5243] pt-6 mt-4">
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 text-center">
                {t('contacts_page.socials_title')}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <a
                  href="https://instagram.com/fateleaf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center bg-gray-50 dark:bg-[#1A2421] hover:bg-tea-light dark:bg-[#1A2421]/10 border border-gray-100 dark:border-[#3A5243] rounded-2xl p-4 transition duration-300"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 text-white flex items-center justify-center shadow-md dark:shadow-black/40 hover:shadow-lg dark:shadow-black/50 transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-105">
                    <InstagramIcon size={22} />
                  </div>
                  <span className="text-sm text-tea-dark dark:text-tea-light mt-3 font-bold">Instagram</span>
                  <span className="text-xxs text-gray-400 text-center mt-1 hidden sm:inline-block leading-tight">
                    {t('contacts_page.instagram_desc')}
                  </span>
                </a>
                
                <a
                  href="https://t.me/fateleaf_channel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center bg-gray-50 dark:bg-[#1A2421] hover:bg-tea-light dark:bg-[#1A2421]/10 border border-gray-100 dark:border-[#3A5243] rounded-2xl p-4 transition duration-300"
                >
                  <div className="w-12 h-12 rounded-full bg-[#0088cc] text-white flex items-center justify-center shadow-md dark:shadow-black/40 hover:shadow-lg dark:shadow-black/50 transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-105">
                    <Send size={22} className="mr-0.5 mt-0.5" />
                  </div>
                  <span className="text-sm text-tea-dark dark:text-tea-light mt-3 font-bold">Telegram</span>
                  <span className="text-xxs text-gray-400 text-center mt-1 hidden sm:inline-block leading-tight">
                    {t('contacts_page.telegram_desc')}
                  </span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Contact Form with states */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-[#23312B] rounded-3xl p-8 md:p-10 shadow-lg dark:shadow-black/50 border border-gray-100 dark:border-[#3A5243] h-full flex flex-col justify-center relative overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {!isFormSubmitted ? (
                <motion.div
                  key="form-fields"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="w-full"
                >
                  <h2 className="text-2xl font-bold text-tea-dark dark:text-tea-light mb-6 flex items-center">
                    <FileText className="mr-3 text-tea-gold" />
                    {t('contacts_page.form_title')}
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('contacts_page.form_name')}</label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-5 py-3 rounded-xl border border-gray-200 dark:border-[#3A5243] focus:border-tea-gold focus:ring-2 focus:ring-tea-gold/20 outline-none transition"
                        placeholder="Иван Иванов"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('contacts_page.form_contact')}</label>
                      <input 
                        type="text" 
                        required
                        value={formData.contact}
                        onChange={handleContactChange}
                        className="w-full px-5 py-3 rounded-xl border border-gray-200 dark:border-[#3A5243] focus:border-tea-gold focus:ring-2 focus:ring-tea-gold/20 outline-none transition"
                        placeholder="example@mail.com или +998 (__) ___-__-__"
                      />
                    </div>

                    {/* Tag Badges */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        {t('contacts_page.form_badge_label')}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {badges.map((badgeText) => {
                          const isActive = formData.message.startsWith(`[${badgeText}]: `);
                          return (
                            <button
                              key={badgeText}
                              type="button"
                              onClick={() => selectBadge(badgeText)}
                              className={`text-xs px-3 py-2 rounded-full border transition-all duration-300 font-medium active:scale-95 ${
                                isActive 
                                  ? 'bg-tea-gold/20 border-tea-gold text-tea-dark dark:text-tea-light shadow-sm'
                                  : 'bg-gray-50 dark:bg-[#1A2421] text-gray-600 dark:text-gray-400 border-gray-200 dark:border-[#3A5243] hover:border-tea-gold/50 hover:bg-white dark:bg-[#23312B]'
                              }`}
                            >
                              {badgeText}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('contacts_page.form_message')}</label>
                      <textarea 
                        required
                        rows="4"
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="w-full px-5 py-3 rounded-xl border border-gray-200 dark:border-[#3A5243] focus:border-tea-gold focus:ring-2 focus:ring-tea-gold/20 outline-none transition resize-none"
                        placeholder="..."
                      ></textarea>
                    </div>

                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-tea-dark hover:bg-tea-green text-white font-bold py-4 rounded-xl transition shadow-lg dark:shadow-black/50 flex items-center justify-center transform active:scale-95 disabled:opacity-75 disabled:active:scale-100"
                    >
                      {isSubmitting ? (
                        <Loader2 className="animate-spin text-tea-gold mr-2" size={20} />
                      ) : null}
                      {t('contacts_page.form_submit')}
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success-message"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center justify-center text-center py-10 px-4"
                >
                  <div className="w-20 h-20 bg-tea-green/10 text-tea-dark dark:text-tea-light rounded-full flex items-center justify-center mb-6 shadow-inner">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1, type: "spring", stiffness: 150 }}
                    >
                      <Check className="w-10 h-10 text-tea-gold" />
                    </motion.div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-tea-dark dark:text-tea-light mb-4">
                    {t('contacts_page.form_success')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 max-w-sm mb-8 leading-relaxed">
                    {t('contacts_page.form_success_premium')}
                  </p>
                  
                  <button
                    onClick={() => setIsFormSubmitted(false)}
                    className="bg-tea-dark hover:bg-tea-green text-white font-bold py-3.5 px-8 rounded-xl transition shadow-md dark:shadow-black/40 hover:shadow-lg dark:shadow-black/50 active:scale-95"
                  >
                    {t('contacts_page.wholesale_modal_close')}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Map & Address Section with Navigator Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 bg-white dark:bg-[#23312B] rounded-3xl overflow-hidden shadow-lg dark:shadow-black/50 border border-gray-100 dark:border-[#3A5243]"
        >
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 p-8 md:p-10 bg-tea-light dark:bg-[#1A2421]/10 flex flex-col justify-center">
              <h2 className="text-2xl font-bold text-tea-dark dark:text-tea-light mb-4 flex items-center">
                <MapPin className="mr-3 text-tea-gold" />
                {t('contacts_page.map_title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                {t('contacts_page.address_text')}
              </p>
              
              <div className="bg-white dark:bg-[#23312B] p-4 rounded-xl border border-tea-gold/20 flex items-center mb-6 shadow-sm">
                <span className="w-3 h-3 rounded-full bg-green-500 mr-3 animate-pulse"></span>
                <span className="font-bold text-tea-dark dark:text-tea-light text-sm">Открыто прямо сейчас</span>
              </div>

              {/* Navigator Buttons */}
              <div className="flex flex-col gap-3">
                <a
                  href="https://yandex.ru/maps/?rtext=~41.332314,69.282928"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white dark:bg-[#23312B] hover:bg-gray-50 dark:bg-[#1A2421] border border-gray-200 dark:border-[#3A5243] text-gray-700 dark:text-gray-300 font-bold py-3 px-4 rounded-xl flex items-center justify-center transition shadow-sm hover:shadow active:scale-95 text-xs md:text-sm group"
                >
                  <Navigation className="w-4 h-4 mr-2 text-[#e62e2e] group-hover:scale-110 transition-transform" />
                  <span>{t('contacts_page.route_yandex')}</span>
                </a>
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=41.332314,69.282928"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white dark:bg-[#23312B] hover:bg-gray-50 dark:bg-[#1A2421] border border-gray-200 dark:border-[#3A5243] text-gray-700 dark:text-gray-300 font-bold py-3 px-4 rounded-xl flex items-center justify-center transition shadow-sm hover:shadow active:scale-95 text-xs md:text-sm group"
                >
                  <Compass className="w-4 h-4 mr-2 text-blue-500 group-hover:scale-110 transition-transform" />
                  <span>{t('contacts_page.route_google')}</span>
                </a>
              </div>
            </div>
            
            <div className="md:w-2/3 h-[420px]">
              <iframe 
                src="https://yandex.ru/map-widget/v1/?ll=69.282928%2C41.332314&z=16&pt=69.282928,41.332314,pm2rdm" 
                width="100%" 
                height="100%" 
                frameBorder="0" 
                allowFullScreen={true}
                title="Yandex Map"
                className="grayscale-[20%] contrast-[105%] hue-rotate-[-5deg]"
              ></iframe>
            </div>
          </div>
        </motion.div>

        {/* Interactive Showroom Carousel */}
        <div className="mt-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-tea-dark dark:text-tea-light mb-3">
              {t('contacts_page.showroom_title')}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              {t('contacts_page.showroom_subtitle')}
            </p>
          </div>
          
          <div className="relative overflow-hidden rounded-3xl shadow-xl dark:shadow-black/60 bg-white dark:bg-[#23312B] border border-gray-100 dark:border-[#3A5243] p-4 md:p-6 max-w-5xl mx-auto">
            {/* Carousel Container */}
            <div className="relative h-[280px] md:h-[500px] w-full overflow-hidden rounded-2xl bg-gray-950">
              <AnimatePresence initial={false} custom={carouselDirection}>
                <motion.img
                  key={currentSlide}
                  src={slides[currentSlide].image}
                  alt={slides[currentSlide].title}
                  custom={carouselDirection}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                  }}
                  className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
                />
              </AnimatePresence>
              
              {/* Shadow Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none z-10" />
              
              {/* Slide Info */}
              <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10 text-white z-10">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  <span className="inline-block px-3 py-1 bg-tea-gold text-tea-dark dark:text-tea-light text-xs font-bold rounded-full uppercase tracking-wider mb-2">
                    {slides[currentSlide].tag}
                  </span>
                  <h3 className="text-xl md:text-3xl font-bold mb-2">
                    {slides[currentSlide].title}
                  </h3>
                  <p className="text-white/80 text-xs md:text-base max-w-2xl leading-relaxed">
                    {slides[currentSlide].description}
                  </p>
                </motion.div>
              </div>

              {/* Arrow Buttons */}
              <button
                onClick={prevSlide}
                aria-label="Previous slide"
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white dark:bg-[#23312B]/30 hover:bg-tea-dark hover:text-tea-gold border border-white/50 backdrop-blur-md text-white flex items-center justify-center transition-all duration-300 shadow-md dark:shadow-black/40 active:scale-90 z-20"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={nextSlide}
                aria-label="Next slide"
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white dark:bg-[#23312B]/30 hover:bg-tea-dark hover:text-tea-gold border border-white/50 backdrop-blur-md text-white flex items-center justify-center transition-all duration-300 shadow-md dark:shadow-black/40 active:scale-90 z-20"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center gap-2 mt-4 md:mt-6">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCarouselDirection(idx > currentSlide ? 1 : -1);
                    setCurrentSlide(idx);
                  }}
                  className={`h-2 rounded-full transition-all duration-350 ${currentSlide === idx ? 'w-8 bg-tea-gold' : 'w-2 bg-gray-300 hover:bg-gray-400'}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Wholesale & Partners */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-tea-dark rounded-3xl p-8 md:p-12 shadow-xl dark:shadow-black/60 flex flex-col md:flex-row items-center justify-between text-white"
        >
          <div className="mb-6 md:mb-0 md:mr-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 flex items-center">
              <Briefcase className="mr-3 text-tea-gold" />
              {t('contacts_page.wholesale_title')}
            </h2>
            <p className="text-tea-light max-w-xl">
              {t('contacts_page.wholesale_desc')}
            </p>
          </div>
          <button 
            onClick={() => { setIsWholesaleModalOpen(true); setIsWholesaleSuccess(false); }}
            className="bg-tea-gold hover:bg-yellow-500 text-tea-dark dark:text-tea-light font-bold py-4 px-8 rounded-xl transition shadow-lg dark:shadow-black/50 flex items-center whitespace-nowrap"
          >
            <Mail className="mr-2" />
            {t('contacts_page.wholesale_email')}
          </button>
        </motion.div>

        {/* FAQ Section with smooth heights */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-tea-dark dark:text-tea-light mb-10">
            {t('contacts_page.faq_title')}
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-[#23312B] border border-gray-200 dark:border-[#3A5243] rounded-2xl overflow-hidden transition-all duration-300 hover:border-tea-gold/50"
              >
                <button 
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
                >
                  <span className="font-bold text-tea-dark dark:text-tea-light text-lg pr-4">{faq.q}</span>
                  <ChevronDown 
                    className={`text-tea-gold transition-transform duration-300 flex-shrink-0 ${openFaq === index ? 'rotate-180' : ''}`} 
                  />
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div className="px-6 pb-5 text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-[#3A5243] pt-4">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* Legal Info Toggle (Receipt Styling) */}
        <div className="mt-16 text-center border-t border-gray-200 dark:border-[#3A5243] pt-8 pb-10">
          <button 
            onClick={() => setShowLegal(!showLegal)}
            className="text-gray-400 hover:text-tea-dark dark:text-tea-light transition text-sm font-medium flex items-center justify-center mx-auto"
          >
            {t('contacts_page.legal_title')}
            <ChevronDown size={16} className={`ml-1 transition-transform ${showLegal ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence initial={false}>
            {showLegal && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ overflow: 'hidden' }}
                className="mt-6 text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line leading-relaxed bg-stone-50 border border-stone-200 p-8 rounded-2xl text-left font-mono max-w-md mx-auto shadow-inner relative"
              >
                {/* Decorative cut details at the top/bottom to simulate receipt */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-[linear-gradient(45deg,transparent_33.333%,#e5e7eb_33.333%,#e5e7eb_66.667%,transparent_66.667%)] bg-[length:12px_6px] bg-repeat-x" />
                
                <div className="flex justify-between border-b border-stone-200 pb-3 mb-4 font-bold text-tea-dark dark:text-tea-light uppercase text-xs tracking-wider">
                  <span>{t('contacts_page.legal_title')}</span>
                  <span>FATELEAF</span>
                </div>
                
                {t('contacts_page.legal_text')}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Wholesale Modal */}
      <AnimatePresence>
        {isWholesaleModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-[#23312B] rounded-3xl p-6 md:p-10 shadow-2xl w-full max-w-lg relative overflow-hidden"
            >
              <button 
                onClick={() => setIsWholesaleModalOpen(false)}
                className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 dark:text-gray-400 transition"
              >
                <X size={18} />
              </button>

              {isWholesaleSuccess ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-tea-dark dark:text-tea-light mb-4">
                    {t('contacts_page.wholesale_modal_success_title')}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-8 whitespace-pre-line leading-relaxed">
                    {t('contacts_page.wholesale_modal_success_desc')}
                  </p>
                  <button 
                    onClick={() => setIsWholesaleModalOpen(false)}
                    className="w-full bg-tea-dark hover:bg-tea-green text-white font-bold py-4 rounded-xl transition shadow-lg dark:shadow-black/50"
                  >
                    {t('contacts_page.wholesale_modal_close')}
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-tea-dark dark:text-tea-light mb-2">
                    {t('contacts_page.wholesale_modal_title')}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm">
                    {t('contacts_page.wholesale_modal_desc')}
                  </p>

                  <form onSubmit={handleWholesaleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t('contacts_page.wholesale_modal_name')}</label>
                      <input 
                        type="text" 
                        required
                        value={wholesaleForm.name}
                        onChange={(e) => setWholesaleForm({...wholesaleForm, name: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[#3A5243] focus:border-tea-gold focus:ring-2 focus:ring-tea-gold/20 outline-none transition bg-gray-50 dark:bg-[#1A2421]/50"
                        placeholder={t('contacts_page.wholesale_modal_name_placeholder')}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t('contacts_page.wholesale_modal_company')}</label>
                      <input 
                        type="text" 
                        required
                        value={wholesaleForm.company}
                        onChange={(e) => setWholesaleForm({...wholesaleForm, company: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[#3A5243] focus:border-tea-gold focus:ring-2 focus:ring-tea-gold/20 outline-none transition bg-gray-50 dark:bg-[#1A2421]/50"
                        placeholder={t('contacts_page.wholesale_modal_company_placeholder')}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t('contacts_page.wholesale_modal_phone')}</label>
                      <input 
                        type="tel" 
                        required
                        value={wholesaleForm.phone}
                        onChange={(e) => setWholesaleForm({...wholesaleForm, phone: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[#3A5243] focus:border-tea-gold focus:ring-2 focus:ring-tea-gold/20 outline-none transition bg-gray-50 dark:bg-[#1A2421]/50"
                        placeholder={t('contacts_page.wholesale_modal_phone_placeholder')}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t('contacts_page.wholesale_modal_email')}</label>
                      <input 
                        type="email" 
                        required
                        value={wholesaleForm.email}
                        onChange={(e) => setWholesaleForm({...wholesaleForm, email: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[#3A5243] focus:border-tea-gold focus:ring-2 focus:ring-tea-gold/20 outline-none transition bg-gray-50 dark:bg-[#1A2421]/50"
                        placeholder={t('contacts_page.wholesale_modal_email_placeholder')}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t('contacts_page.wholesale_modal_type')}</label>
                      <div className="relative">
                        <select 
                          value={wholesaleForm.type}
                          onChange={(e) => setWholesaleForm({...wholesaleForm, type: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[#3A5243] focus:border-tea-gold focus:ring-2 focus:ring-tea-gold/20 outline-none transition bg-gray-50 dark:bg-[#1A2421]/50 appearance-none text-tea-dark dark:text-tea-light font-medium"
                        >
                          <option value="restaurant">{t('contacts_page.wholesale_modal_type_restaurant')}</option>
                          <option value="retail">{t('contacts_page.wholesale_modal_type_retail')}</option>
                          <option value="hotel">{t('contacts_page.wholesale_modal_type_hotel')}</option>
                          <option value="other">{t('contacts_page.wholesale_modal_type_other')}</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-3.5 text-gray-400 pointer-events-none" size={18} />
                      </div>
                    </div>

                    <button 
                      type="submit"
                      disabled={isSubmittingWholesale}
                      className="w-full bg-tea-dark hover:bg-tea-green text-white font-bold py-4 rounded-xl transition shadow-lg dark:shadow-black/50 flex items-center justify-center transform active:scale-95 disabled:opacity-70 disabled:active:scale-100 mt-4"
                    >
                      {isSubmittingWholesale ? (
                        <Loader2 className="animate-spin text-tea-gold" size={24} />
                      ) : (
                        t('contacts_page.wholesale_modal_submit')
                      )}
                    </button>
                  </form>
                  
                  <p className="text-center text-xs text-gray-400 mt-6">
                    {t('contacts_page.wholesale_modal_or_write')}
                    <a href="mailto:opt@fateleaf.com" className="text-tea-gold hover:underline font-medium">opt@fateleaf.com</a>
                  </p>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Contacts;

