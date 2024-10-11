'use client';

import { useState, useEffect } from 'react';
import Microphone from './microphone';

export default function InputForm({ quizType, onSubmit }) {
  const [isListening, setIsListening] = useState(false);
  const [recordedSTT, setRecordedSTT] = useState('');

  const handleSTT = (data) => {
    setRecordedSTT(data);  // 자식으로부터 받은 데이터를 상태에 저장
    onSubmit(data);  // 부모의 부모 컴포넌트로 전달
  };

  const handleListeningChange = (listeningStatus) => {
    setIsListening(listeningStatus);
  };

  return (
    <div className='absolute bottom-[3%] left-1/2 transform -translate-x-1/2'>
      {quizType === 5001 && (
        <div className='hidden'>
        </div>
      )}

      {(quizType === 5002 || quizType === 5003) && !recordedSTT && (
        <div className={`w-[20vw] h-[20vw] p-[10%] flex justify-center items-center border border-4 ${isListening ? 'border-red-500' : 'border-black'} rounded-full`}>
          <Microphone onDataSend={handleSTT} onListeningChange={handleListeningChange}/>
        </div>
      )}
    </div>
  );
}
