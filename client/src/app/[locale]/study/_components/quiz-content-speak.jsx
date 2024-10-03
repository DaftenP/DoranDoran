'use client';

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';

export default function QuizContentSpeak({ type, index }) {

  const quizList = useSelector((state) => state.quiz.stageDetail.data);
  const image = quizList[0].quizImages[0];

  return (
    <div className='flex-col flex justify-center items-center'>
      {image}
    </div>
  );
}