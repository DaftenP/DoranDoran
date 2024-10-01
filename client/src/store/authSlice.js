import { createSlice } from "@reduxjs/toolkit";

// 인증 관련 Redux 슬라이스 생성
const authSlice = createSlice({
  name: "auth",
  initialState: { isLoggedIn: false, accessToken: null },
  reducers: {
    login: (state, action) => { state.isLoggedIn = true; state.accessToken = action.payload; },
    logout: (state) => { state.isLoggedIn = false; state.accessToken = null; },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;