'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import MicrophoneNormal from '@/public/icon/microphone-normal.webp'
import MicrophoneActive from '@/public/icon/microphone-active.webp'

export default function STTComponent({ onDataSend, onListeningChange }) {
  const [transcript, setTranscript] = useState(''); // 최종 인식된 텍스트 저장
  const [isListening, setIsListening] = useState(false); // 음성 인식 중인지 여부
  const isListeningRef = useRef(isListening); // 최신 isListening 값을 추적
  const recognitionRef = useRef(null); // SpeechRecognition 객체 참조

  useEffect(() => {
    isListeningRef.current = isListening;
    onListeningChange(isListening); // isListening 상태 변경 시 상위로 전달
  }, [isListening, onListeningChange]);

  const sendSTT = () => {
    // const newTranscript = '고양이'; // 임시로 설정한 값
    // setTranscript(newTranscript);

    if (transcript.trim()) {
      onDataSend(transcript);  // newTranscript를 사용해 부모에게 데이터 전달
      setTranscript(''); // 전송 후 텍스트 초기화
    }
  };

  useEffect(() => {
    if (transcript.trim()) {
      // console.log('Sending transcript with useEffect:', transcript);
      sendSTT();
    }
  }, [transcript]); // transcript가 업데이트될 때마다 sendSTT 호출

  const toggleListening = () => {
    if (!isListening) {
      startListening();
    } else {
      stopListening();
      sendSTT(); // 녹음을 멈추면 부모로 데이터 전달
    }
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      createNewRecognitionInstance(); // 새로운 recognition 인스턴스 생성

      recognitionRef.current.onstart = () => {
        // console.log("Speech recognition started");
        setIsListening(true); // 음성 인식이 시작되면 상태를 true로 설정
      };

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';

        for (let i = 0; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript; // 최종 결과 저장
          }
        }

        setTranscript((prevTranscript) => prevTranscript + ' ' + finalTranscript); // 최종 결과 누적
      };

      recognitionRef.current.onerror = (event) => {
        // console.error("Speech recognition error:", event.error);
        stopListening(); // 에러 발생 시 인식 중단
      };

      recognitionRef.current.onend = () => {
        // console.log("Speech recognition ended");
        setIsListening(false); // 종료 시 상태를 false로 변경
        // sendSTT(); // 녹음이 종료되면 STT 데이터를 바로 전송
      };

      recognitionRef.current.start();
    } else {
      alert('Speech recognition is not supported in this browser.');
    }
  };

  const createNewRecognitionInstance = () => {
    const recognition = new (window.webkitSpeechRecognition || window.SpeechRecognition)();
    recognition.lang = 'ko-KR'; // 사용할 언어 설정
    recognition.interimResults = false; // 중간 결과 수신 여부
    recognition.maxAlternatives = 1; // 결과 대안 개수
    recognition.continuous = false; // 연속 인식 비활성화

    recognitionRef.current = recognition; // 새로운 recognition 인스턴스를 참조
  };

  const stopListening = () => {
    if (recognitionRef.current) { 
      recognitionRef.current.stop(); // 음성 인식 중단
      // console.log("Speech recognition stopped");
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
      
      {/* <p className="mt-2">Transcript: {transcript}</p> */}
    </div>
  );
}
