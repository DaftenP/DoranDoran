'use client';

import { useTranslations } from 'next-intl';
import { NextIntlClientProvider } from 'next-intl';
import { useEffect, useState } from 'react';

export default function Modal({ message }) {
  const [messages, setMessages] = useState(null);
  const locale = 'en'; // 예시로 en 사용, 동적 처리 가능

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
      <TranslatedModal message={message} />
    </NextIntlClientProvider>
  );
}

function TranslatedModal({ message }) {
  const t = useTranslations('index');
  const [isVisible, setIsVisible] = useState(false)

  const handleModalClosed = () => {
    setIsVisible(false)
  }

  return (
    <div className={`fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center ${isVisible ? 'visible' : 'invisible'}`}>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2>{message}</h2>
        <button onClick={handleModalClosed} className="mt-4 p-2 bg-red-500 text-white rounded">닫기</button>
      </div>
    </div>
  );
}
