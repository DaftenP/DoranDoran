import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isMainPlaying: false,
  isNightPlaying: false,
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

export const { playMainBgm, playNightBgm, stopBgm, setVolume, setEffectVolume } = soundSlice.actions;
export default soundSlice.reducer;