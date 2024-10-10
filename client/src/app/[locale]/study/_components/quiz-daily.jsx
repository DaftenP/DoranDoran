"use client";

import Image from "next/image";
import { useLocale, useTranslations, NextIntlClientProvider } from "next-intl";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getLocalStorageData } from "@/store/quiz";
import QuizTitle from "@/app/[locale]/study/_components/quiz-title";
import QuizContent from "@/app/[locale]/study/_components/quiz-content";
import Button from "@/app/[locale]/study/_components/button";
import Play from "@/public/icon/play1.webp";
import Pause from "@/public/icon/play2.webp";
import { useRouter } from "next/navigation";
import { fetchDailyAll } from "@/store/quiz";

export default function QuizDaily({ type }) {
  const [messages, setMessages] = useState(null);
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

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <TranslatedQuizDaily locale={locale} type={type} />
    </NextIntlClientProvider>
  );
}

function TranslatedQuizDaily({ locale, type, index }) {
  const t = useTranslations("index");
  const dispatch = useDispatch();
  const [localData, setLocalData] = useState(getLocalStorageData("dailyQuizData"));
  // let localData = getLocalStorageData('dailyQuizData');

  // useEffect(() => {
  //   setLocalData(getLocalStorageData('dailyQuizData'));
  // }, [localData.data]);

  useEffect(() => {
    const updateLocalData = () => {
      const newData = getLocalStorageData("dailyQuizData");
      // 기존 데이터와 비교하여 변경되었을 때만 상태를 업데이트
      if (JSON.stringify(localData) !== JSON.stringify(newData)) {
        setLocalData(newData);
      }
    };

    const intervalId = setInterval(updateLocalData, 500); // 0.5초마다 업데이트 확인

    return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 클리어
  }, [localData]);

  const quizList = localData.data;
  // const quizList = useSelector((state) => state.quiz.dailyQuiz.data);
  const quizType = quizList[0]?.quizType;

  const totalQuizzes = quizList.length;
  const quizVoiceUrl = quizList[0]?.quizVoiceUrl;
  const router = useRouter();

  // const savedRemainingCount = localStorage.getItem('remainingCount');
  // const remainingCount = savedRemainingCount ? parseInt(savedRemainingCount) : 10;
  // const remainingCount = useSelector((state) => state.quiz.dailyQuiz.remainingCount); // 남은 문제 수

  // useEffect(() => {
  //   // dispatch(fetchDailyAll(remainingCount)); // 남은 문제 수만큼 문제 가져오기
  //   dispatch(fetchDailyAll()); // 남은 문제 수만큼 문제 가져오기
  // }, [dispatch]);


  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState(null);
  const [voiceText, setVoiceText] = useState(null);
  const [answer, setAnswer] = useState(null);

  useEffect(() => {
    if (quizVoiceUrl) {
      const newAudio = new Audio(quizVoiceUrl);
      setAudio(newAudio);
    }
  }, [quizVoiceUrl]);

  // 음성 재생 함수
  const toggleAudio = () => {
    if (isPlaying) {
      audio.pause();
      audio.currentTime = 0;
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (!audio) return;

    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, [audio]);

  useEffect(() => {
    // quizList가 처음 로드될 때까지 기다림
    if (quizList.length > 0) {
      // setIsQuizzesLoaded(true); // 퀴즈 데이터가 로드되었음을 표시
      setVoiceText(quizList[0]?.quizVoiceText);
      setAnswer(quizList[0]?.quizAnswer);
    }
  }, [quizList]);

  useEffect(() => {
    if (!quizList.length) {
      router.push(`/${locale}/main`);
    }
  }, [quizList]);

  const text = voiceText ? voiceText : answer;
  // const fontSize = text.length <= 8 ? 'text-xl' :
  //                 text.length <= 15 ? 'text-md' : 'text-sm';
  // const fontSizeMd = text.length <= 8 ? 'text-md' :
  //                 text.length <= 15 ? 'text-sm' : 'text-xs';

  return (
    <div className="relative h-[90vh]">
      <div className="mb-[10vh]">
        <div className="text-center text-3xl md:text-4xl lg:text-6xl">
          {/* Stage-{stageOrder} */}
        </div>
        <div className="text-center text-xl md:text-2xl lg:text-4xl">
          {/* {`[${1}/${totalQuizzes}]`}  */}
          남은 퀴즈 수 : {totalQuizzes}
        </div>
        <QuizTitle type={type} index={index} />
      </div>
      <button
        onClick={toggleAudio}
        className={`absolute z-10 
          ${quizType === 5001 ? "top-[77%]" : "top-[65%]"} 
        left-[50%] transform -translate-x-1/2 flex-col flex justify-center items-center w-[30vw] h-[10vh]`}>
        <div
          className="w-[50vw] flex justify-between items-center"
          style={{
            backgroundColor: "#23cccc",
            padding: "2vw 5vw 2vw 2vw",
            borderRadius: "50px",
          }}>
          <div
            style={{
              backgroundColor: "#FFFFF0",
              width: "13vw",
              height: "13vw",
              padding: "3vw",
              borderRadius: "50%",
            }}>
            <Image
              src={isPlaying ? Pause : Play}
              alt="play"
              style={{ width: "100%", height: "100%" }}
            />
          </div>
          <div 
            className={`ml-3 flex justify-center items-center
              ${String(text).length >= 20 ? "text-xs" :
                String(text).length >= 8 ?  "text-sm" : "text-xl"}`}
            style={{
              width: "100%",    // 가로는 100%로 채우기
              textAlign: "center", // 텍스트 가운데 정렬
              overflow: "hidden",  // 텍스트가 넘치면 숨기기
            }}>
            {/* {voiceText ? voiceText : answer} */}
            {text}
          </div>
        </div>
      </button>
      <div className="absolute top-[23%] w-[100%] h-[75%] left-1/2 transform -translate-x-1/2">
        <QuizContent type={type} index={index} />
      </div>
    </div>
  );
}
