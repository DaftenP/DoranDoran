import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import aiTutorReducer from './ai-tutor';

const makeStore = () => configureStore({
  reducer: {
    aiTutor: aiTutorReducer,
  },
});

const store = makeStore();

export default store;
export const wrapper = createWrapper(makeStore);

