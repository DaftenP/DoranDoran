import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Initial state
const initialState = {
  quizList: [
    {
      'date': '2024. 9. 25.',
      'quizList': [
        {
          "number": 1,
          "title": "단어 맞추기",
          "subtitle": "첫 번째 서브타이틀",
          "content": "첫 번째 문제.",
        },
        {
          "number": 2,
          "title": "문장 맞추기",
          "subtitle": "두 번째 서브타이틀",
          "content": "두 번째 문제.",
        },
        {
          "number": 3,
          "title": "단어 발음하기",
          "subtitle": "세 번째 서브타이틀",
          "content": "세 번째 문제.",
        },
        {
          "number": 4,
          "title": "문장 발음하기",
          "subtitle": "네 번째 서브타이틀",
          "content": "네 번째 문제.",
        },
        {
          "number": 5,
          "title": "상황 맞추기",
          "subtitle": "다섯 번째 서브타이틀",
          "content": "다섯 번째 문제.",
        },
        {
          "number": 6,
          "title": "어려운 상황 맞추기",
          "subtitle": "여섯 번째 서브타이틀",
          "content": "여섯 번째 문제.",
        },
      ],
    },
  ],
  loading: false, // 로딩 상태
  error: null, // 에러 상태
};

// Redux slice
const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    deleteQuiz: (state) => {
      state.quizList[0].quizList.shift()
    },
    backQuiz: (state) => {
      const firstQuiz = state.quizList[0].quizList.shift()
      state.quizList[0].quizList.push(firstQuiz)
    },
  },
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(fetchChatMessages.pending, (state) => {
  //       state.loading = true;
  //       state.error = null;
  //     })
  //     .addCase(fetchChatMessages.fulfilled, (state, action) => {
  //       state.loading = false;
  //       state.chatMessages = action.payload;
  //     })
  //     .addCase(fetchChatMessages.rejected, (state, action) => {
  //       state.loading = false;
  //       state.error = action.payload;
  //     });
  // },
});

export const { deleteQuiz, bac } = quizSlice.actions;

export default quizSlice.reducer;
