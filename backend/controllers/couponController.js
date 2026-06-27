import Coupon from '../models/Coupon.js';

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin
export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a coupon
// @route   POST /api/coupons
// @access  Private/Admin
export const createCoupon = async (req, res) => {
  try {
    const { code, discountType, discountValue, expiresAt } = req.body;
    
    const couponExists = await Coupon.findOne({ code: code.toUpperCase() });
    if (couponExists) {
      return res.status(400).json({ message: 'Купон с таким кодом уже существует' });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      discountType,
      discountValue,
      expiresAt
    });
    
    res.status(201).json(coupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a coupon
// @route   PUT /api/coupons/:id
// @access  Private/Admin
export const updateCoupon = async (req, res) => {
  try {
    const { code, discountType, discountValue, expiresAt, isActive } = req.body;
    
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: 'Купон не найден' });
    }

    coupon.code = code?.toUpperCase() || coupon.code;
    coupon.discountType = discountType || coupon.discountType;
    coupon.discountValue = discountValue || coupon.discountValue;
    coupon.expiresAt = expiresAt || coupon.expiresAt;
    if (isActive !== undefined) coupon.isActive = isActive;

    const updatedCoupon = await coupon.save();
    res.json(updatedCoupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: 'Купон не найден' });
    }
    await coupon.deleteOne();
    res.json({ message: 'Купон удален' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Validate a coupon
// @route   POST /api/coupons/validate
// @access  Private
export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ message: 'Введите код купона' });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    
    if (!coupon) {
      return res.status(404).json({ message: 'Неверный промокод' });
    }

    if (!coupon.isActive) {
      return res.status(400).json({ message: 'Этот промокод больше не активен' });
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return res.status(400).json({ message: 'Срок действия промокода истек' });
    }

    res.json({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
