import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { assetService } from '../../services/assetService';

export const fetchAssets = createAsyncThunk(
  'assets/fetchAssets',
  async (_, { rejectWithValue }) => {
    try {
      const response = await assetService.getAssets();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const assetsSlice = createSlice({
  name: 'assets',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssets.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAssets.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchAssets.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default assetsSlice.reducer; 