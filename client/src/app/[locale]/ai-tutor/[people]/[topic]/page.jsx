'use client';

import { useTranslations, NextIntlClientProvider } from 'next-intl';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Back from '@/public/icon/back.png';
import NewTopic from '@/public/icon/new-topic.png';
import Manual from '@/public/icon/manual.png';
import ChatAi from '@/app/[locale]/ai-tutor/_components/chat-ai';
import ChatMe from '@/app/[locale]/ai-tutor/_components/chat-me';
import ChatHint from '@/app/[locale]/ai-tutor/_components/chat-hint';

export default function Conversation({ params }) {
  const [messages, setMessages] = useState(null);
  const locale = params.locale;

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
  const locale = params.locale;
  const people = params.people;
  const topic = params.topic;

  const [chatMessages, setChatMessages] = useState([
    { sender: 'ai', message: 'Hello, how can I assist you todayHello, how can I assist you today?Hello, how can I assist you today?H' },
    { sender: 'me', message: 'I need help with my accountI need help with my accountI need help with my accountI need help with my account.' },
    { sender: 'ai', message: '맞아?' },
    { sender: 'hint', message: 'Tip: Keep your account information secure.' },
    { sender: 'ai', message: 'Hello, how can I assist you todayHello, how can I assist you today?Hello, how can I assist you today?Hello, how can I assist you today?Hello, how can I assist you today?Hello, how can I assist you today??' },
    { sender: 'me', message: 'I need help with my accountI need help with my accountI need help with my accountI need help with my accountI need help with my accountI need help with my account.' },
  ]);

  const addMessage = ((sender, message) => {
    setChatMessages(prevMessages => [...prevMessages, { sender, message }])
  })

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
            return <ChatAi key={index} message={msg.message} />
          } else if (msg.sender === 'me') {
            return <ChatMe key={index} message={msg.message} />
          } else if (msg.sender === 'hint') {
            return <ChatHint key={index} message={msg.message} />
          }
        })}
      </div>

    </div>
  );
}
