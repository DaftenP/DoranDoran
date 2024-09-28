import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchChatMessages = createAsyncThunk(
  'aiTutor/fetchChatMessages',
  async ({ role, situation,locale, formData }, thunkAPI) => {
    console.log("FormData 준비? 완료", formData);
    for (const pair of formData.entries()) {
      console.log(pair);
    }
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/talk/send`

      const response = await axios.post(apiUrl, formData, {
        params: {
          role,
          situation,
          locale,   // 쿼리 스트링으로 보낼 데이터
        },
        headers: {
          'Content-Type': 'multipart/form-data',  // FormData 사용 시 헤더 설정
        },
        withCredentials: true,
      });
      console.log(response.data)

      return response.data; // 서버에서 받은 chatMessages 데이터를 반환
    } catch (error) {
      console.log(error)
      console.log("Error message:", error.message);

      // 에러가 응답에 관련된 것인지 확인 후 응답 내용 출력
      if (error.response) {
        console.log("Error response data:", error.response.data);
        console.log("Error response status:", error.response.status);
        console.log("Error response headers:", error.response.headers);
      } else if (error.request) {
        // 요청이 보내졌지만 응답이 없을 때
        console.log("Error request:", error.request);
      } else {
        // 그 외의 설정 에러
        console.log("Error config:", error.config);
      }
      return thunkAPI.rejectWithValue(error.response?.data || 'Server Error');
    }
  }
);

// Initial state
const initialState = {
  chatMessages : [
  ],

  messages: [
  ],
  loading: false,
  error: null,
};

// Redux slice
const aiTutorSlice = createSlice({
  name: 'aiTutor',
  initialState,
  reducers: {
    toggleHint: (state, action) => {
      const index = action.payload;
      const message = state.chatMessages[index];
      if (message) {
        message.isHint = !message.isHint;
      }
    },
    toggleResponsePlay: (state, action) => {
      const payIndex = action.payload
      state.chatMessages.forEach((msg, index) => {
        msg.isResponsePlay = index === payIndex ? !msg.isResponsePlay : false;
        msg.isHintPlay = false
      });
    },
    toggleHintPlay: (state, action) => {
      const payIndex = action.payload
      state.chatMessages.forEach((msg, index) => {
        msg.isHintPlay = index === payIndex ? !msg.isHintPlay : false;
        msg.isResponsePlay = false
      });
    },
    resetPlayState: (state) => {
      state.chatMessages.forEach((msg) => {
        msg.isResponsePlay = false
        msg.isHintPlay = false
      })
    },
    addResponseMessage: (state, action) => {
      const responseMessage = {
        role: "assistant",
        isResponsePlay: false,
        isHintPlay: false,
        isHint: false,
        ...action.payload,
      }
      state.chatMessages.push(responseMessage)
    },
    addMyMessage: (state, action) => {
      const myMessage = {
        role: "user",
        ...action.payload,
      }
      state.chatMessages.push(myMessage)
    },
    addSimpleResponseMessage: (state, action) => {
      const responseMessage = {
        role: "assistant",
        content: action.payload.tutorResponse,
      }
      state.messages.push(responseMessage)
    },
    addSimpleMyMessage: (state, action) => {
      const myMessage = {
        role: "user",
        ...action.payload,
      }
      state.messages.push(myMessage)
    },
    deleteMyMessage: (state) => {
      for (let i = state.chatMessages.length - 1; i >= 0; i--) {
        const message = state.chatMessages[i]
        if (message.role === 'user' && message.content === '') {
          state.chatMessages.splice(i, 1)
          break
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatMessages.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(fetchChatMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      });
  },
});

export const { resetPlayState, toggleHint, toggleResponsePlay, toggleHintPlay, addResponseMessage, addMyMessage, addSimpleResponseMessage, addSimpleMyMessage, deleteMyMessage } = aiTutorSlice.actions;

export default aiTutorSlice.reducer;