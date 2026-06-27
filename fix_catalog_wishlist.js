const fs = require('fs');
const path = require('path');

const catalogPath = path.join(__dirname, 'frontend', 'src', 'pages', 'Catalog.jsx');
let content = fs.readFileSync(catalogPath, 'utf8');

// Update imports
content = content.replace(
  "import { useDispatch } from 'react-redux';",
  "import { useDispatch, useSelector } from 'react-redux';"
);
content = content.replace(
  "import { ShoppingCart, Search } from 'lucide-react';",
  "import { ShoppingCart, Search, Heart } from 'lucide-react';\nimport { toggleWishlistItem } from '../store/wishlistSlice';"
);

// Add useSelector and handler inside component
content = content.replace(
  "const dispatch = useDispatch();",
  `const dispatch = useDispatch();
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  const handleWishlistToggle = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleWishlistItem(product));
    const isWishlisted = wishlistItems.some((i) => i._id === product._id);
    if (isWishlisted) {
      toast(t('wishlist.removed_toast'), { icon: '🗑️' });
    } else {
      toast.success(t('wishlist.added_toast'), { icon: '🍃', style: { border: '1px solid #71b280', color: '#1a2e21' } });
    }
  };`
);

// Replace the SVG with Heart component
const oldSvgButton = `<button className="absolute top-7 right-7 bg-white dark:bg-[#23312B]/80 backdrop-blur-sm p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-white dark:bg-[#23312B] shadow-sm transition z-10">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
              </button>`;
              
const newButton = `<button 
                onClick={(e) => handleWishlistToggle(e, product)} 
                className="absolute top-7 right-7 bg-white dark:bg-[#23312B]/80 backdrop-blur-sm p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-white dark:bg-[#23312B] shadow-sm transition z-10"
              >
                <Heart 
                  size={20} 
                  fill={wishlistItems.some(i => i._id === product._id) ? "currentColor" : "none"} 
                  className={wishlistItems.some(i => i._id === product._id) ? "text-red-500" : ""} 
                />
              </button>`;

if (content.includes(oldSvgButton)) {
  content = content.replace(oldSvgButton, newButton);
  fs.writeFileSync(catalogPath, content, 'utf8');
  console.log('Catalog.jsx successfully updated');
} else {
  console.error('Could not find the SVG button in Catalog.jsx. Please check manually.');
}
