'use client';

import { useState, useRef, useEffect } from 'react';

export default function STTComponent() {
  const [transcript, setTranscript] = useState(''); // 최종 인식된 텍스트 저장
  const [isListening, setIsListening] = useState(false); // 음성 인식 중인지 여부
  const isListeningRef = useRef(isListening); // 최신 isListening 값을 추적
  const recognitionRef = useRef(null); // SpeechRecognition 객체 참조

  useEffect(() => {
    isListeningRef.current = isListening; // isListening 값이 변경될 때마다 최신 값 저장
  }, [isListening]); // isListening 값이 변경될 때마다 실행

  const toggleListening = () => {
    if (!isListening) {
      startListening();
    } else {
      stopListening();
    }
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      createNewRecognitionInstance(); // 새로운 recognition 인스턴스 생성

      recognitionRef.current.onstart = () => {
        console.log("Speech recognition started");
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
        console.error("Speech recognition error:", event.error);
        stopListening(); // 에러 발생 시 인식 중단
      };

      recognitionRef.current.onend = () => {
        console.log("Speech recognition ended");
        console.log("Current isListeningRef:", isListeningRef.current); // Ref 값을 확인
        if (isListeningRef.current) {
          console.log("Restarting speech recognition...");
          startListening(); // 종료 시 다시 음성 인식 시작
        }
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
      recognitionRef.current.stop(); // 음성 인식을 중단
      setIsListening(false); // 음성 인식 중단 시 상태 변경
      console.log("Speech recognition stopped");
    }
  };

  return (
    <div>
      <button onClick={toggleListening}>
        {isListening ? 'Stop Recording' : 'Start Recording'}
      </button>
      <p>Transcript: {transcript}</p>
    </div>
  );
}