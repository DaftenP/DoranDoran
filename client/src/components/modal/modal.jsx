'use client';

import { useLocale, useTranslations, NextIntlClientProvider } from 'next-intl';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Image from 'next/image'
import ModalBird from '@/public/modal/modal-bird.webp'
import ModalNight from '@/public/modal/modal-night.webp'

export default function Modal({ handleYesClick, handleCloseModal, message }) {
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
      <TranslatedModal handleYesClick={handleYesClick} handleCloseModal={handleCloseModal} message={message} />
    </NextIntlClientProvider>
  );
}

function TranslatedModal({ handleYesClick, handleCloseModal, message }) {
  const t = useTranslations('index');

  return (
    <div className='fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center'>
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-[70vw] h-[70vw] md:w-[50vw] md:h-[40vw] lg:w-[50vw] lg:h-[40vw] overflow-hidden">
        <div className='relative z-10 text-center text-xl md:text-2xl lg:text-4xl'>
          {t(message.message)}
        </div>
        {message.background === 'bird' &&  (
          <Image src={ModalBird} alt="background_bird" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-70 w-[40vw] h-auto md:w-[30vw] md:h-auto lg:w-[30vw] lg:h-auto z-0" />
        )}
        {message.background === 'night' &&  (
          <Image src={ModalNight} alt="background_night" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full z-0" />
        )}
        {message.buttonType === 1 && (
          <div className='absolute left-1/2 transform -translate-x-1/2 bottom-[5vw] w-full flex justify-around'>
            <button onClick={handleCloseModal} className="mt-4 p-2 bg-red-500 text-white rounded z-10 w-[20vw] md:w-[15vw] text-xl md:text-2xl lg:text-4xl">{t('no')}</button>
            <button onClick={() => handleYesClick(message.buttonLink)} className=" mt-4 p-2 bg-red-500 text-white rounded z-10 w-[20vw] md:w-[15vw] text-xl md:text-2xl lg:text-4xl">{t('yes')}</button>
          </div>
        )}
      </div>
    </div>
  );
}
