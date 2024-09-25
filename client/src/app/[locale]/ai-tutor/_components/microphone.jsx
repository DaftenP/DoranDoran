'use client';

import { useLocale, useTranslations, NextIntlClientProvider } from 'next-intl';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image'
import MicrophoneNormal from '@/public/icon/microphone-normal.webp'
import MicrophoneActive from '@/public/icon/microphone-active.webp'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function Microphone ({ onRecordingComplete }) {
  const [messages, setMessages] = useState(null);
  const locale = useLocale();

  useEffect(() => {
    async function loadMessages() {
      try {
        const loadedMessages = await import(`messages/${locale}.json`);
        setMessages(loadedMessages.default); // 메시지 로드
      } catch (error) {
        console.error(`Failed to load messages for locale: ${locale}`);
      }
    }
    loadMessages();
  }, [locale]);

  if (!messages) {
    return <div>Loading...</div>; // 메시지가 로드될 때까지 로딩 표시
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <TranslatedMicrophone onRecordingComplete={onRecordingComplete}/>
    </NextIntlClientProvider>
  );
}

function TranslatedMicrophone({ onRecordingComplete }) {
  const t = useTranslations('index');
  const [progress, setProgress] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState(null)
  const audioChunks = useRef([])
  const audioContext = useRef(null)
  
  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setProgress(prev => (prev < 100 ? prev + (100 / 30) : (setIsRunning(false), clearInterval(interval), 100))); // 30초 동안 100%로 증가
      }, 1000);
  
      return () => clearInterval(interval);
    }
  }, [isRunning, progress]);

  const handleMicrophoneClick = async () => {
    if (!isRunning) {
      // 녹음 시작
      setProgress(0);
      setIsRunning(true);

      try {
        // 사용자에게 마이크 권한 요청
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        // 16kHz로 설정
        audioContext.current = new AudioContext({ sampleRate: 16000 });
        const input = audioContext.current.createMediaStreamSource(stream);

        // WebM으로 녹음, 이후 PCM으로 변환
        const recorder = new MediaRecorder(stream, {
          mimeType: 'audio/webm',
        });

        // 녹음된 데이터를 배열에 저장
        recorder.ondataavailable = (e) => {
          audioChunks.current.push(e.data);
        };

        recorder.onstop = () => {
          // 녹음이 끝난 후 PCM으로 변환
          const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
          convertToPCM(audioBlob);
        };

        recorder.start();
        setMediaRecorder(recorder);

        // 30초 후 자동으로 녹음 중지
        setTimeout(() => {
          if (recorder.state === 'recording') {
            recorder.stop();
            onRecordingComplete()
            setIsRunning(false);
          }
        }, 30000);
      } catch (error) {
        console.error('녹음 시작 오류:', error);
      }
    } else {
      // 녹음 중지
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        onRecordingComplete()
        setIsRunning(false);
      }
    }
  };

  const convertToPCM = async (audioBlob) => {
    // Blob을 ArrayBuffer로 변환
    const arrayBuffer = await audioBlob.arrayBuffer();
    const audioBuffer = await audioContext.current.decodeAudioData(arrayBuffer);

    // PCM으로 변환
    const rawPCM = convertToRawPCM(audioBuffer);
    
    // PCM 파일을 로컬에 저장
    saveFileLocally(rawPCM);
  };

  const convertToRawPCM = (audioBuffer) => {
    const numberOfChannels = audioBuffer.numberOfChannels;
    const length = audioBuffer.length * numberOfChannels * 2; // 16-bit PCM
    const result = new DataView(new ArrayBuffer(length));

    let offset = 0;
    for (let i = 0; i < audioBuffer.length; i++) {
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const sample = audioBuffer.getChannelData(channel)[i];
        const intSample = Math.max(-1, Math.min(1, sample)); // -1과 1 사이로 클리핑
        result.setInt16(offset, intSample * 0x7fff, true); // 16-bit PCM
        offset += 2;
      }
    }

    return result;
  };

  const saveFileLocally = (pcmData) => {
    // 1. PCM 데이터를 Blob으로 생성, .raw 파일로 저장할 것이므로 type은 audio/raw로 설정
    const blob = new Blob([pcmData], { type: 'audio/raw' });
  
    // 2. Blob을 가리키는 URL을 생성
    const url = URL.createObjectURL(blob);
  
    // 3. 가상의 a 태그를 생성하여 다운로드 링크 생성
    const a = document.createElement('a');
    a.style.display = 'none';  // 화면에 표시되지 않도록 설정
    a.href = url;
    a.download = 'recording.raw';  // 파일 이름을 .raw로 설정
  
    // 4. a 태그를 body에 추가한 후 자동 클릭하여 다운로드 실행
    document.body.appendChild(a);
    a.click();  // 다운로드 시작
  
    // 5. 다운로드 후 a 태그를 제거하고 URL 객체를 해제
    document.body.removeChild(a);
    URL.revokeObjectURL(url);  // 메모리 해제
  };

  // const convertToPCM = async (audioBlob) => {
  //   // Blob을 ArrayBuffer로 변환
  //   const arrayBuffer = await audioBlob.arrayBuffer();
  //   const audioBuffer = await audioContext.current.decodeAudioData(arrayBuffer);

  //   // PCM으로 변환
  //   const rawPCM = convertToRawPCM(audioBuffer);
  //   // 서버로 전송
  //   uploadPCM(rawPCM);
  // };

  // const convertToRawPCM = (audioBuffer) => {
  //   const numberOfChannels = audioBuffer.numberOfChannels;
  //   const length = audioBuffer.length * numberOfChannels * 2; // 16-bit PCM
  //   const result = new DataView(new ArrayBuffer(length));

  //   let offset = 0;
  //   for (let i = 0; i < audioBuffer.length; i++) {
  //     for (let channel = 0; channel < numberOfChannels; channel++) {
  //       const sample = audioBuffer.getChannelData(channel)[i];
  //       const intSample = Math.max(-1, Math.min(1, sample)); // -1과 1 사이로 클리핑
  //       result.setInt16(offset, intSample * 0x7fff, true); // 16-bit PCM
  //       offset += 2;
  //     }
  //   }

  //   return result;
  // };

  // const uploadPCM = async (pcmData) => {
  //   const blob = new Blob([pcmData], { type: 'audio/pcm' });
  //   const formData = new FormData();
  //   formData.append('file', blob, 'recording.pcm');

  //   try {
  //     const response = await fetch('/api/upload', {
  //       method: 'POST',
  //       body: formData,
  //     });
  //     if (response.ok) {
  //       console.log('녹음 파일이 성공적으로 업로드되었습니다.');
  //     } else {
  //       console.error('파일 업로드 실패:', response.status);
  //     }
  //   } catch (error) {
  //     console.error('파일 업로드 중 오류:', error);
  //   }
  // };

  return (
    <div className='relative flex-col flex items-center justify-center mr-[20vw] ml-[20vw]'>
      <div className='w-[16vh] h-[16vh]'>
        <CircularProgressbar
          value={progress}
          strokeWidth={5}
          styles={buildStyles({
            pathColor: progress === 100 ? '#ACACAC' : `rgba(255, 0, 0, ${progress / 100})`,
            trailColor: '#ACACAC',
          })}
        />
      </div>
      {isRunning ? (
        <Image onClick={handleMicrophoneClick} src={MicrophoneActive} alt="microphone_icon" className="absolute cursor-pointer w-[13vh] h-[13vh]" />
      ) : (
        <Image onClick={handleMicrophoneClick} src={MicrophoneNormal} alt="microphone_icon" className="absolute cursor-pointer w-[13vh] h-[13vh]" />
      )}
    </div>
  );
}
