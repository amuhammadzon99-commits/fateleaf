import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Edit, Trash2, Plus, Search, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

const AdminProducts = () => {
  const { t, i18n } = useTranslation();
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [filterCategory, setFilterCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [oldPrice, setOldPrice] = useState('');
  const [weight, setWeight] = useState('50g');
  const [badge, setBadge] = useState('none');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('65f1234567890abcdef12345'); // mock category id
  const [stock, setStock] = useState(0);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`/api/products?keyword=${keyword}&pageNumber=${page}&category=${filterCategory}`);
      setProducts(data.products);
      setPages(data.pages);
      setPage(data.page);
    } catch (error) {
      toast.error(t('adminProducts.errorLoad'));
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [keyword, page, filterCategory]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);
    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      const { data } = await axios.post('/api/upload', formData, config);
      setImage(data.image);
      setUploading(false);
      toast.success(t('adminProducts.imageLoaded'));
    } catch (error) {
      setUploading(false);
      toast.error(t('adminProducts.errorImage'));
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
    const productData = { name, price, oldPrice: oldPrice || undefined, weight, badge, image, category, stock, description };

    try {
      if (editMode) {
        await axios.put(`/api/products/${currentId}`, productData, config);
        toast.success(t('adminProducts.productUpdated'));
      } else {
        await axios.post('/api/products', productData, config);
        toast.success(t('adminProducts.productAdded'));
      }
      setIsModalOpen(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || t('adminProducts.errorSave'));
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm(t('adminProducts.deleteConfirm'))) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(`/api/products/${id}`, config);
        toast.success(t('adminProducts.productDeleted'));
        fetchProducts();
      } catch (error) {
        toast.error(t('adminProducts.errorDelete'));
      }
    }
  };

  const openEditModal = (product) => {
    setEditMode(true);
    setCurrentId(product._id);
    setName(product.name);
    setPrice(product.price);
    setOldPrice(product.oldPrice || '');
    setWeight(product.weight || '50g');
    setBadge(product.badge || 'none');
    setImage(product.images?.[0] || '');
    setCategory(product.category);
    setStock(product.stock);
    setDescription(product.description);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditMode(false);
    setCurrentId(null);
    setName('');
    setPrice(0);
    setOldPrice('');
    setWeight('50g');
    setBadge('none');
    setImage('');
    setCategory('65f1234567890abcdef12345');
    setStock(0);
    setDescription('');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-tea-dark dark:text-tea-light">{t('adminProducts.title')}</h1>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-tea-gold hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg flex items-center transition"
        >
          <Plus size={20} className="mr-2" /> {t('adminProducts.addProduct')}
        </button>
      </div>

      <div className="bg-white dark:bg-[#23312B] p-6 rounded-xl shadow-md dark:shadow-black/40 mb-8">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <input 
              type="text" 
              placeholder={t('adminProducts.searchPlaceholder')} 
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-tea-gold focus:outline-none"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
          <select 
            value={filterCategory} 
            onChange={(e) => { setFilterCategory(e.target.value); setPage(1); }} 
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-tea-gold focus:outline-none"
          >
            <option value="">{t('adminProducts.allCategories')}</option>
            <option value="Зеленый чай">{t('adminProducts.catGreen')}</option>
            <option value="Черный чай">{t('adminProducts.catBlack')}</option>
            <option value="Травяные сборы">{t('adminProducts.catHerbal')}</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="bg-tea-light dark:bg-[#1A2421] border-b border-tea-green/30 dark:border-[#3A5243]">
                <th className="p-3 font-bold text-tea-dark dark:text-tea-light">{t('adminProducts.colId')}</th>
                <th className="p-3 font-bold text-tea-dark dark:text-tea-light">{t('adminProducts.colPhoto')}</th>
                <th className="p-3 font-bold text-tea-dark dark:text-tea-light">{t('adminProducts.colName')}</th>
                <th className="p-3 font-bold text-tea-dark dark:text-tea-light">{t('adminProducts.colCategory')}</th>
                <th className="p-3 font-bold text-tea-dark dark:text-tea-light">{t('adminProducts.colPrice')}</th>
                <th className="p-3 font-bold text-tea-dark dark:text-tea-light">{t('adminProducts.colStock')}</th>
                <th className="p-3 font-bold text-tea-dark dark:text-tea-light">{t('adminProducts.colStatus')}</th>
                <th className="p-3 font-bold text-tea-dark dark:text-tea-light text-right">{t('adminProducts.colActions')}</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-b hover:bg-gray-50 dark:bg-[#1A2421] transition">
                  <td className="p-3 text-sm text-gray-500 dark:text-gray-400">{product._id.substring(0, 8)}...</td>
                  <td className="p-3">
                    <img src={product.images?.[0] || '/placeholder.svg'} alt={product.name} className="w-12 h-12 rounded object-cover" />
                  </td>
                  <td className="p-3 font-bold">{product.name}</td>
                  <td className="p-3 text-sm text-gray-600 dark:text-gray-400">ID: {product.category?.substring(0, 5)}...</td>
                  <td className="p-3">{product.price} ₽</td>
                  <td className="p-3">{product.stock} {t('adminProducts.pcs')}</td>
                  <td className="p-3">
                    {product.stock > 0 
                      ? <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold">{t('adminProducts.inStock')}</span>
                      : <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-bold">{t('adminProducts.outOfStock')}</span>
                    }
                  </td>
                  <td className="p-3 text-right">
                    <button onClick={() => openEditModal(product)} className="text-blue-500 hover:text-blue-700 mx-2">
                      <Edit size={20} />
                    </button>
                    <button onClick={() => deleteHandler(product._id)} className="text-red-500 hover:text-red-700">
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-6 text-center text-gray-500 dark:text-gray-400">{t('adminProducts.notFound')}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            {[...Array(pages).keys()].map((x) => (
              <button
                key={x + 1}
                onClick={() => setPage(x + 1)}
                className={`px-4 py-2 rounded-lg font-bold ${x + 1 === page ? 'bg-tea-gold text-white' : 'bg-gray-200 text-gray-700 dark:text-gray-300 hover:bg-gray-300'}`}
              >
                {x + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white dark:bg-[#23312B] rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-tea-dark dark:text-tea-light">{editMode ? t('adminProducts.editTitle') : t('adminProducts.addProduct')}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:text-gray-300">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={submitHandler} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('adminProducts.nameLabel')}</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-tea-gold outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('adminProducts.priceLabel')}</label>
                  <input type="number" required value={price} onChange={(e) => setPrice(e.target.value)} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-tea-gold outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('adminProducts.stockLabel')}</label>
                  <input type="number" required value={stock} onChange={(e) => setStock(e.target.value)} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-tea-gold outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('adminProducts.categoryLabel')}</label>
                  <input type="text" required value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-tea-gold outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('adminProducts.oldPriceLabel')}</label>
                  <input type="number" value={oldPrice} onChange={(e) => setOldPrice(e.target.value)} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-tea-gold outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('adminProducts.weightLabel')}</label>
                  <input type="text" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-tea-gold outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('adminProducts.badgeLabel')}</label>
                  <select value={badge} onChange={(e) => setBadge(e.target.value)} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-tea-gold outline-none">
                    <option value="none">{t('adminProducts.badgeNone')}</option>
                    <option value="new">{t('adminProducts.badgeNew')}</option>
                    <option value="sale">{t('adminProducts.badgeSale')}</option>
                    <option value="hit">{t('adminProducts.badgeHit')}</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('adminProducts.descLabel')}</label>
                <textarea rows="3" required value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-tea-gold outline-none"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('adminProducts.imageLabel')}</label>
                <input type="text" value={image} onChange={(e) => setImage(e.target.value)} placeholder="URL изображения" className="w-full border rounded-lg p-2 mb-2 focus:ring-2 focus:ring-tea-gold outline-none" />
                <input type="file" onChange={uploadFileHandler} className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-tea-light dark:bg-[#1A2421] file:text-tea-dark dark:text-tea-light hover:file:bg-tea-green transition" />
                {uploading && <p className="text-sm text-tea-gold mt-1">{t('adminProducts.uploading')}</p>}
              </div>
              <div className="flex justify-end pt-4 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-200 hover:bg-gray-300 text-gray-800 dark:text-gray-200 font-bold py-2 px-6 rounded-lg mr-4 transition">{t('adminProducts.cancel')}</button>
                <button type="submit" className="bg-tea-dark hover:bg-tea-green text-white font-bold py-2 px-6 rounded-lg transition">
                  {editMode ? t('adminProducts.save') : t('adminProducts.addProduct')}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
</motion.div>
  );
};

export default AdminProducts;
