'use client';

import { useSelector, useDispatch } from 'react-redux';
import { getLocalStorageData } from '@/store/quiz';

export default function QuizContentSpeak({ type, index }) {
  const localData = getLocalStorageData('dailyQuizData');
  const quizList = useSelector((state) => 
    type === 'daily' ? localData.data : state.quiz.stageDetail.data
  );
  const image = quizList[0].quizImages[0];

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