'use client'

import { useState, useRef } from 'react';

export default function STTComponent() {
  const [transcript, setTranscript] = useState(''); // 음성 인식된 텍스트를 저장
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
      recognition.lang = 'ko-KR'; // 사용할 언어 설정 (한국어는 'ko-KR')
      recognition.interimResults = true; // 중간 결과 수신 여부 (true로 설정)
      recognition.maxAlternatives = 1; // 결과 대안 개수
      recognition.continuous = true; // 연속적으로 인식하게 설정

      recognition.onstart = () => {
        console.log("Speech recognition started");
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        // 중간 및 최종 결과 처리
        for (let i = 0; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript; // 최종 결과
          } else {
            interimTranscript += result[0].transcript; // 중간 결과
          }
        }

        setTranscript(finalTranscript || interimTranscript); // 중간 결과 및 최종 결과 업데이트
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        console.log("Speech recognition ended");
        if (isListening) {
          recognition.start(); // 음성 인식이 종료되었을 때 다시 시작
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
