import { createSlice } from '@reduxjs/toolkit';

// 로컬 스토리지에서 상태를 불러오는 함수
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('soundSettings'); // 'soundSettings' 키로 로컬 스토리지에서 가져옴
    if (serializedState === null) { // 저장된 데이터가 없으면 undefined 반환
      return undefined;
    }
    return JSON.parse(serializedState); // 저장된 JSON 문자열을 객체로 변환하여 반환
  } catch (err) {}
};

// 상태를 로컬 스토리지에 저장하는 함수
const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state); // 상태 객체를 JSON 문자열로 변환
    localStorage.setItem('soundSettings', serializedState); // 'soundSettings' 키로 로컬 스토리지에 저장
  } catch {}
};

const initialState = loadState() || {
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
      saveState(state);
    },
    playNightBgm(state) {
      state.isMainPlaying = false;
      state.isNightPlaying = true;
      saveState(state);
    },
    stopBgm(state) {
      state.isMainPlaying = false;
      state.isNightPlaying = false;
      saveState(state);
    },
    setVolume(state, action) {
      state.volume = action.payload;
      saveState(state);
    },
    setEffectVolume(state, action) {
      state.effectVolume = action.payload;
      saveState(state);
    }
  },
});

export const { playMainBgm, playNightBgm, stopBgm, setVolume, setEffectVolume } = soundSlice.actions;
export default soundSlice.reducer;