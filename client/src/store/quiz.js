import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


export const fetchStageAll = createAsyncThunk(
  'stageAll/fetchStageAll', 
  async (_, thunkAPI) => {

    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/quiz/stage/all`
      const response = await axios.get(apiUrl); 
      return response.data; // API에서 반환되는 데이터를 리턴

    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error.response?.data || 'Server Error');
    }
  }
);

export const fetchStageDetail = createAsyncThunk(
  'stageDetail/fetchStageDetail', 
  async (stageId, thunkAPI) => {
    
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/quiz/stage/${stageId}`
      const response = await axios.get(apiUrl); 
      return response.data; // API에서 반환되는 데이터를 리턴

    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error.response?.data || 'Server Error');
    }
  }
);

// Initial state
const initialState = {
  stage: [
    {
      "id": 2,
      "order": 1,
      "stageName": "test2"
    },
    {
      "id": 1,
      "order": 2,
      "stageName": "test1"
    }
  ],           // 스테이지 데이터를 저장할 배열
  message: '',        // 서버로부터의 메시지
  timestamp: '',      // 요청 완료 시간
  loading: false,     // 요청이 진행 중인지 나타내는 상태
  error: null,        // 에러 발생 시 에러 메시지 저장

  stageDetail: {      // /quiz/stage/{stageId} 데이터를 저장할 객체
    data: [
      {
        "quizid": 3,
        "quizType": 5001,
        "quizCategory": 7001,
        "quizAnswer": "3",
        "quizQuestion": "아래에서 고양이 사진을 골라주세요.",
        "quizImages": [
            "https: //ssafy.com",
            "https: //ssafy.com",
            "https: //ssafy.com",
            "https: //ssafy.com"
        ]
      },
      {
        "quizid": 4,
        "quizType": 5002,
        "quizCategory": 7001,
        "quizAnswer": "고양이",
        "quizQuestion": "따라 말해보아요.",
        "quizImages": [
            "https: //ssafy.com"
        ]
      },
      {
        "quizid": 2,
        "quizType": 5001,
        "quizCategory": 7001,
        "quizAnswer": "3",
        "quizQuestion": "아래에서 고양이 사진을 골라주세요.",
        "quizImages": [
            "https: //ssafy.com",
            "https: //ssafy.com",
            "https: //ssafy.com",
            "https: //ssafy.com"
        ]
      },
      {
        "quizid": 1,
        "quizType": 5001,
        "quizCategory": 7001,
        "quizAnswer": "3",
        "quizQuestion": "아래에서 고양이 사진을 골라주세요.",
        "quizImages": [
            "https: //ssafy.com",
            "https: //ssafy.com",
            "https: //ssafy.com",
            "https: //ssafy.com"
        ]
      }
    ],         // 개별 스테이지 데이터를 저장할 배열
    message: '',
    timestamp: '',
    loading: false,
    error: null
  }
};

// Redux slice
const stageSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    backQuiz: (state) => {
      const firstItem = state.stageDetail.data.shift();  // 첫 번째 요소 제거
      state.stageDetail.data.push(firstItem);            // 제거된 요소를 끝에 추가
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStageAll.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStageAll.fulfilled, (state, action) => {
        state.loading = false;
        state.stage = action.payload.data;
        state.message = action.payload.message;
        state.timestamp = action.payload.timestamp;
      })
      .addCase(fetchStageAll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      });

    builder
      .addCase(fetchStageDetail.pending, (state) => {
        state.stageDetail.loading = true;
        state.stageDetail.error = null;
      })
      .addCase(fetchStageDetail.fulfilled, (state, action) => {
        state.stageDetail.loading = false;
        state.stageDetail.data = action.payload.data;
        state.stageDetail.message = action.payload.message;
        state.stageDetail.timestamp = action.payload.timestamp;
      })
      .addCase(fetchStageDetail.rejected, (state, action) => {
        state.stageDetail.loading = false;
        state.stageDetail.error = action.payload || 'Something went wrong';
      });
  }
});

export const { backQuiz } = stageSlice.actions;
export default stageSlice.reducer;
