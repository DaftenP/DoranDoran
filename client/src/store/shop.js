import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/utils/apiClient';
import { updateColor, updateEquipment } from '@/store/user'

export const buyItem = createAsyncThunk(
  'shop/buyItem',
  async ({ itemType, itemId }, thunkAPI) => {
    try {
      const apiUrl = '/store/item/buy'
      console.log(itemType, itemId)

      const response = await apiClient.post(apiUrl, { itemType, itemId }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      if (itemType === 1) {
        // Color 업데이트
        thunkAPI.dispatch(updateColor(itemId)); // Color에 itemId를 넣음
      } else if (itemType === 2) {
        // Equipment 업데이트
        thunkAPI.dispatch(updateEquipment(itemId)); // Equipment에 itemId를 넣음
      }

      // 서버에서 받은 chatMessages 데이터를 반환
      return response.data;
    } catch (error) {
      console.log(error)

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