import { useState } from 'react';
import axios from 'axios';
import { Star, Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

const ProductReviews = ({ product, onReviewSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/products/${product._id}/reviews`, {
        rating,
        comment,
        name: name || userInfo?.name || 'Анонимный ценитель',
        image,
      });
      toast.success('Отзыв успешно добавлен!');
      setRating(5);
      setComment('');
      setImage('');
      setShowForm(false);
      if (onReviewSubmitted) onReviewSubmitted();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Ошибка при добавлении отзыва');
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const { data } = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setImage(data.image);
      setUploading(false);
      toast.success('Фото загружено');
    } catch (error) {
      setUploading(false);
      toast.error('Ошибка загрузки фото');
    }
  };

  const hasReviews = product.reviews && product.reviews.length > 0;
  
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <span className="text-4xl font-bold text-tea-dark dark:text-tea-light">{product.rating ? product.rating.toFixed(1) : 0}</span>
          <div className="text-yellow-400 flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={20} fill={i < Math.floor(product.rating || 0) ? "currentColor" : "none"} />
            ))}
          </div>
          <span className="text-gray-500 dark:text-gray-400">{product.numReviews || 0} отзывов</span>
        </div>
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="bg-tea-dark hover:bg-tea-gold text-white font-bold py-2 px-6 rounded-xl transition"
          >
            Оставить отзыв
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={submitHandler} className="bg-gray-50 dark:bg-[#1A2421] p-6 rounded-2xl mb-8 border border-gray-100 dark:border-[#3A5243]">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold text-lg text-tea-dark dark:text-tea-light">Новый отзыв</h4>
            <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Оценка</label>
              <select 
                value={rating} 
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full rounded-xl border-gray-300 shadow-sm focus:border-tea-gold focus:ring-tea-gold dark:bg-[#23312B] dark:border-[#3A5243] p-2.5"
              >
                <option value="5">5 - Отлично</option>
                <option value="4">4 - Хорошо</option>
                <option value="3">3 - Нормально</option>
                <option value="2">2 - Плохо</option>
                <option value="1">1 - Ужасно</option>
              </select>
            </div>
            {!userInfo && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Имя</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Как вас зовут?"
                  className="w-full rounded-xl border-gray-300 shadow-sm focus:border-tea-gold focus:ring-tea-gold dark:bg-[#23312B] dark:border-[#3A5243] p-2.5"
                />
              </div>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Комментарий</label>
            <textarea 
              rows="3" 
              required
              value={comment} 
              onChange={(e) => setComment(e.target.value)}
              placeholder="Расскажите о впечатлениях..."
              className="w-full rounded-xl border-gray-300 shadow-sm focus:border-tea-gold focus:ring-tea-gold dark:bg-[#23312B] dark:border-[#3A5243] p-2.5"
            ></textarea>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Фотография (опционально)</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center justify-center bg-white dark:bg-[#23312B] border border-gray-300 dark:border-[#3A5243] rounded-xl px-4 py-2 cursor-pointer hover:bg-gray-50 transition">
                <Upload size={18} className="mr-2 text-tea-gold" />
                <span className="text-sm">Выбрать фото</span>
                <input type="file" onChange={uploadFileHandler} className="hidden" accept="image/*" />
              </label>
              {uploading && <span className="text-sm text-gray-500 animate-pulse">Загрузка...</span>}
              {image && (
                <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-tea-gold">
                  <img src={image} alt="Preview" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setImage('')} className="absolute top-0 right-0 bg-red-500 text-white rounded-bl-lg p-0.5">
                    <X size={12} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <button type="submit" className="w-full bg-tea-dark hover:bg-tea-gold text-white font-bold py-3 rounded-xl transition">
            Опубликовать отзыв
          </button>
        </form>
      )}

      {/* Reviews List */}
      {!hasReviews ? (
        <div className="text-center py-10 text-gray-500">
          Пока нет отзывов. Станьте первым, кто оценит этот чай!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {product.reviews.map((review) => (
            <div key={review._id} className="border border-gray-100 dark:border-[#3A5243] rounded-xl p-5 hover:shadow-md dark:shadow-black/40 transition bg-white dark:bg-[#23312B]">
              <div className="flex justify-between mb-2">
                <div className="font-bold text-tea-dark dark:text-tea-light flex items-center">
                  <div className="w-8 h-8 rounded-full bg-tea-light/30 flex items-center justify-center text-tea-gold mr-2">
                    {review.name.charAt(0).toUpperCase()}
                  </div>
                  {review.name}
                </div>
                <div className="text-yellow-400 flex items-center">
                  <span className="text-sm font-bold mr-1 text-gray-700 dark:text-gray-300">{review.rating}</span>
                  <Star size={14} fill="currentColor" />
                </div>
              </div>
              <div className="text-xs text-gray-400 mb-3">{review.createdAt?.substring(0, 10) || 'Недавно'}</div>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                {review.comment}
              </p>
              {review.image && (
                <div className="mt-2 h-32 w-32 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-800 cursor-pointer hover:opacity-90 transition">
                  <img src={review.image} alt="Review photo" className="w-full h-full object-cover" onClick={() => window.open(review.image, '_blank')} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
