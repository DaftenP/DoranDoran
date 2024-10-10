'use client';

import { useSelector, useDispatch } from 'react-redux';
import { getLocalStorageData } from '@/store/quiz';
import { getLocalStageData } from '@/store/quiz';

export default function QuizContentSpeak({ type, index }) {
  // const localData = getLocalStorageData('dailyQuizData');
  const quizList = type === 'daily' 
                  ? (getLocalStorageData('dailyQuizData')?.data || [])  // dailyQuizData가 없으면 빈 배열 반환
                  : (getLocalStageData(index + 1)?.data || []);  // 해당 스테이지 데이터가 없으면 빈 배열 반환

  const image = quizList[0]?.quizImages[0];

  return (
    <div className='flex-col flex justify-center items-center'>
      <div className="">
        <img
          src={image}
          alt="image"
          className={`absolute transform -translate-x-1/2 -translate-y-1/2 top-[20%] w-[70vw] h-auto rounded-[20%] shadow-2xl border border-4`} // 원하는 크기 및 비율 설정
        />
      </div>
    </div>
  );
}