import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';

// 더미 리듀서
const dummyReducer = (state = {}, action) => {
  return state;
};

const makeStore = () => configureStore({
  reducer: {
    dummy: dummyReducer,  // 더미 리듀서
  },
});

const store = makeStore();

export default store;
export const wrapper = createWrapper(makeStore);

