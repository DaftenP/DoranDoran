'use client';

import { useState, useRef } from 'react';

export default function STTComponent() {
  const [transcript, setTranscript] = useState(''); // 최종 인식된 텍스트 저장
  const [isListening, setIsListening] = useState(false); // 음성 인식 중인지 여부
  const recognitionRef = useRef(null); // SpeechRecognition 객체 참조

  const toggleListening = () => {
    if (!isListening) {
      startListening();
    } else {
      stopListening();
    }
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const recognition = new (window.webkitSpeechRecognition || window.SpeechRecognition)();
      recognitionRef.current = recognition;
      recognition.lang = 'ko-KR'; // 사용할 언어 설정
      recognition.interimResults = false; // 중간 결과 수신 여부
      recognition.maxAlternatives = 1; // 결과 대안 개수
      recognition.continuous = true; // 연속적으로 인식하게 설정 (자동 종료 방지)

      recognition.onstart = () => {
        console.log("Speech recognition started");
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        let finalTranscript = '';

        for (let i = 0; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript; // 최종 결과 저장
          }
        }

        setTranscript(finalTranscript); // 최종 결과 텍스트로 업데이트
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        if (isListening) {
          recognition.start(); // 사용자가 수동으로 중단하기 전까지 계속 인식
        }
      };

      recognition.start();
    } else {
      alert('Speech recognition is not supported in this browser.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop(); // 음성 인식을 중단
      setIsListening(false);
      console.log("Speech recognition stopped");
      setTranscript(''); // 텍스트 초기화
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
