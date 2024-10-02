import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchUserData = createAsyncThunk(
  'user/fetchUserData',
  async (_, thunkAPI) => {

    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/my-page/user`

      const response = await axios.get(apiUrl, {
        headers: {
          'Content-Type': 'application/json',  // FormData 사용 시 헤더 설정
        },
        withCredentials: true,
      });
      console.log(response.data)

      return response.data; // 서버에서 받은 chatMessages 데이터를 반환
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
    birth: '',
    character: '',
    avatar: '',
    voice: '',
  },
  status: {
    xp: '',
    credit: '',
    rank: '',
  },
  mission: {
    weekTask: '',
    dailyTask: '',
  } 
}

// Redux slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {

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
          nickname: action.payload.nickname,
          email: action.payload.email,
          birth: action.payload.birth,
          character: action.payload.character,
          avatar: action.payload.avatar,
          voice: action.payload.voice,
        };
        state.status = {
          xp: action.payload.xp,
          credit: action.payload.credit,
          rank: action.payload.rank,
        };
        state.mission = {
          weekTask: action.payload.weekTask,
          dailyTask: action.payload.dailyTask,
        };
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      });
  },
});

export const { } = userSlice.actions;

export default userSlice.reducer;