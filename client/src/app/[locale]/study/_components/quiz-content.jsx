'use client';

import { useLocale, useTranslations, NextIntlClientProvider } from 'next-intl';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <TranslatedQuizContent type={type} index={index} clickedIndex={clickedIndex} onImageClick={handleImageClick} setClickedIndex={setClickedIndex}/>
    </NextIntlClientProvider>
  );
}

function TranslatedQuizContent({ type, index, clickedIndex, onImageClick, setClickedIndex }) {
  const t = useTranslations('index');
  // const quizList = useSelector((state) => 
  //   type === 'daily' ? state.quiz.dailyQuizList : state.quiz.stageList[index].quizList
  // );

  const quizList = useSelector((state) => state.quiz.stageDetail.data);
  const images = quizList[0].quizImages;
  const quizType = quizList[0].quizType;
  const quizAnswer = quizList[0].quizAnswer;
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
      } else {
        setFeedbackMessage('오답입니다.');
        setFeedbackType('wrong');
      }
    } else if (recordedSTT && (quizType === 5002 || quizType === 5003)) {
      if (recordedSTT.trim() === quizAnswer) { // transcript와 quizAnswer 비교
        setFeedbackMessage('정답입니다!');
        setFeedbackType('correct');
      } else {
        setFeedbackMessage('오답입니다.');
        setFeedbackType('wrong');
      }
    }
    // 상태 초기화
    setTimeout(() => {
      setFeedbackMessage(null);
      setFeedbackType(null);
      setClickedIndex(null); // 선택한 이미지 초기화
      setRecordedSTT(''); // STT 초기화
    }, 2000); // 2초 후 메시지 사라짐
  };
  

  return (
    <div>
      <div className='flex-col flex justify-center items-center'>
        {quizType === 5001 ? (<QuizContentImage onButtonClick={onImageClick} />) :
        (quizType === 5002 || quizType === 5003) ? (<QuizContentSpeak />) : ''
        }
        {!recordedSTT && (
          <InputForm quizType={quizType} onSubmit={handleSubmitSTT} />
        )}
        <div onClick={handleAnswerCheck} className='absolute bottom-0 left-1/2 transform -translate-x-1/2'>
          {((quizType === 5001 && clickedIndex !== null) ||
          (quizType === 5002 && recordedSTT)) && <Button type={type} index={index} onClick={handleAnswerCheck}/>}
        </div>

        {feedbackMessage && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 rounded-lg text-white text-xl 
            ${feedbackType === 'correct' ? 'bg-green-500' : 'bg-red-500'}`}
        >
          {feedbackMessage}
        </motion.div>
      )}
      </div>
    </div>
  );
}