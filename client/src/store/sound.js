import { createSlice } from '@reduxjs/toolkit';

// 초기 상태 설정
const initialState = {
  isMainPlaying: false,  // Main BGM 재생 여부
  isNightPlaying: false, // Night BGM 재생 여부
  volume: 1,
  effectVolume: 1,
};

const soundSlice = createSlice({
  name: 'sound',
  initialState,
  reducers: {
    playMainBgm(state) {
      state.isMainPlaying = true;
      state.isNightPlaying = false;
    },
    playNightBgm(state) {
      state.isMainPlaying = false;
      state.isNightPlaying = true;
    },
    stopBgm(state) {
      state.isMainPlaying = false;
      state.isNightPlaying = false;
    },
    setVolume(state, action) {
      state.volume = action.payload;
    },
    setEffectVolume(state, action) {
      state.effectVolume = action.payload;
    }
  },
});

export const { initializeAudio, playMainBgm, playNightBgm, stopBgm, setVolume } = soundSlice.actions;
export default soundSlice.reducer;
