'use client';

import { useLocale, useTranslations, NextIntlClientProvider } from 'next-intl';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChatMessages, typeChange, changeChatMessages, changeMessages, resetState, addResponseMessage, addMyMessage, addSimpleResponseMessage, addSimpleMyMessage } from '@/store/ai-tutor';
import { updateTutorLimit, fetchUserData } from '@/store/user';
import Modal from '@/components/modal/modal'
import Link from 'next/link';
import Image from 'next/image';
import Back from '@/public/icon/back.webp';
import NewTopic from '@/public/icon/new-topic.webp';
import Manual from '@/public/icon/manual.webp';
import ChatAi from '@/app/[locale]/ai-tutor/_components/chat-ai';
import ChatMe from '@/app/[locale]/ai-tutor/_components/chat-me';
import ChatHint from '@/app/[locale]/ai-tutor/_components/chat-hint';
import { motion, AnimatePresence } from 'framer-motion'

export default function Conversation({ params }) {
  const [messages, setMessages] = useState(null);
  const locale = useLocale();

  useEffect(() => {
    async function loadMessages() {
      try {
        const loadedMessages = await import(`messages/${locale}.json`);
        setMessages(loadedMessages.default); // 메시지 로드
      } catch (error) {
        // console.error(`Failed to load messages for locale: ${locale}`);
      }
    }
    loadMessages();
  }, [locale]);

  if (!messages) {
    return <div>Loading...</div>; // 메시지가 로드될 때까지 로딩 표시
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <TranslatedTopicConversation params={params} />
    </NextIntlClientProvider>
  );
}

function TranslatedTopicConversation({ params }) {
  const t = useTranslations('index');
  const dispatch = useDispatch()
  const router = useRouter()
  const { chatMessages, messages, loading, error } = useSelector((state) => state.aiTutor)
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [modalMessage, setModalMessage] = useState(null)
  const [isEnd, setIsEnd] = useState(false)
  const locale = params.locale;
  const role = params.people;
  const situation = params.topic;
  const effectVolume = useSelector((state) => state.sound.effectVolume)
  const user = useSelector((state) => state.user)
  const [isFinished, setIsFinished] = useState(false)
  const boxRef = useRef(null)

  // 스크롤을 제일 마지막으로 지속해서 이동
  const scrollToBottom = () => {
    const scrollableContainer = document.getElementById('chat-container');
    if (scrollableContainer) {
      scrollableContainer.scrollTop = scrollableContainer.scrollHeight;
    }
  };

  // 스크롤 이동
  useEffect(() => {
    if (isFinished && boxRef.current) {
      boxRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isFinished]);
  
  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  useEffect(() => {
    dispatch(fetchUserData())
    const tutorData = JSON.parse(localStorage.getItem('tutor'));
    const storedData = localStorage.getItem('aiTutorState');

    // 스토리지에 데이터가 없고, 튜터 데이터는 스토리지에 있지만 0개일 때 > 0개인데 강제로 접근
    if (!storedData && tutorData && tutorData.tutorLimit === 0) {
      setIsEnd(true)
      handleOpenModal(4)
    } else {
      dispatch(typeChange([role, situation]))
      // 로컬 스토리지에서 chatMessages와 messages 불러오기
      const storedData = localStorage.getItem('aiTutorState');
      if (storedData) {
        const parsedData = JSON.parse(storedData);

        // 로컬 스토리지에 chatMessages와 messages가 있는 경우 Redux에 반영
        if (parsedData.chatMessages.length > 0 || parsedData.messages.length > 0) {

          // Redux 상태 업데이트
          dispatch(changeChatMessages(parsedData.chatMessages));
          dispatch(changeMessages(parsedData.messages));

          return; // fetch 작업 실행하지 않음
        }
      }

      // 로컬 스토리지에 데이터가 없으면 fetch 작업 실행
      const formData = new FormData();
      formData.append('msg', '');

      dispatch(fetchChatMessages({ role, situation, locale, formData }))
        .unwrap()
        .then((response) => {
          dispatch(updateTutorLimit(-1))
          decrementTutorLimit()
          const audio = new Audio('/bgm/message-incoming.mp3')
          audio.volume = effectVolume
          audio.play();
          dispatch(addResponseMessage(response.data));
          dispatch(addSimpleResponseMessage(response.data));
          dispatch(addMyMessage({ content: '', score: 0 }));
        })
        .catch((error) => {
          // console.log(error);
        });
    }
  }, [dispatch]);

  const letters = "L o a d i n g ...".split("");

  const containerVariants = {
    initial: { opacity: 1 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // 각 글자가 차례로 애니메이션
        repeatDelay: 1,
      }
    }
  };

  const letterVariants = {
    initial: { opacity: 0.4, scale: 0.8 },
    animate: { opacity: 1, scale: 1.5 },
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    }
  };
  
  const handleYesClick = (buttonLink) => {
    setIsOpenModal(false)
    if (buttonLink === 'ai-tutor') {
      dispatch(resetState())
      router.push(`/${locale}/${buttonLink}`)
    } else if (buttonLink === 'new-ai-tutor') {
      dispatch(resetState())
      router.push(`/${locale}/ai-tutor`)
    } else {
      router.push(`/${locale}/${buttonLink}`)
    }
  }

  const decrementTutorLimit = () => {
    const tutorData = JSON.parse(localStorage.getItem('tutor'))

    if (tutorData && tutorData.tutorLimit > 0) {
      tutorData.tutorLimit -= 1;
      localStorage.setItem('tutor', JSON.stringify(tutorData));
    }
  }

  const handleOpenModal = (messageIndex) => {
    setModalMessage(modalMessages[messageIndex])
    setIsOpenModal(true)
  }

  const handleCloseModal = () => {
    setIsOpenModal(false)
    if (isEnd) {
      setIsEnd(false)
      router.push(`/${locale}/main`)
    }
  }

  const handleIsOver = () => {
    // handleOpenModal(3)
    setIsEnd(true)
    setIsFinished(true)
  }

  const modalMessages = [
    // 대화종료 메세지
    {
      'message': 'the-conversation-has-ended-Would-you-like-to-start-a-new-topic',
      'background': 'bird',
      'buttonLink': 'ai-tutor',
      'buttonType': 1
    },
    // 새로운 주제 선택
    {
      'message': 'would-you-like-to select-a-new-topic-if-you-do-the-chat-history-will-be-deleted',
      'background': 'bird',
      'buttonLink': 'new-ai-tutor',
      'buttonType': 1
    },
    // 뒤로가기
    {
      'message': 'would-you-like-to-return-to-the-home-screen?',
      'background': 'bird',
      'buttonLink': 'main',
      'buttonType': 1
    },
    // 대화 종료 메세지
    {
      'message': 'the-conversation-has-ended-Would-you-like-to-start-a-new-topic',
      'background': 'bird',
      'buttonLink': 'ai-tutor',
      'buttonType': 1
    },
    // 스피커 부족 메세지
    {
      'message' : "you-cannot-proceed-with-free-talking-you-don't-have-enough-speakers",
      'background': 'bird',
      'image': 'megaphone',
      'buttonLink': 'ai-tutor',
      'buttonType': 2
    },
  ]

  const chatBubbleVariants = {
    hidden: { opacity: 0, y: 20 },  // 처음에 아래에서 시작
    visible: { opacity: 1, y: 0 },  // 화면에 나타나면 위치와 투명도가 변경
    exit: { opacity: 0, y: -20 }    // 사라질 때 위로 이동
  };

  return (
    <div>
      <div className='flex justify-between mt-[2vh]'>
        <div>
          <Image onClick={() => handleOpenModal(2)} src={Back} alt="back" className="w-9 h-9 md:w-12 md:h-12 lg:w-16 lg:h-16 cursor-pointer ml-4" />
        </div>
        <div className="cursor-pointer">
          <Image src={Manual} alt="manual_icon" className="w-9 h-9 md:w-12 md:h-12 lg:w-16 lg:h-16 mr-4 pointer-events-none" />
        </div>
      </div>
      <div className='flex-col flex justify-center items-center'>
      <div className='flex justify-center items-center text-2xl md:text-4xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500'>
          {t("ai-tutor")}
          <Image onClick={() => handleOpenModal(1)} src={NewTopic} alt='new_topic_icon' className='w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 cursor-pointer ml-2'/>
        </div>
      </div>
      <div id="chat-container" className='max-h-[87vh] overflow-y-scroll hide-scrollbar'>
        {chatMessages.length > 0 ? (
          chatMessages.map((msg, index) => {
            if (msg.role === 'assistant') {
              return (
                <motion.div
                  key={index}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.5 }}
                  variants={chatBubbleVariants}
                >
                  <ChatAi index={index} message={msg} handleIsOver={handleIsOver} />
                  <AnimatePresence>
                    {msg.isHint === true && (
                      <motion.div
                        key="hint"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.5 }}
                        variants={chatBubbleVariants}
                      >
                        <ChatHint index={index} message={msg} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
          } else if (msg.role === 'user') {
              return (
                <motion.div
                  key={index}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.5 }}
                  variants={chatBubbleVariants}
                >
                  <ChatMe index={index} message={msg} params={params} />
                </motion.div>
              )
            }
          })
        ) : (
          <div className='flex justify-center items-center h-[80vh] text-2xl md:text-4xl lg:text-6xl'>
            <motion.div
              className="flex space-x-2"
              variants={containerVariants}
              initial="initial"
              animate="animate"
            >
              {letters.map((letter, index) => (
                <motion.span key={index} variants={letterVariants}>
                  {letter}
                </motion.span>
              ))}
            </motion.div>
          </div>
        )}
        {isFinished && 
          <div className='flex justify-center'>
            <div className="flex justify-center items-center w-[80vw] p-4 bg-gradient-to-r from-gray-500 to-gray-500 border-none rounded-full shadow-md text-center opacity-95">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-white">
              {t("the-conversation-has-ended")}
              <br />
              {t("try-starting-a-new-topic")}
              </h2>
            </div>
          </div>
        }
      </div>
      {isOpenModal && 
        <div>
          <Modal handleYesClick={handleYesClick} handleCloseModal={handleCloseModal} message={modalMessage} />
        </div>
      }
    </div>
  );
}
