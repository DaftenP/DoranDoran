import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import aiTutorReducer from './ai-tutor';
import quizReducer from './quiz';

const makeStore = () => configureStore({
  reducer: {
    aiTutor: aiTutorReducer,
    quiz: quizReducer,
  },
});

const store = makeStore();

export default store;
export const wrapper = createWrapper(makeStore);

