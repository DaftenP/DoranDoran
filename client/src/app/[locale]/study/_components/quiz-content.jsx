'use client';

import { useLocale, useTranslations, NextIntlClientProvider } from 'next-intl';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchStageDetail } from '@/store/quiz';
import { deleteDailyQuiz, deleteQuiz, backQuiz, deleteStage } from '@/store/quiz';
import Link from 'next/link';
import QuizContentImage from "./quiz-content-image";
import QuizContentSpeak from "./quiz-content-speak";
import Button from './button';
import InputForm from './input-form';
import { motion } from 'framer-motion'


export default function QuizContent({ type, index }) {
  const [messages, setMessages] = useState(null);
  const [clickedIndex, setClickedIndex] = useState(null);
  const locale = useLocale();

  useEffect(() => {
    async function loadMessages() {
      try {
        const loadedMessages = await import(`messages/${locale}.json`);
        setMessages(loadedMessages.default); // 메시지 로드
      } catch (error) {
        console.error(`Failed to load messages for locale: ${locale}`);
      }
    }
    loadMessages();
  }, [locale]);

  if (!messages) {
    return <div>Loading...</div>; // 메시지가 로드될 때까지 로딩 표시
  }

  // const handleImageClick = (index) => {
    
  //   setClickedIndex(index);
  //   console.log(index)
  // };

  const handleImageClick = (index) => {
    if (clickedIndex === index) {
      // console.log('이미지를 다시 클릭하여 선택 해제:', index);
      setClickedIndex(null); // 동일한 이미지 클릭 시 선택 해제
    } else {
      // console.log('다른 이미지 클릭:', index);
      setClickedIndex(index); // 다른 이미지 클릭 시 해당 index 설정
    }
  };

  const handleResetIndex = () => {
    setClickedIndex(null); // 버튼 클릭 시 클릭된 인덱스 초기화
  };


  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <TranslatedQuizContent 
        type={type} 
        index={index} 
        clickedIndex={clickedIndex} 
        onImageClick={handleImageClick} 
        onResetIndex={handleResetIndex}
      />
    </NextIntlClientProvider>
  );
}

function TranslatedQuizContent({ type, index, clickedIndex, onImageClick, onResetIndex }) {
  const t = useTranslations('index');
  const dispatch = useDispatch();
  const quizList = useSelector((state) => 
    type === 'daily' ? state.quiz.dailyQuiz.data : state.quiz.stageDetail
  );

  // const quizList = useSelector((state) => state.quiz.stageDetail.data);
  // const quizStage = useSelector((state) => state.quiz.stageDetail);
  // const quizDaily = useSelector((state) => state.quiz.dailyQuiz.data);
  // const quizList = (type === 'daily') ? quizDaily : quizStage;
  const images = quizList[0]?.quizImages;
  const quizType = quizList[0]?.quizType;
  const quizAnswer = quizList[0]?.quizAnswer;

  // useEffect(() => {
  //   console.log("Stage ID:", index); // index 값 확인
  //   dispatch(fetchStageDetail(index)); 
  // }, [dispatch]);
  // console.log(quizList[0].id);

  // const images = quizList.length > 0 ? quizList[0].quizQuest.map((quest) => quest.image) : [];
  // const quizContent = quizList.length > 0 ? images : [];

  const [feedbackMessage, setFeedbackMessage] = useState(null); // 피드백 메시지 상태
  const [feedbackType, setFeedbackType] = useState(null); // 정답/오답 타입
  const [recordedSTT, setRecordedSTT] = useState('');

  const handleSubmitSTT = (data) => {
    setRecordedSTT(data);  // 부모 컴포넌트로부터 받은 데이터를 상태에 저장
    console.log(data)
  };

  const handleAnswerCheck = () => {
    if (quizType === 5001 || clickedIndex !== null) {
      if (String(clickedIndex + 1) === quizAnswer) {
        setFeedbackMessage('정답입니다!');
        setFeedbackType('correct');
        handleSubmit();
      } else {
        setFeedbackMessage('오답입니다.');
        setFeedbackType('wrong');
      }
    } else if (recordedSTT && (quizType === 5002 || quizType === 5003)) {
      if (recordedSTT.trim() === quizAnswer) { // transcript와 quizAnswer 비교
        setFeedbackMessage('정답입니다!');
        setFeedbackType('correct');
        handleSubmit();
      } else {
        setFeedbackMessage('오답입니다.');
        setFeedbackType('wrong');
      }
    }
    // 상태 초기화
    setTimeout(() => {
      setFeedbackMessage(null);
      setFeedbackType(null);
      onResetIndex(); // 클릭된 인덱스 리셋
      setRecordedSTT(''); // STT 초기화
    }, 2000); // 2초 후 메시지 사라짐
  };
  
  const handleSubmit = () => {
    setTimeout(() => {
      if(type === 'daily'){
        dispatch(deleteDailyQuiz());
      } else {
        dispatch(deleteQuiz());
      }
      // dispatch(backQuiz());
    }, 2000);
  }
  

  return (
    <div className='flex-col flex justify-center items-center'>
      <div className='h-[50%]'>
        {quizType === 5001 ? (<QuizContentImage type={type} onButtonClick={onImageClick} clickedIndex={clickedIndex}/>) :
        (quizType === 5002 || quizType === 5003) ? (<QuizContentSpeak type={type}/>) : ''
        }
      </div>
      {/* <div className='absolute transform -translate-x-1/2 -translate-y-1/2 bottom-[20%] left-1/2 z-10'> */}
      {!recordedSTT && (
        <InputForm quizType={quizType} onSubmit={handleSubmitSTT} />
      )}
      {/* </div> */}
      <div onClick={handleAnswerCheck} className='absolute bottom-0 left-1/2 transform -translate-x-1/2'>
        {((quizType === 5001 && clickedIndex !== null) ||
        ((quizType === 5002 || quizType === 5003) && recordedSTT)) && <Button type={type} index={index} onClick={handleAnswerCheck}/>}
      </div>

      {feedbackMessage && (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className={`absolute z-20 top-[40%] left-[30%] transform -translate-x-1/2 -translate-y-1/2 p-4 rounded-lg text-white text-xl 
          ${feedbackType === 'correct' ? 'bg-green-500' : 'bg-red-500'}`}
      >
        {feedbackMessage}
      </motion.div>
    )}
    </div>
  );
}