'use client';

import { useLocale, useTranslations, NextIntlClientProvider } from 'next-intl';
import { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchChatMessages, addResponseMessage, addMyMessage, addSimpleResponseMessage, addSimpleMyMessage, deleteMyMessage } from '@/store/ai-tutor';
// import { useSpeechRecognition } from 'react-speech-kit'
import Link from 'next/link';
import Image from 'next/image'
import MicrophoneNormal from '@/public/icon/microphone-normal.webp'
import MicrophoneActive from '@/public/icon/microphone-active.webp'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function Microphone ({ onRecordingComplete, params }) {
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
      <TranslatedMicrophone onRecordingComplete={onRecordingComplete} params={params} />
    </NextIntlClientProvider>
  );
}

function TranslatedMicrophone({ onRecordingComplete, params }) {
  const t = useTranslations('index');
  const dispatch = useDispatch()
  // const messages = useSelector((state) => state.aiTutor.messages)
  // const chatMessages = useSelector((state) => state.aiTutor.chatMessages)
  const recordMessageRef = useRef('')
  const [progress, setProgress] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState(null)
  const [recordMessage, setRecordMessage] = useState('')
  const [recognition, setRecognition] = useState(null);
  const audioChunks = useRef([])
  const audioContext = useRef(null)
  const locale = params.locale;
  const role = params.people;
  const situation = params.topic;

  useEffect(() => {
    recordMessageRef.current = recordMessage;
  }, [recordMessage])
  
  // useEffect(() => {
  //   if (isRunning) {
  //     const interval = setInterval(() => {
  //       setProgress(prev => (prev < 100 ? prev + (100 / 30) : (setIsRunning(false), clearInterval(interval), 100))); // 30초 동안 100%로 증가
  //     }, 1000);
  
  //     return () => clearInterval(interval);
  //   }
  // }, [isRunning, progress]);

  // const { listen, listening, stop } = useSpeechRecognition({
  //   onResult: (result) => {
  //     // 기존 recordMessage에 새로운 결과를 추가
  //     setRecordMessage((prevMessage) => prevMessage + ' ' + result);
  //   },
  // });

  // const handleMicrophoneClick = async () => {
  //   if (!isRunning) {
  //     // 녹음 시작
  //     setProgress(0);
  //     setIsRunning(true);

  //     try {
  //       // 사용자에게 마이크 권한 요청
  //       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  //       // 16kHz로 설정
  //       audioContext.current = new AudioContext({ sampleRate: 16000 });
  //       const input = audioContext.current.createMediaStreamSource(stream);

  //       // WebM으로 녹음, 이후 PCM으로 변환
  //       const recorder = new MediaRecorder(stream, {
  //         mimeType: 'audio/webm',
  //       });

  //       // 녹음된 데이터를 배열에 저장
  //       recorder.ondataavailable = (e) => {
  //         audioChunks.current.push(e.data);
  //       };

  //       recorder.onstop = () => {
  //         stop()
  //         // 녹음이 끝난 후 PCM으로 변환
  //         if (!isRunning) {
  //           const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
  //           convertToPCM(audioBlob); // PCM 변환 후 폼 전송
  //         }
  //       };

  //       recorder.start();
  //       setMediaRecorder(recorder);

  //       // 30초 후 자동으로 녹음 중지
  //       setTimeout(() => {
  //         if (recorder.state === 'recording') {
  //           recorder.stop();
  //           onRecordingComplete()
  //           setIsRunning(false);
  //         }
  //       }, 30000);

  //       listen({ interimResults: false })
  //     } catch (error) {
  //       console.error('녹음 시작 오류:', error);
  //     }
  //   } else {
  //     // 녹음 중지
  //     if (mediaRecorder && mediaRecorder.state === 'recording') {
  //       mediaRecorder.stop();
  //       onRecordingComplete()
  //       setIsRunning(false);

  //       stop()
  //     }
  //   }
  // };

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setProgress((prev) => (prev < 100 ? prev + (100 / 30) : (setIsRunning(false), clearInterval(interval), 100))); // 30초 동안 100%로 증가
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isRunning, progress]);

  // Web Speech API 초기화
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const speechRecognition = new SpeechRecognition();
  
      speechRecognition.continuous = true; // 연속 모드 설정
      speechRecognition.interimResults = true; // 중간 결과 활성화
      speechRecognition.lang = 'ko-kr'; // 언어 설정
  
      // 음성 인식 결과를 받는 이벤트 처리
      speechRecognition.onresult = (event) => {
        let interimTranscript = ''; // 중간 결과를 저장할 변수
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            setRecordMessage((prev) => prev + ' ' + transcript); // 최종 결과만 기록
          } else {
            interimTranscript += transcript; // 중간 결과 기록
          }
        }
        console.log('중간 결과:', interimTranscript);
      };
  
      // 인식이 끝났을 때 자동으로 재시작
      speechRecognition.onend = () => {
        if (isRunning) {
          setTimeout(() => {
            speechRecognition.start(); // 인식이 끝나면 자동으로 다시 시작
          }, 500); // 잠시 대기 후 재시작
        }
      };
  
      // 인식 중 오류 발생 시
      speechRecognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };
  
      setRecognition(speechRecognition); // 초기화된 인식 객체 저장
    }
  }, [locale]);
  
  const handleMicrophoneClick = async () => {
    if (!isRunning) {
      // 녹음 시작
      setProgress(0);
      setIsRunning(true);
      startRecording();
      recognition.start(); // Web Speech API 음성 인식 시작
    } else {
      // 녹음 중지
      onRecordingComplete();
      stopRecording();
      recognition.stop(); // Web Speech API 음성 인식 중지
  
      // 녹음이 중지되었을 때도 서버로 음성 데이터를 전송
      if (audioChunks.current.length > 0) {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        convertToPCM(audioBlob); // PCM 변환 후 서버로 전송
      }
  
      setIsRunning(false);
    }
  };
  
  const startRecording = async () => {
    try {
      // 마이크 권한 요청
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  
      // 16kHz로 설정
      audioContext.current = new AudioContext({ sampleRate: 16000 });
      const input = audioContext.current.createMediaStreamSource(stream);
  
      // WebM으로 녹음
      const recorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      });
  
      recorder.ondataavailable = (e) => {
        audioChunks.current.push(e.data); // 녹음된 데이터를 저장
      };
  
      recorder.onstop = () => {
        if (!isRunning) {
          const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
          convertToPCM(audioBlob); // PCM 변환 후 서버로 전송
        }
      };
  
      recorder.start();
      setMediaRecorder(recorder);
  
      // 30초 후 자동으로 녹음 중지
      setTimeout(() => {
        if (recorder.state === 'recording') {
          recorder.stop();
          onRecordingComplete();
          setIsRunning(false);
        }
      }, 30000);
    } catch (error) {
      console.error('녹음 시작 오류:', error);
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop(); // 녹음 중지
    }
    setIsRunning(false); // 녹음 상태 변경
  };
  
  const convertToPCM = async (audioBlob) => {
    // Blob을 ArrayBuffer로 변환
    const arrayBuffer = await audioBlob.arrayBuffer();
    const audioBuffer = await audioContext.current.decodeAudioData(arrayBuffer);

    // PCM으로 변환
    const rawPCM = convertToRawPCM(audioBuffer);
    
    sendForm(rawPCM)
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

  const sendForm = (pcmData) => {
    const blob = new Blob([pcmData], { type: 'audio/raw' });
    const formData = new FormData();

    // formData.append('messages', JSON.stringify(messages));
    formData.append('msg', recordMessageRef.current);
    formData.append('file', blob, 'recording.raw');

    dispatch(fetchChatMessages({ role, situation, locale, formData }))
      .unwrap()
      .then((response) => {
        const messageContent = recordMessageRef.current || t("please-speak")
        dispatch(addMyMessage({ content: messageContent }));
        dispatch(addSimpleMyMessage({ content: messageContent }));
        dispatch(addResponseMessage(response.data));
        dispatch(addSimpleResponseMessage(response.data));
        dispatch(deleteMyMessage());

        return response;
      })
      .then((response) => {
        if (!response.data.isOver) {
          dispatch(addMyMessage({ content: '' }));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className='flex-col flex items-center justify-center min-w-[60vw]'>
      <div className="relative flex items-center justify-center w-[16vh] h-[16vh]">
        <CircularProgressbar
          value={progress}
          strokeWidth={5}
          styles={buildStyles({
            pathColor: progress === 100 ? '#ACACAC' : `rgba(255, 0, 0, ${progress / 100})`,
            trailColor: '#ACACAC',
          })}
          className="absolute inset-0"
        />
        {isRunning ? (
          <Image onClick={handleMicrophoneClick} src={MicrophoneActive} alt="microphone_icon" className="absolute w-[13vh] h-[13vh] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer" />
        ) : (
          <Image onClick={handleMicrophoneClick} src={MicrophoneNormal} alt="microphone_icon" className="absolute w-[13vh] h-[13vh] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer" />
        )}
      </div>
      <div>{recordMessage}</div>
    </div>
  );
}
