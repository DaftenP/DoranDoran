'use client';

import Image from 'next/image'
import { useState } from 'react';
import Microphone from './microphone';

export default function InputForm({ quizType, onSubmit }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [transcript, setTranscript] = useState(''); // 음성 인식 텍스트를 저장

  const handleMicrophoneClick = () => {
    setIsRecording((prev) => !prev);
  };

  const handleTranscriptChange = (newTranscript) => {
    setTranscript(newTranscript); // 새로운 transcript로 상태 업데이트
    // console.log(newTranscript)
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    onSubmit(transcript); // transcript를 인자로 넘김
  };

  return (
    <>
      {quizType === 5001 && !isSubmitted && (
        <div className='hidden'>
        </div>
      )}

      {quizType === 5002 && !isSubmitted && (
        <div className='flex justify-center items-center'>
          <Microphone onTranscriptChange={handleTranscriptChange} />
        </div>
      )}
    </>
  );
}
