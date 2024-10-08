// import { configureStore } from "@reduxjs/toolkit";
// import { createWrapper } from "next-redux-wrapper";
// import aiTutorReducer from "./ai-tutor";
// import quizReducer from "./quiz";
// import rankListReducer from "./ranking";
// import authReducer from "./authSlice";

// const makeStore = () =>
//   configureStore({
//     reducer: {
//       auth: authReducer,
//       aiTutor: aiTutorReducer,
//       quiz: quizReducer,
//       rankList: rankListReducer,
//     },
//   });
// const store = makeStore();

// export default store;
// export const wrapper = createWrapper(makeStore);

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./authSlice";
import aiTutorReducer from "./ai-tutor";
import stageReducer from "./quiz";
import rankListReducer from "./ranking";
import userReducer from "./user";
import shopReducer from "./shop";
import soundReducer from "./sound"

// Redux Persist 설정
const persistConfig = {
  key: "root", // 저장소 키
  storage, // 사용할 스토리지 - 로컬 스토리지
  whitelist: ["auth"], // 유지할 리듀서 목록 - auth
};

// 루트 리듀서 생성
const rootReducer = combineReducers({
  auth: authReducer,
  aiTutor: aiTutorReducer,
  quiz: stageReducer,
  rankList: rankListReducer,
  user: userReducer,
  shop: shopReducer,
  sound: soundReducer
});

// 유지된 리듀서 생성
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Redux 스토어 생성 함수
const makeStore = () =>
  configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ["persist/PERSIST"], // persist/PERSIST 액션 무시
        },
      }),
  });

// 스토어 생성
export const store = makeStore();
// Persistor 생성
export const persistor = persistStore(store);
// Next.js용 Redux 래퍼 생성
export const wrapper = createWrapper(() => store);