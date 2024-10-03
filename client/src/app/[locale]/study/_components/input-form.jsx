'use client';

import Image from 'next/image'
import { useState, useEffect } from 'react';
import Microphone from './microphone';

export default function InputForm({ quizType, onSubmit }) {
  const [recordedSTT, setRecordedSTT] = useState('');

  const handleSTT = (data) => {
    // console.log(data);
    setRecordedSTT(data);  // 자식으로부터 받은 데이터를 상태에 저장
    onSubmit(data);  // 부모의 부모 컴포넌트로 전달
  };

  return (
    <div className='absolute bottom-[20%] left-1/2 transform -translate-x-1/2'>
      {quizType === 5001 && (
        <div className='hidden'>
        </div>
      )}

      {(quizType === 5002 || quizType === 5003) && !recordedSTT && (
        <div className='flex justify-center items-center'>
          <Microphone onDataSend={handleSTT} />
        </div>
      )}
    </div>
  );
}
