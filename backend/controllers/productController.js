import Product from '../models/Product.js';
import { logAudit } from '../utils/auditLogger.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;
  const searchQuery = req.query.search || req.query.keyword;
  const keyword = searchQuery
    ? { name: { $regex: searchQuery, $options: 'i' } }
    : {};

  const activeFilter = req.query.active === 'true' ? { stock: { $gt: 0 } } : {};
  const categoryFilter = req.query.category ? { category: req.query.category } : {};
  const query = { ...keyword, ...activeFilter, ...categoryFilter };

  const count = await Product.countDocuments(query);
  const products = await Product.find(query)
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Товар не найден' });
    }
  } catch (error) {
    res.status(404).json({ message: 'Неверный ID товара' });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  const { name, price, oldPrice, weight, badge, description, image, category, stock } = req.body;

  const product = new Product({
    name,
    price,
    oldPrice,
    weight,
    badge,
    description,
    images: [image],
    category,
    stock,
  });

  const createdProduct = await product.save();

  await logAudit(
    req,
    'Создание товара',
    'Товары',
    `Создан новый товар "${name}"`,
    { after: createdProduct.toObject() }
  );

  res.status(201).json(createdProduct);
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  const { name, price, oldPrice, weight, badge, description, image, category, stock } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const beforeState = product.toObject();

    product.name = name;
    product.price = price;
    if (oldPrice !== undefined) product.oldPrice = oldPrice;
    if (weight) product.weight = weight;
    if (badge) product.badge = badge;
    product.description = description;
    if (image && product.images[0] !== image) {
      product.images = [image];
    }
    product.category = category;
    product.stock = stock;

    const updatedProduct = await product.save();

    let detailsStr = `Обновлен товар "${name}"`;
    if (beforeState.price !== price) {
      detailsStr = `Изменена цена товара "${name}" с ${beforeState.price} на ${price}`;
    } else if (beforeState.stock !== stock) {
      detailsStr = `Изменение остатков товара "${name}": было ${beforeState.stock}, стало ${stock}`;
    }

    await logAudit(
      req,
      'Обновление товара',
      'Товары',
      detailsStr,
      { before: beforeState, after: updatedProduct.toObject() }
    );

    res.json(updatedProduct);
  } else {
    res.status(404).json({ message: 'Товар не найден' });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    if (product.images && product.images.length > 0 && product.images[0].startsWith('/uploads/')) {
      // Intentionally not deleting the image file so it can be reused
    }
    await Product.deleteOne({ _id: product._id });

    await logAudit(
      req,
      'Удаление товара',
      'Товары',
      `Удален товар "${product.name}"`,
      { before: product.toObject() }
    );

    res.json({ message: 'Товар удален' });
  } else {
    res.status(404).json({ message: 'Товар не найден' });
  }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Public
export const createProductReview = async (req, res) => {
  const { rating, comment, name, image } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const review = {
      name,
      rating: Number(rating),
      comment,
      image,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Отзыв добавлен' });
  } else {
    res.status(404).json({ message: 'Товар не найден' });
  }
};
