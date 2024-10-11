import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/utils/apiClient';
import { updateGem } from '@/store/user'

export const buyItem = createAsyncThunk(
  'shop/buyItem',
  async ({ itemType }, thunkAPI) => {
    try {
      const apiUrl = '/store/item/buy'

      const response = await apiClient.post(apiUrl, { itemType }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      if (itemType === 1) {
        // Gem 업데이트
        thunkAPI.dispatch(updateGem(-600));
      } else if (itemType === 2) {
        thunkAPI.dispatch(updateGem(-400));
      } else if (itemType === 3) {
        thunkAPI.dispatch(updateGem(-900));
      }
      return response.data;
    } catch (error) {
      // console.log(error)

      return thunkAPI.rejectWithValue(error.response?.data || 'Server Error');
    }
  }
);

// Initial state
const initialState = {
  loading: false,
  error: null,
};

// Redux slice
const shopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(buyItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(buyItem.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(buyItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      });
  },
});

export const {  } = shopSlice.actions;

export default shopSlice.reducer;