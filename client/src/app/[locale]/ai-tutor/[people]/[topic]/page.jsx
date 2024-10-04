'use client';

import { useLocale, useTranslations, NextIntlClientProvider } from 'next-intl';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChatMessages, typeChange, changeChatMessages, changeMessages, resetState, addResponseMessage, addMyMessage, addSimpleResponseMessage, addSimpleMyMessage } from '@/store/ai-tutor';
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

  // 스크롤을 제일 마지막으로 지속해서 이동
  const scrollToBottom = () => {
    const scrollableContainer = document.getElementById('chat-container');
    if (scrollableContainer) {
      scrollableContainer.scrollTop = scrollableContainer.scrollHeight; // Scroll to the bottom
    }
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

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


  useEffect(() => {
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
        dispatch(addResponseMessage(response.data));
        dispatch(addSimpleResponseMessage(response.data));
        dispatch(addMyMessage({ content: '' }));
      })
      .catch((error) => {
        console.log(error);
      });
  }, [dispatch]);
  
  const handleYesClick = (buttonLink) => {
    setIsOpenModal(false)
    if (buttonLink === 'ai-tutor') {
      dispatch(resetState())
    }
    router.push(`/${locale}/${buttonLink}`)
  }

  const handleOpenModal = (messageIndex) => {
    setModalMessage(modalMessages[messageIndex])
    setIsOpenModal(true)
  }

  const handleCloseModal = () => {
    setIsOpenModal(false)
    if (isEnd) {
      dispatch(resetState())
      setIsEnd(false)
      router.push(`/${locale}/main`)
    }
  }

  const handleIsOver = () => {
    handleOpenModal(3)
    setIsEnd(true)
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
      'buttonLink': 'ai-tutor',
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
  ]

  const chatBubbleVariants = {
    hidden: { opacity: 0, y: 20 },  // 처음에 아래에서 시작
    visible: { opacity: 1, y: 0 },  // 화면에 나타나면 위치와 투명도가 변경
    exit: { opacity: 0, y: -20 }    // 사라질 때 위로 이동
  };

  return (
    <div>
      <div className='flex justify-between mt-[1vh]'>
        <div>
          <Image onClick={() => handleOpenModal(2)} src={Back} alt="back" className="w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 cursor-pointer ml-2" />
        </div>
        <div className="cursor-pointer">
          <Image src={Manual} alt="manual_icon" className="w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 mr-2 pointer-events-none" />
        </div>
      </div>
      <div className='flex-col flex justify-center items-center'>
        <div className='flex justify-center items-center text-xxl md:text-4xl lg:text-6xl'>
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
      </div>
      {isOpenModal && 
        <div>
          <Modal handleYesClick={handleYesClick} handleCloseModal={handleCloseModal} message={modalMessage} />
        </div>
      }
    </div>
  );
}
