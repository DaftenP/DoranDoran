import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import aiTutorReducer from './ai-tutor';
import quizReducer from './quiz';
import rankListReducer from './ranking';

const makeStore = () => configureStore({
  reducer: {
    aiTutor: aiTutorReducer,
    quiz: quizReducer,
    rankList: rankListReducer,
  },
});

const store = makeStore();

export default store;
export const wrapper = createWrapper(makeStore);

