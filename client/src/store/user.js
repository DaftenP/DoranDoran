import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/utils/apiClient';

// 생일 업데이트를 위한 비동기 액션 생성자
export const updateBirthday = createAsyncThunk(
  'user/updateBirthday',
  async (birthday, thunkAPI) => {
    try {
      const apiUrl = '/my-page/birthday';
      const response = await apiClient.patch(apiUrl, { birthday }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      // console.log(error);
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// 닉네임 업데이트를 위한 비동기 액션 생성자
export const updateNickname = createAsyncThunk(
  'user/updateNickname',
  async (nickname, thunkAPI) => {
    try {
      const apiUrl = '/my-page/nickname';
      const response = await apiClient.patch(apiUrl, { nickname }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      // console.log(error);
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// 사용자 데이터를 가져오기 위한 비동기 액션 생성자
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
      // console.log(error)
      return thunkAPI.rejectWithValue(error.response?.data || 'Server Error');
    }
  }
);

// 경험치와 젬을 업데이트하기 위한 비동기 액션 생성자
export const expGemUpdate = createAsyncThunk(
  'user/expGemUpdate',
  async ({ gem, xp }, thunkAPI) => {
    try {
      const apiUrl = '/rank/xp_gem'
      const response = await apiClient.patch(apiUrl, { gem, xp }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      // console.log(error)
      return thunkAPI.rejectWithValue(error.response?.data || 'Server Error');
    }
  }
);

// 초기 상태 정의
const initialState = {
  tutorLimit: 0,
  profile: {
    nickname: '',
    email: '',
    birthday: '',
    color: 1,
    equipment: 1,
    background: 1,
    psize: 0, // 전체 문제 수
  },
  status: {
    xp: 0,
    gem: 0,
    rank: 1000,
  },
  mission: {
    status: '', // 주간 테스크 상태
    dailyStatus: 0, // 일일 테스크 상태
  },
}

// Redux 슬라이스 생성
const userSlice = createSlice({
  name: 'user',
  isChange: false,
  initialState,
  reducers: {
    updateGem: (state, action) => {
      state.status.gem += action.payload;
    },
    updateXp: (state, action) => {
      state.status.xp += action.payload;
    },
    updateTutorLimit: (state, action) => {
      state.tutorLimit += action.payload;
    },
    setTutorLimit: (state, action) => {
      state.tutorLimit = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // 사용자 데이터 가져오기 관련 리듀서
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
      })
      // 경험치와 젬 업데이트 관련 리듀서
      .addCase(expGemUpdate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(expGemUpdate.fulfilled, (state, action) => {
        state.loading = false;
        state.status.gem += action.payload.gem
        state.status.xp += action.payload.xp
      })
      .addCase(expGemUpdate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      })
      // 닉네임 업데이트 관련 리듀서
      .addCase(updateNickname.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateNickname.fulfilled, (state, action) => {
        state.loading = false;
        state.profile.nickname = action.payload.nickname;
      })
      .addCase(updateNickname.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update nickname';
      })
      // 생일 업데이트 관련 리듀서
      .addCase(updateBirthday.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBirthday.fulfilled, (state, action) => {
        state.loading = false;
        state.profile.birthday = action.payload.birthday;
      })
      .addCase(updateBirthday.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update birthday';
      });
  },
});

export const { updateGem, updateXp, updateTutorLimit, setTutorLimit } = userSlice.actions;

export default userSlice.reducer;