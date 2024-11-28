import { configureStore } from '@reduxjs/toolkit';
import assetsReducer from './slices/assetsSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    assets: assetsReducer,
    auth: authReducer,
  },
}); 