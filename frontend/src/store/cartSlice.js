import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
  },
  reducers: {
    addToCart: (state, action) => {
      const item = state.items.find((i) => i._id === action.payload._id);
      if (item) {
        item.qty += action.payload.qty;
      } else {
        state.items.push(action.payload);
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i._id !== action.payload);
    },
    updateQty: (state, action) => {
      const item = state.items.find((i) => i._id === action.payload.id);
      if (item) {
        item.qty = action.payload.qty;
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQty, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
