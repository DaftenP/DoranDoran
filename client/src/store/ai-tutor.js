import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/utils/apiClient';

export const fetchChatMessages = createAsyncThunk(
  'aiTutor/fetchChatMessages',
  async ({ role, situation, locale, formData }, thunkAPI) => {

    try {
      const apiUrl = '/talk/send'

      const response = await apiClient.post(apiUrl, formData, {
        params: {
          role,
          situation,
          locale,
        },
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      // 서버에서 받은 chatMessages 데이터를 반환
      return response.data;
    } catch (error) {
      // console.log(error)

      return thunkAPI.rejectWithValue(error.response?.data || 'Server Error');
    }
  }
);

// 로컬 스토리지에 상태 저장하는 함수
function saveToLocalStorage(state) {
  try {
    const { chatMessages, messages, type } = state;
    const serializedState = JSON.stringify({ chatMessages, messages, type });
    localStorage.setItem('aiTutorState', serializedState);
  } catch (error) {
    // console.error('Could not save state', error);
  }
}

// 로컬 스토리지에서 상태 불러오는 함수
function loadFromLocalStorage() {
  try {
    const serializedState = localStorage.getItem('aiTutorState');
    if (serializedState === null) {
      return undefined; // 저장된 상태가 없으면 undefined 반환
    }
    return JSON.parse(serializedState); // chatMessages와 messages 불러오기
  } catch (error) {
    // console.error('Could not load state', error);
    return undefined;
  }
}

// 로컬 스토리지에서 aiTutorState 삭제하는 함수
function clearLocalStorage() {
  try {
    localStorage.removeItem('aiTutorState');
  } catch (error) {
    // console.error('Could not clear local storage', error);
  }
}

const persistedState = loadFromLocalStorage();

// Initial state
const initialState = persistedState || {
  chatMessages: [],
  messages: [],
  type: [],
  loading: false,
  error: null,
};

// Redux slice
const aiTutorSlice = createSlice({
  name: 'aiTutor',
  initialState,
  reducers: {
    typeChange: (state, action) => {
      state.type = action.payload
      saveToLocalStorage(state)
    },
    toggleHint: (state, action) => {
      const index = action.payload;
      const message = state.chatMessages[index];
      if (message) {
        message.isHint = !message.isHint;
      }
    },
    toggleTyping: (state, action) => {
      const payIndex = action.payload
      if (state.chatMessages && state.chatMessages[payIndex]) {
        state.chatMessages[payIndex].isTyping = true;
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
    toggleScorePlus: (state, action) => {
      const payIndex = action.payload;
      if (state.chatMessages[payIndex]) {
        state.chatMessages[payIndex].scorePlus = true;
      }
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
        isTyping: false,
        ...action.payload,
      }
      state.chatMessages.push(responseMessage)
      saveToLocalStorage(state)
    },
    addMyMessage: (state, action) => {
      const myMessage = {
        role: "user",
        isTyping: false,
        scorePlus: false,
        ...action.payload,
      }
      state.chatMessages.push(myMessage)
      saveToLocalStorage(state)
    },
    addSimpleResponseMessage: (state, action) => {
      const responseMessage = {
        role: "assistant",
        content: action.payload.tutorResponse,
      }
      state.messages.push(responseMessage)
      saveToLocalStorage(state)
    },
    addSimpleMyMessage: (state, action) => {
      const myMessage = {
        role: "user",
        ...action.payload,
      }
      state.messages.push(myMessage)
      saveToLocalStorage(state)
    },
    deleteMyMessage: (state) => {
      for (let i = state.chatMessages.length - 1; i >= 0; i--) {
        const message = state.chatMessages[i]
        if (message.role === 'user' && message.content === '') {
          state.chatMessages.splice(i, 1)
          break
        }
      }
      saveToLocalStorage(state)
    },
    resetState: (state) => {
      state.chatMessages = []
      state.messages = []
      state.type = []
      clearLocalStorage()
    },
    changeChatMessages: (state, action) => {
      state.chatMessages = action.payload;
    },
    changeMessages: (state, action) => {
      state.messages = action.payload;
    },
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

export const { toggleScorePlus, toggleTyping, typeChange, changeChatMessages, changeMessages, resetState, resetPlayState, toggleHint, toggleResponsePlay, toggleHintPlay, addResponseMessage, addMyMessage, addSimpleResponseMessage, addSimpleMyMessage, deleteMyMessage } = aiTutorSlice.actions;

export default aiTutorSlice.reducer;