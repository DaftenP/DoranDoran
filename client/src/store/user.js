import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/utils/apiClient';

export const fetchUserData = createAsyncThunk(
  'user/fetchUserData',
  async (_, thunkAPI) => {

    try {
      const apiUrl = '/my-page/user'

      const response = await apiClient.get(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      console.log(error)
      return thunkAPI.rejectWithValue(error.response?.data || 'Server Error');
    }
  }
);

// Initial state
const initialState = {
  profile: {
    nickname: '',
    email: '',
    birthday: '',
    color: '',
    equipment: '',
    background: '',
    // 전체 문제
    psize: 0,
  },
  status: {
    xp: 0,
    gem: 0,
    rank: 0,
  },
  mission: {
    // 주간 테스크 상태
    status: '',
    // 일일 테스크 상태
    dailyStatus: 0,
  }
}

// Redux slice
const userSlice = createSlice({
  name: 'user',
  isChange: false,
  initialState,
  reducers: {
    updateColor: (state, action) => {
      state.profile.color = action.payload;
    },
    updateEquipment: (state, action) => {
      state.profile.equipment = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = {
          nickname: action.payload.data.nickname,
          email: action.payload.data.email,
          birthday: action.payload.data.birthday,
          color: action.payload.data.color,
          equipment: action.payload.data.equipment,
          background: action.payload.data.background,
          psize: action.payload.data.psize,
        };
        state.status = {
          xp: action.payload.data.xp,
          gem: action.payload.data.gem,
          rank: action.payload.data.rank,
        };
        state.mission = {
          status: action.payload.data.status,
          dailyStatus: action.payload.data.dailyStatus,
        };
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      });
  },
});

export const { updateColor, updateEquipment } = userSlice.actions;

export default userSlice.reducer;