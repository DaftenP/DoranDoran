'use client';

import Image from "next/image";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import StudyList from "./_components/studylist";


export default function Study() {
  return (
    <div className="w-[100vw] h-[90vh] relative">
      <StudyList className="absolute top-[10vh]" />
      
    </div>
  );
}