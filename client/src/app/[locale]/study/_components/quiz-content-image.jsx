'use client';

import { useLocale, useTranslations, NextIntlClientProvider } from 'next-intl';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import QuizContentImageBox from "./quiz-content-image-box";

export default function QuizContentImage({ type, index, onButtonClick }) {
  // const quizList = useSelector((state) => 
  //   type === 'daily' ? state.quiz.dailyQuizList : state.quiz.stageList[index].quizList
  // );
  const quizList = useSelector((state) => state.quiz.stageDetail.data);
  const images = quizList[0].quizImages;
  // console.log(quizList[0].id);

  // const images = quizList.length > 0 ? quizList[0].quizQuest.map((quest) => quest.image) : [];
  // const quizContent = quizList.length > 0 ? images : [];
  
  const handleClick = (index) => {
    // console.log('클릭된 index:', index);
    onButtonClick(index); // 부모의 콜백 함수 실행
  };

  return (
    <div>
      <div className='flex-col flex justify-center items-center grid grid-cols-2 gap-4'>
        {images.length > 0 ? (
          images.map((item, index) => (
            // <div key={index} className="border p-2">
            //   <div>{item}</div>
            // </div>
            <div key={index} onClick={() => handleClick(index)}>
              <QuizContentImageBox image={item} index={index}/>
            </div>
          ))
        ) : (
          <div>No quiz content available.</div> 
        )}
      </div>
    </div>
  );
}