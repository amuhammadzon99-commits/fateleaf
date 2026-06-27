import { createSlice } from '@reduxjs/toolkit';

const itemsFromStorage = localStorage.getItem('wishlistItems')
  ? JSON.parse(localStorage.getItem('wishlistItems'))
  : [];

const initialState = {
  items: itemsFromStorage,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlistItem: (state, action) => {
      const item = action.payload;
      const existItemIndex = state.items.findIndex((x) => x._id === item._id);

      if (existItemIndex >= 0) {
        // If exists, remove it
        state.items.splice(existItemIndex, 1);
      } else {
        // If not, add it
        state.items.push(item);
      }
      localStorage.setItem('wishlistItems', JSON.stringify(state.items));
    },
    removeWishlistItem: (state, action) => {
      state.items = state.items.filter((x) => x._id !== action.payload);
      localStorage.setItem('wishlistItems', JSON.stringify(state.items));
    },
  },
});

export const { toggleWishlistItem, removeWishlistItem } = wishlistSlice.actions;
export default wishlistSlice.reducer;
