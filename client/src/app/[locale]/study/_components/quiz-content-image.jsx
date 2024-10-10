'use client';

import { useSelector } from 'react-redux';
import QuizContentImageBox from "./quiz-content-image-box";
import { getLocalStorageData } from '@/store/quiz';
import { getLocalStageData } from '@/store/quiz';


export default function QuizContentImage({ type, onButtonClick, clickedIndex, index}) {
  // const localData = getLocalStorageData('dailyQuizData');
  // const quizList = useSelector((state) => 
  //   type === 'daily' ? localData.data : state.quiz.stageDetail.data
  // );
  const quizList = type === 'daily' 
                  ? (getLocalStorageData('dailyQuizData')?.data || [])  // dailyQuizData가 없으면 빈 배열 반환
                  : (getLocalStageData(index + 1)?.data || []);  // 해당 스테이지 데이터가 없으면 빈 배열 반환

  const images = quizList[0]?.quizImages || [];

  const handleClick = (index) => {
    onButtonClick(index);
  };

  return (
    <div className='grid grid-cols-2'>
      {images.length > 0 ? (
        images.map((item, index) => (
          <div key={index} onClick={() => handleClick(index)}>
            <QuizContentImageBox
              image={item}
              index={index}
              isSelected={clickedIndex === index}
            />
          </div>
        ))
      ) : (
        <div>No quiz content available.</div>
      )}
    </div>
  );
}
