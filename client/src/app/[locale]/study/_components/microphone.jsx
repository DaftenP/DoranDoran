'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import MicrophoneNormal from '@/public/icon/microphone-normal.webp'
import MicrophoneActive from '@/public/icon/microphone-active.webp'

export default function Microphone({ onTranscriptChange }) {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const toggleListening = () => {
    if (!isListening) {
      startListening();
      console.log(isListening)
    } else {
      stopListening();
      console.log(isListening)
    }
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const recognition = new (window.webkitSpeechRecognition || window.SpeechRecognition)();
      recognitionRef.current = recognition;
      recognition.lang = 'ko-KR';
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognition.continuous = true;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = 0; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
          } else {
            interimTranscript += result[0].transcript;
          }
        }

        setTranscript(finalTranscript || interimTranscript);
        onTranscriptChange(finalTranscript || interimTranscript); // 상위 컴포넌트로 전달
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        if (isListening) {
          recognition.start();
        }
      };

      recognition.start();
    } else {
      alert('Speech recognition is not supported in this browser.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button onClick={toggleListening} className="focus:outline-none">
        <Image
          src={isListening ? MicrophoneActive : MicrophoneNormal}
          alt={isListening ? 'Stop Recording' : 'Start Recording'}
          width={50}
          height={50}
          className="cursor-pointer"
        />
      </button>
      <p className="mt-2">Transcript: {transcript}</p>
    </div>
  );
}
