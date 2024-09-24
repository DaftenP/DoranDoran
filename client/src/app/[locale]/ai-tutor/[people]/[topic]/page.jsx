'use client';

import { useLocale, useTranslations, NextIntlClientProvider } from 'next-intl';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  const { chatMessages, loading, error } = useSelector((state) => state.aiTutor)
  const locale = params.locale;
  const role = params.people;
  const situation = params.topic;

  // const handleToggleHint = (index) => {
  //   setChatMessages((prevMessages) => {
  //     const updatedMessages = prevMessages.map((msg, i) =>
  //       i === index ? { ...msg, isHint: !msg.isHint } : msg
  //     );
  //     return updatedMessages;
  //   });
  // };

  // // 각 응답 플레이 토글
  // const handleToggleResponsePlay = (index) => {
  //   setChatMessages((prevMessages) => {
  //     const updatedMessages = prevMessages.map((msg, i) => {
  //       return {
  //         ...msg,
  //         isResponsePlay: i === index ? !msg.isResponsePlay : false,
  //         isHintPlay: false
  //       }
  //     })
  //     return updatedMessages;
  //   })
  // }
  
  // // 각 힌트 플레이 토글
  // const handleToggleHintPlay = (index) => {
  //   setChatMessages((prevMessages) => {
  //     const updateMessages = prevMessages.map((msg, i) => {
  //       return {
  //         ...msg,
  //         isResponsePlay: false,
  //         isHintPlay: i === index ? !msg.isHintPlay : false,
  //       }
  //     })
  //     return updateMessages
  //   })
  // }

  useEffect(() => {
    console.log("Updated chatMessages:", chatMessages);
  }, [chatMessages]);

  return (
    <div>
      <div className='flex justify-between mt-[1vh]'>
        <Image src={Back} alt="back" className="w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 cursor-pointer ml-2" />
        <Image src={Manual} alt='manual_icon' className="w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 cursor-pointer mr-2" />
      </div>
      <div className='flex-col flex justify-center items-center'>
        <div className='flex justify-center items-center text-xxl md:text-4xl lg:text-6xl'>
          {t("ai-tutor")}
          <Image src={NewTopic} alt='new_topic_icon' className='w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 cursor-pointer ml-2'/>
        </div>
      </div>
      <div className='max-h-[87vh] overflow-y-scroll hide-scrollbar'>
        {chatMessages.map((msg, index) => {
          if (msg.sender === 'ai') {
            return (
              <div key={index}>
                <ChatAi index={index} message={msg} />
                {msg.isHint === true && <ChatHint index={index} message={msg} />}
              </div>
            )
          } else if (msg.sender === 'me') {
            return (
              <div key={index}>
                <ChatMe inedx={index} message={msg} />
              </div>
            )
          }
        })}
      </div>
    </div>
  );
}
