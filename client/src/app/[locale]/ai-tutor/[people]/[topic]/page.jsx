'use client';

import { useLocale, useTranslations, NextIntlClientProvider } from 'next-intl';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChatMessages, addResponseMessage, addMyMessage, addSimpleResponseMessage, addSimpleMyMessage } from '@/store/ai-tutor';
import Modal from '@/components/modal/modal'
import Link from 'next/link';
import Image from 'next/image';
import Back from '@/public/icon/back.webp';
import NewTopic from '@/public/icon/new-topic.webp';
import Manual from '@/public/icon/manual.webp';
import ChatAi from '@/app/[locale]/ai-tutor/_components/chat-ai';
import ChatMe from '@/app/[locale]/ai-tutor/_components/chat-me';
import ChatHint from '@/app/[locale]/ai-tutor/_components/chat-hint';

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
  const locale = params.locale;
  const role = params.people;
  const situation = params.topic;

  useEffect(() => {
    const formData = new FormData()
    // formData.append('messages', JSON.stringify([]));
    // formData.append('msg', JSON.stringify({}));
    formData.append('msg', '');
    dispatch(fetchChatMessages({ role, situation, locale, formData }))
      .unwrap()
      .then((response) => {
        console.log('진입 시 dispatch')
        dispatch(addResponseMessage(response.data))
        dispatch(addSimpleResponseMessage(response.data))
        dispatch(addMyMessage({'content': ''}))
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])
  
  const handleYesClick = (buttonLink) => {
    setIsOpenModal(false)
    router.push(`/${locale}/${buttonLink}`)
  }

  const handleOpenModal = (messageIndex) => {
    console.log(messageIndex)
    setModalMessage(modalMessages[messageIndex])
    setIsOpenModal(true)
  }

  const handleCloseModal = () => {
    setIsOpenModal(false)
  }

  const modalMessages = [
    // 대화종료 메세지
    {
      'message': 'the-conversation-has-ended-Would-you-like-to-start-a-new-topic',
      'background': 'bird',
      'buttonLink': 'ai-tutor',
    },
    // 새로운 주제 선택
    {
      'message': 'would-you-like-to select-a-new-topic-if-you-do-the-chat-history-will-be-deleted',
      'background': 'bird',
      'buttonLink': 'ai-tutor',
    },
    // 뒤로가기
    {
      'message': 'would-you-like-to-return-to-the-home-screen?',
      'background': 'bird',
      'buttonLink': 'main',
    },
  ]

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
      <div className='max-h-[87vh] overflow-y-scroll hide-scrollbar'>
        {chatMessages.map((msg, index) => {
          if (msg.role === 'assistant') {
            return (
              <div key={index}>
                <ChatAi index={index} message={msg} />
                {msg.isHint === true && <ChatHint index={index} message={msg} />}
              </div>
            )
          } else if (msg.role === 'user') {
            return (
              <div key={index}>
                <ChatMe inedx={index} message={msg} params={params} />
              </div>
            )
          }
        })}
      </div>
      {isOpenModal && 
        <div>
          <Modal handleYesClick={handleYesClick} handleCloseModal={handleCloseModal} message={modalMessage} />
        </div>
      }
    </div>
  );
}
