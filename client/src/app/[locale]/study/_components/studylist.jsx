'use client';

import Image from "next/image";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { fetchStageAll } from '@/store/quiz';
import { useLocale, useTranslations, NextIntlClientProvider } from 'next-intl';
import Level from "./level";
import LevelQuiz from "./levelquiz";
import Path from "@/public/path/path.webp";

const pathHeight = 13;

const calculateTopPositions = (dataLength) => {
  const topPositions = [];
  let currentTop = 0;

  for ( let i = 0; i < dataLength; i++){
    const increment = (i % 2 === 1) ? pathHeight : pathHeight * 0.68;
    currentTop += increment;
    topPositions.push(`${currentTop}vh`);
  }
  return topPositions;
}

export default function StudyList({ className }) {
  const dispatch = useDispatch();
  const locale = useLocale();
  const stageList = useSelector((state) => state.quiz.stage.data);

  // console.log(stageList)
  useEffect(() => {
    dispatch(fetchStageAll()); // 컴포넌트가 마운트될 때 stage 데이터 가져오기
  }, [dispatch]);

  const transforms = [
    '',
    'scaleY(-1)',           // 상하 반전
    'scaleX(-1)',           // 좌우 반전
    'scaleX(-1) scaleY(-1)',
  ];

  const quizPosition = ['93%','50%','7%','50%'];
  // const quizPosition = ['50%','93%','50%','7%'];
  const topPositions = calculateTopPositions(stageList.length);
  const colorList = ['#FED9D0', '#E5CBF8', '#FDE1AF', '#E5CBF8'];

  const router = useRouter();

  const handleStepQuiz = (index) => {
    const stageId = stageList[index].id; 
    router.push(`/${locale}/study/detail/${stageId}/${1}`); 
  };

  return (
    <div className={`w-[80vw] h-auto left-[10vw] relative ${className}`}>
      <Level level={1} className="absolute left-1/2 top-[11vh] transform -translate-x-1/2 -translate-y-1/2 z-20"/>
      
      {stageList.map((item, index) => (
        <div key={item.id} className=" w-100%">
          <Image
            src={Path}
            alt="Path"
            className="absolute z-10"
            style={{
              transform: transforms[index % transforms.length], // 회전 및 반전 효과 적용
              width : "50%",
              height : `${pathHeight}vh`,
              top: topPositions[index], 
              left: `${((index & (1 << 1)) != 0) ? '0%' : '50%'}`, // 지그재그 형태로 배치
            }}
          />

          <div onClick={() => handleStepQuiz(index)}>
            <LevelQuiz
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
              style={{
                backgroundColor: colorList[index % colorList.length],
                top: `${index * pathHeight * 0.84 + 22}vh`, // Path와 Quiz의 간격 조정
                left: quizPosition[index % quizPosition.length], 
              }}
              index={index}
            />
          </div>
        </div>
        ))}
    </div>
  );
}