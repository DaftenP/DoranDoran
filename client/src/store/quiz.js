import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getLocalStorageData = (key) => {
  const storedData = localStorage.getItem(key);
  if (storedData) {
    const parsedData = JSON.parse(storedData);
    
    // 저장된 날짜가 오늘인지 확인
    const today = new Date().toISOString().split('T')[0];
    if (parsedData.timestamp === today) {
      return parsedData.data;  // 오늘 날짜면 저장된 데이터를 리턴
    }
  }
  return null;
};

const setLocalStorageData = (key, data) => {
  const today = new Date().toISOString().split('T')[0];
  const storedData = {
    data: data,
    timestamp: today
  };
  localStorage.setItem(key, JSON.stringify(storedData));
};

export const updateLocalStorageQuiz = (key) => {
  const storedData = localStorage.getItem(key);

  if (storedData) {
    const parsedData = JSON.parse(storedData);

    if (parsedData.data.data.length > 0) {
      // 첫 번째 퀴즈를 삭제 (첫 번째 퀴즈부터 차례로 삭제)
      parsedData.data.data.shift();
      // console.log('퀴즈 삭제 완료:', parsedData.data.data);

      // 퀴즈가 모두 삭제된 경우 로컬스토리지에서도 제거
      if (parsedData.data.length === 0) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(parsedData));
      }
    }
  }
};

export const fetchDailyAll = createAsyncThunk(
  'dailyAll/fetchDailyAll', 
  async (_, thunkAPI) => {

    const localData = getLocalStorageData('dailyQuizData');
    if (localData) {
      // console.log("local 데이터:", localData.data);
      // return { data: localData, message: '로컬 저장소에서 데이터를 가져왔습니다.' };
      return localData.data;
    }

    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/quiz/quizzes?cnt=${10}`
      const response = await axios.get(apiUrl); 
      setLocalStorageData('dailyQuizData', response.data);
      return response.data; // API에서 반환되는 데이터를 리턴

    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error.response?.data || 'Server Error');
    }
  }
);

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
      // console.log('stageID:', response.data);
      // console.log(apiUrl);
      return response.data; // API에서 반환되는 데이터를 리턴

    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error.response?.data || 'Server Error');
    }
  }
);

// POST 요청 액션 생성
export const fetchQuizSolve = createAsyncThunk(
  'quizSolve/fetchQuizSolve', 
  async ({ quizId }, thunkAPI) => {
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/quiz/play-log/submit`; // 엔드포인트에 맞게 수정
      const response = await axios.post(apiUrl, { quizId }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }); 
      // console.log(quizId)
      
      return response.data; // API 응답 데이터 리턴
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error.response?.data || 'Server Error');
    }
  }
);

// Initial state
const initialState = {
  dailyQuiz: {
    data: [
      {
        "quizId": 1,
        "quizType": 1,
        "quizCategory": 1,
        "quizAnswer": "42",
        "quizQuestion": "What is the answer to life, the universe, and everything?",
        "quizVoiceUrl": "sadas",
        "quizImages": [
            "https: //ssafy.com",
            "https: //ssafy.com",
            "https: //ssafy.com",
            "https: //ssafy.com"
        ]
      },
    ],
    remainingCount: 10,
    message: "정상적으로 요청이 완료되었습니다.",
    timestamp: "2024-10-03T15:36:34.1669863",
    loading: false,
    error: null
  },
  stage : {
    data : [
      {
        "id": 2,
        "order": 1,
        "stageName": "test2"
      }
    ],           // 스테이지 데이터를 저장할 배열
    message: '',        // 서버로부터의 메시지
    timestamp: '',      // 요청 완료 시간
    loading: false,     // 요청이 진행 중인지 나타내는 상태
    error: null,        // 에러 발생 시 에러 메시지 저장
  },
  stageDetail: {      // /quiz/stage/{stageId} 데이터를 저장할 객체
    data: [
      {
        "quizId": 1,
        "quizType": 1,
        "quizCategory": 1,
        "quizAnswer": "42",
        "quizQuestion": "What is the answer to life, the universe, and everything?",
        "quizVoiceUrl": "sadas",
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
  },
  quizSolve: {    // POST 요청 상태 추가
    data: null,
    message: "로그가 정상적으로 등록 되었습니다.",
    timestamp: "2024-09-23T15:11:31.2538719",
    loading: false,
    error: null,
  }
};

// Redux slice
const stageSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    deleteLocalDailyQuiz: (state) => {
      updateLocalStorageQuiz('dailyQuizData');
      state.dailyQuiz.data.shift(); // state에서도 첫 번째 퀴즈 삭제
      state.dailyQuiz.remainingCount -= 1;
    },
    deleteDailyQuiz: (state) => {
      const firstItem = state.dailyQuiz.data.shift();
      if (firstItem) {
        state.dailyQuiz.remainingCount -= 1; // 남은 문제 수 줄이기
        
        localStorage.setItem('remainingCount', state.dailyQuiz.remainingCount);
      }
    },
    deleteQuiz: (state) => {
      const firstItem = state.stageDetail.data.shift(); 
      // state.stageDetail.data.push(firstItem);
    },
  },
  
  extraReducers: (builder) => {
    builder
      .addCase(fetchDailyAll.pending, (state) => {
        state.dailyQuiz.loading = true;
        state.dailyQuiz.error = null;
      })
      .addCase(fetchDailyAll.fulfilled, (state, action) => {
        state.dailyQuiz.loading = false;
        state.dailyQuiz.data = action.payload.data;
        state.dailyQuiz.message = action.payload.message;
        state.dailyQuiz.timestamp = action.payload.timestamp;
      })
      .addCase(fetchDailyAll.rejected, (state, action) => {
        state.dailyQuiz.loading = false;
        state.dailyQuiz.error = action.payload || 'Something went wrong';
      })

      .addCase(fetchStageAll.pending, (state) => {
        state.stage.loading = true;
        state.stage.error = null;
      })
      .addCase(fetchStageAll.fulfilled, (state, action) => {
        state.stage.loading = false;
        state.stage.data = action.payload.data;
        state.stage.message = action.payload.message;
        state.stage.timestamp = action.payload.timestamp;
      })
      .addCase(fetchStageAll.rejected, (state, action) => {
        state.stage.loading = false;
        state.stage.error = action.payload || 'Something went wrong';
      })

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
      })

      .addCase(fetchQuizSolve.pending, (state) => {
        state.quizSolve.loading = true;
        state.quizSolve.error = null;
      })
      .addCase(fetchQuizSolve.fulfilled, (state, action) => {
        state.quizSolve.loading = false;
        state.quizSolve.data = action.payload.data;
        state.quizSolve.message = action.payload.message;
        state.quizSolve.timestamp = action.payload.timestamp;
      })
      .addCase(fetchQuizSolve.rejected, (state, action) => {
        state.quizSolve.loading = false;
        state.quizSolve.error = action.payload || 'Something went wrong';
      });
  }
});

export const { deleteLocalDailyQuiz, deleteDailyQuiz, deleteQuiz, backQuiz } = stageSlice.actions;
export default stageSlice.reducer;
