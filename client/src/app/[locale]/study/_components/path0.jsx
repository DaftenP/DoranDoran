'use client';

import Image from "next/image";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations, NextIntlClientProvider } from 'next-intl';
import Level from "./level";
import LevelQuiz from "./levelquiz";
import Path from "@/public/path/path0.webp";


export default function Path0({ className }) {
  return (
    <div className={`w-[80vw] h-[30vh] left-[10vw] relative ${className}`}>
      <Image
        src={Path}
        alt="Path"
        fill
        className="absolute z-1"
        style={{ top: "15%" }}
        priority
      />
      <Level level={1} className="absolute left-1/2 top-[0%] transform -translate-x-1/2"/>
      <LevelQuiz className="bg-[#FED9D0] absolute left-[7%] top-[100%] border-[7px] border-white transform -translate-x-1/2"/>
      <LevelQuiz className="bg-[#E5CBF8] absolute left-1/2 top-[67%] border-[7px] border-white transform -translate-x-1/2"/>
      <LevelQuiz className="bg-[#FDE1AF] absolute left-[93%] top-[33%] border-[7px] border-white transform -translate-x-1/2"/>
    </div>
  );
}