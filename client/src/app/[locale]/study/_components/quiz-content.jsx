"use client";

import { useLocale, useTranslations, NextIntlClientProvider } from "next-intl";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteLocalDailyQuiz, deleteDailyQuiz, deleteQuiz } from "@/store/quiz";
import { fetchQuizSolve } from "@/store/quiz";
import { fetchDailySolve } from "@/store/quiz";
import { getLocalStorageData } from "@/store/quiz";
import { getLocalStageData } from "@/store/quiz";
import { updateLocalStorageQuiz } from "@/store/quiz";
import { updateLocalStageQuiz } from "@/store/quiz";
import QuizContentImage from "./quiz-content-image";
import QuizContentSpeak from "./quiz-content-speak";
import Button from "./button";
import InputForm from "./input-form";
import { motion } from "framer-motion";

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
        // console.error(`Failed to load messages for locale: ${locale}`);
      }
    }
    loadMessages();
  }, [locale]);

  if (!messages) {
    return <div>Loading...</div>; // 메시지가 로드될 때까지 로딩 표시
  }

  const handleImageClick = (index) => {
    if (clickedIndex === index) {
      setClickedIndex(null); // 동일한 이미지 클릭 시 선택 해제
    } else {
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
  const t = useTranslations("index");
  const dispatch = useDispatch();
  // const localData = getLocalStorageData('dailyQuizData');

  // const quizList = useSelector((state) => 
  //   type === 'daily' ? localData.data : state.quiz.stageDetail.data
  // );
  const quizList = type === 'daily' 
                  ? (getLocalStorageData('dailyQuizData')?.data || [])  // dailyQuizData가 없으면 빈 배열 반환
                  : (getLocalStageData(index + 1)?.data || []);  // 해당 스테이지 데이터가 없으면 빈 배열 반환

  // console.log(quizList);

  const quiz = quizList?.[0];
  const images = quizList[0]?.quizImages;
  const quizType = quizList[0]?.quizType;
  const quizAnswer = quizList[0]?.quizAnswer;
  const quizId = quizList[0]?.quizId;

  const [feedbackMessage, setFeedbackMessage] = useState(null); // 피드백 메시지 상태
  const [feedbackType, setFeedbackType] = useState(null); // 정답/오답 타입
  const [recordedSTT, setRecordedSTT] = useState("");

  // useEffect(() => {
  //   // 로컬 저장소에서 데이터가 업데이트되면 상태 갱신
  //   const localData = getLocalStorageData("dailyQuizData");
  //   // setQuizList(localData.data);  // quizList 업데이트
  // }, [quiz]);

  // console.log(quizList);

  const handleSubmitSTT = (data) => {
    setRecordedSTT(data); // 부모 컴포넌트로부터 받은 데이터를 상태에 저장
    // console.log(data);
  };

  function removeSpacesAndPeriods(text) {
    return text.replace(/[\s.]/g, ''); // 공백(\s)과 .(마침표)를 모두 제거
  }

  

  const handleAnswerCheck = () => {
    if (quizType === 5001 || clickedIndex !== null) {
      if (String(clickedIndex + 1) === quizAnswer) {
        setFeedbackMessage("정답입니다!");
        setFeedbackType("correct");
        handleSubmit();
      } else {
        setFeedbackMessage("오답입니다.");
        setFeedbackType("wrong");
      }
    } else if (recordedSTT && (quizType === 5002 || quizType === 5003)) {
      // console.log(removeSpacesAndPeriods(quizAnswer))
      if (removeSpacesAndPeriods(recordedSTT.trim()) === removeSpacesAndPeriods(quizAnswer)) {
        setFeedbackMessage("정답입니다!");
        setFeedbackType("correct");
        handleSubmit();
      } else {
        setFeedbackMessage("오답입니다.");
        setFeedbackType("wrong");
      }
    }
    onResetIndex(); // 클릭된 인덱스 리셋
    setRecordedSTT(""); // STT 초기화
    // 상태 초기화
    setTimeout(() => {
      setFeedbackMessage(null);
      setFeedbackType(null);
    }, 2000); // 2초 후 메시지 사라짐
  };

  const handleSubmit = () => {
    if (type === "daily") {
      dispatch(fetchDailySolve({ quizId }));
    } else {
      dispatch(fetchQuizSolve({ quizId }));
    }
      
    setTimeout(() => {
      if (type === "daily") {
        // dispatch(deleteLocalDailyQuiz());
        updateLocalStorageQuiz('dailyQuizData');
        // const updatedQuizList = getLocalStorageData("dailyQuizData");
        // console.log("퀴즈 삭제 후 로컬 저장소 데이터:", updatedQuizList);
        // setQuizList(updatedQuizList.data);
        // dispatch(deleteDailyQuiz());
      } else {
        // dispatch(deleteQuiz());
        updateLocalStageQuiz(index+1);
      }
    }, 2000);
  };

  return (
    <div className="flex-col flex justify-center items-center">
      <div className="h-[50%]">
        {quizType === 5001 ? (
          <QuizContentImage type={type} onButtonClick={onImageClick} clickedIndex={clickedIndex} index={index}/>
        ) : quizType === 5002 || quizType === 5003 ? (
          <QuizContentSpeak type={type} index={index}/>
        ) : (
          ""
        )}
      </div>
      {!recordedSTT && <InputForm quizType={quizType} onSubmit={handleSubmitSTT} />}
      <div
        onClick={handleAnswerCheck}
        className="absolute bottom-[5%] left-1/2 transform -translate-x-1/2">
        {((quizType === 5001 && clickedIndex !== null) ||
          ((quizType === 5002 || quizType === 5003) && recordedSTT)) && (
            
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center justify-center">

            {recordedSTT && (
              <div className="my-1 bg-[#ffffff] border border-2 border-[#d7aefb] p-2 text-center w-full max-w-xs rounded-full">
                <p className={` 
                ${String(recordedSTT.trim()).length >= 10 ? "text-xs" :
                String(recordedSTT.trim()).length >= 5 ?  "text-sm" : "text-md"}`}>
                  {recordedSTT.trim()}</p>
              </div>
            )}
            <Button type={type} index={index} onClick={handleAnswerCheck} />
            
          </motion.div>
        )}
      </div>
      <div className="flex items-center justify-center absolute top-0 left-0 w-full h-[40%]">
        {feedbackMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`z-30 top-[50%] p-4 rounded-lg text-white text-xl 
              ${feedbackType === "correct" ? "bg-green-500" : "bg-red-500"} relative`}>
            {feedbackMessage}
          </motion.div>
        )}
      </div>
    </div>
  );
}
