import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const BlogPostModal = ({ isOpen, onClose, post }) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!post) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-8"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="relative w-full max-w-3xl bg-white dark:bg-[#23312B] rounded-[24px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
          >
            {/* Header Image */}
            <div className="relative h-64 md:h-80 w-full shrink-0">
              <img src={post.img} alt={post.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              <button
                onClick={onClose}
                className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full bg-white dark:bg-[#23312B]/20 hover:bg-white dark:bg-[#23312B]/40 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-colors"
              >
                <X size={20} />
              </button>

              <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 md:right-8">
                <div className="inline-block bg-white dark:bg-[#23312B]/20 backdrop-blur-md text-white text-[11px] font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider">
                  {post.tag}
                </div>
                <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight">
                  {post.title}
                </h2>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 md:p-8 overflow-y-auto">
              <div className="text-gray-700 dark:text-gray-300 text-base md:text-lg">
                {post.content.map((paragraph, idx) => (
                  <p key={idx} className="mb-5 leading-relaxed font-light">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
            
            {/* Footer */}
            <div className="px-6 py-5 md:px-8 md:py-6 border-t border-gray-100 dark:border-[#3A5243] bg-gray-50 dark:bg-[#1A2421] flex justify-between items-center shrink-0">
              <span className="text-gray-400 text-sm font-medium">{post.date || 'Сегодня'}</span>
              <button onClick={onClose} className="px-8 py-3 bg-tea-gold hover:bg-yellow-500 text-white rounded-full font-bold transition transform hover:scale-105 active:scale-95 shadow-md dark:shadow-black/40">
                Понятно
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BlogPostModal;
