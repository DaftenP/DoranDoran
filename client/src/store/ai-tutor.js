import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// 서버에서 chatMessages 데이터를 불러오는 async action
export const fetchChatMessages = createAsyncThunk(
  'aiTutor/fetchChatMessages',
  async ({ locale, role, situation }, thunkAPI) => {
    try {
      const response = await axios.post('/api/fetch-messages', { locale, people, topic });
      return response.data; // 서버에서 받은 chatMessages 데이터를 반환
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Initial state
const initialState = {
  chatMessages: [
    {
      "sender": "ai",
      "message": "안녕하세요, 오늘 무엇을 도와드릴까요? 계정 문제나 다른 도움이 필요하시면 언제든지 말씀해 주세요.",
      "translate": "Hello, how can I assist you today? If you need help with your account or anything else, feel free to let me know anytime.",
      "hint": "계정과 관련된 문제가 생겨서 도움을 받고 싶어요.",
      "translatehint": "Hello, how can I assist you today? If you need help with your account or anything else, feel free to let me know anytime.",
      "isResponsePlay": false,
      "isHintPlay": false,
      "isHint": false,
    },
    {
      "sender": "me",
      "message": "계정과 관련된 문제가 생겨서 도움을 받고 싶어요. 비밀번호 변경이나 로그인 관련해서요.",
      "translate": "I've encountered an issue with my account and would like to get some help. It's related to changing my password or logging in.",
      "hint": "Keep your account information secure by using strong passwords.",
      "isResponsePlay": false,
      "isHintPlay": false,
      "isHint": false,
    },
    {
      "sender": "ai",
      "message": "말씀하신 내용을 확인했습니다. 비밀번호 문제인지 아니면 로그인 과정에서 다른 오류가 발생한 것인가요?",
      "translate": "I’ve noted what you mentioned. Is it a password issue or did you encounter another error during the login process?",
      "hint": "계정 정보를 안전하게 보호하세요. 다른 사람과 공유하지 않도록 주의해주세요.",
      "translatehint": "Try to be as specific as possible about the problem to get the best help.",
      "isResponsePlay": false,
      "isHintPlay": false,
      "isHint": false,
    },
    {
      "sender": "me",
      "message": "계정 정보를 안전하게 보호하세요. 다른 사람과 공유하지 않도록 주의하세요.",
      "translate": "Ensure your account information is protected securely. Be careful not to share it with others.",
      "hint": "Using two-factor authentication can add an extra layer of security.",
      "isResponsePlay": false,
      "isHintPlay": false,
      "isHint": false,
    },
    {
      "sender": "ai",
      "message": "계정 관련 문제 외에도 제가 도울 수 있는 부분이 있을까요? 추가적인 질문이 있으면 언제든지 말씀해 주세요.",
      "translate": "Is there anything else besides the account issue that I can assist you with? Feel free to ask any additional questions.",
      "hint": "계정 관련 외 더 질문을 하고싶어요.",
      "translatehint": "You can always ask more questions or seek further assistance if needed.",
      "isResponsePlay": false,
      "isHintPlay": false,
      "isHint": false,
    },
    {
      "sender": "me",
      "message": "네, 또 다른 질문이 있습니다. 내 계정 활동 내역을 확인할 수 있는 방법이 있나요? 최근 로그인 내역을 알고 싶어요.",
      "translate": "Yes, I have another question. Is there a way to check my account activity? I'd like to see my recent login history.",
      "hint": "Checking your account activity regularly helps you spot any suspicious actions.",
      "isResponsePlay": false,
      "isHintPlay": false,
      "isHint": false,
    }
  ], // 채팅 메시지 리스트
  loading: false, // 로딩 상태
  error: null, // 에러 상태
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
        state.chatMessages = action.payload;
      })
      .addCase(fetchChatMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetPlayState, toggleHint, toggleResponsePlay, toggleHintPlay } = aiTutorSlice.actions;

export default aiTutorSlice.reducer;
