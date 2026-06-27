/**
 * Helper utility to return high-quality product images.
 * Since the local mock folder '/images/products/*' is not packaged in the repository,
 * this function dynamically maps the seeded product names and categories to beautiful,
 * high-resolution tea images from Unsplash.
 */
export const getProductImage = (product) => {
  if (!product) return '/placeholder.svg';
  
  const img = product.images?.[0];
  
  // If the image is a custom upload (e.g. from the admin panel), use it directly
  if (img && img.startsWith('/uploads/')) {
    return img;
  }
  
  const name = product.name?.toLowerCase() || '';
  const category = product.category?.toLowerCase() || '';
  
  // 1. Specific product name matches
  if (name.includes('matcha') || name.includes('матча')) {
    return 'https://images.unsplash.com/photo-1582793988951-9aed5509eb97?q=80&w=600&auto=format&fit=crop';
  }
  if (name.includes('jasmine') || name.includes('жасмин')) {
    return 'https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?q=80&w=600&auto=format&fit=crop';
  }
  if (name.includes('earl grey') || name.includes('эрл грей')) {
    return 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=600&auto=format&fit=crop';
  }
  if (name.includes('puer') || name.includes('пуэр')) {
    return 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=600&auto=format&fit=crop';
  }
  if (name.includes('da hun pao') || name.includes('да хун пао')) {
    return 'https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?q=80&w=600&auto=format&fit=crop';
  }
  if (name.includes('needles') || name.includes('иглы')) {
    return 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=600&auto=format&fit=crop';
  }
  if (name.includes('harmony') || name.includes('гармония') || name.includes('набор') || name.includes('kit')) {
    return 'https://images.unsplash.com/photo-1515696955266-4f67e13219e8?q=80&w=600&auto=format&fit=crop';
  }
  if (name.includes('исин') || name.includes('yixing') || name.includes('чайник') || name.includes('типод') || name.includes('венчик') || name.includes('chasen')) {
    return 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600&auto=format&fit=crop';
  }
  
  // 2. Category-based matches
  if (category.includes('зелен') || category.includes('green')) {
    return 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?q=80&w=600&auto=format&fit=crop';
  }
  if (category.includes('черн') || category.includes('black')) {
    return 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=600&auto=format&fit=crop';
  }
  if (category.includes('улун') || category.includes('oolong') || category.includes('puer')) {
    return 'https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?q=80&w=600&auto=format&fit=crop';
  }
  if (category.includes('трав') || category.includes('herb') || category.includes('сбор')) {
    return 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=600&auto=format&fit=crop';
  }
  if (category.includes('аксессуар') || category.includes('access')) {
    return 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600&auto=format&fit=crop';
  }
  
  // 3. Fallback
  return 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600&auto=format&fit=crop';
};
