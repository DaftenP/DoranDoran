'use client';

import Image from "next/image";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations, NextIntlClientProvider } from 'next-intl';
import Level from "./_components/level";
import StudyList from "./_components/studylist";


export default function Study() {
  return (
    <div className="w-[100vw] h-[100vh] relative">
      <Level level={1} className="absolute left-1/2 top-[14vh] transform -translate-x-1/2"/>
      <Level level={2} className="absolute left-1/2 top-[54vh] transform -translate-x-1/2"/>
      <Level level={3} className="absolute left-1/2 top-[93.5vh] transform -translate-x-1/2"/>
      <Level level={4} className="absolute left-1/2 top-[133vh] transform -translate-x-1/2"/>
      <Level level={5} className="absolute left-1/2 top-[173vh] transform -translate-x-1/2"/>
      <StudyList className="bg-[#FED9D0] absolute left-[14vw] top-[44vh] border-[7px] border-white transform -translate-x-1/2"/>
      <StudyList className="bg-[#FED9D0] absolute left-[14vw] top-[84vh] border-[7px] border-white transform -translate-x-1/2"/>
      <StudyList className="bg-[#FED9D0] absolute left-[14vw] top-[124vh] border-[7px] border-white transform -translate-x-1/2"/>
      <StudyList className="bg-[#FED9D0] absolute left-[14vw] top-[164vh] border-[7px] border-white transform -translate-x-1/2"/>
      <StudyList className="bg-[#E5CBF8] absolute left-1/2 top-[34vh] border-[7px] border-white transform -translate-x-1/2"/>
      <StudyList className="bg-[#E5CBF8] absolute left-1/2 top-[74vh] border-[7px] border-white transform -translate-x-1/2"/>
      <StudyList className="bg-[#E5CBF8] absolute left-1/2 top-[114vh] border-[7px] border-white transform -translate-x-1/2"/>
      <StudyList className="bg-[#E5CBF8] absolute left-1/2 top-[154vh] border-[7px] border-white transform -translate-x-1/2"/>
      <StudyList className="bg-[#FDE1AF] absolute left-[86vw] top-[24vh] border-[7px] border-white transform -translate-x-1/2"/>
      <StudyList className="bg-[#FDE1AF] absolute left-[86vw] top-[64vh] border-[7px] border-white transform -translate-x-1/2"/>
      <StudyList className="bg-[#FDE1AF] absolute left-[86vw] top-[104vh] border-[7px] border-white transform -translate-x-1/2"/>
      <StudyList className="bg-[#FDE1AF] absolute left-[86vw] top-[144vh] border-[7px] border-white transform -translate-x-1/2"/>
    </div>
  );
}