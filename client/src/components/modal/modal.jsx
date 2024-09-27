'use client';

import { useLocale, useTranslations, NextIntlClientProvider } from 'next-intl';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Modal({ handleCloseModal, message }) {
  const [messages, setMessages] = useState(null);
  const locale = useLocale(); // 예시로 en 사용, 동적 처리 가능

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
      <TranslatedModal locale={locale} handleCloseModal={handleCloseModal} message={message} />
    </NextIntlClientProvider>
  );
}

function TranslatedModal({ handleCloseModal, message, locale }) {
  const t = useTranslations('index');

  return (

    <div className='fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center'>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2>{t(message.message)}</h2>
        <button onClick={handleCloseModal} className="mt-4 p-2 bg-red-500 text-white rounded">{t('no')}</button>
        <Link href={`/${locale}/ai-tutor`}>
          <button className="mt-4 p-2 bg-red-500 text-white rounded">{t('yes')}</button>
        </Link>
      </div>
    </div>
  );
}
