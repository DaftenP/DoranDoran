'use client';

import { useState, useEffect } from 'react';
import { useLocale, useTranslations, NextIntlClientProvider } from 'next-intl';
import Image from 'next/image'
import ModalBird from '@/public/modal/modal-bird.webp'
import ModalNight from '@/public/modal/modal-night.webp'

export default function Modal({ handleYesClick, handleCloseModal, message, background, buttonType }) {
  const [messages, setMessages] = useState(null);
  const locale = useLocale();

  useEffect(() => {
    async function loadMessages() {
      try {
        const loadedMessages = await import(`messages/${locale}.json`);
        setMessages(loadedMessages.default);
      } catch (error) {
        console.error(`Failed to load messages for locale: ${locale}`);
      }
    }
    loadMessages();
  }, [locale]);

  if (!messages) {
    return <div>Loading...</div>;
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <TranslatedModal 
        handleYesClick={handleYesClick} 
        handleCloseModal={handleCloseModal} 
        message={message}
        background={background}
        buttonType={buttonType}
      />
    </NextIntlClientProvider>
  );
}

function TranslatedModal({ handleYesClick, handleCloseModal, message, background, buttonType }) {
  const t = useTranslations('index');
  return (
    <div className='fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center'>
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-[70vw] h-[70vw] md:w-[50vw] md:h-[40vw] lg:w-[50vw] lg:h-[40vw] overflow-hidden">
        <div className='relative z-10 text-center text-xl md:text-2xl lg:text-4xl'>
          {t(message)}
        </div>
        {background === 'bird' &&  (
          <Image src={ModalBird} alt="background_bird" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-70 w-[40vw] h-auto md:w-[30vw] md:h-auto lg:w-[30vw] lg:h-auto z-0" priority />
        )}
        {background === 'night' &&  (
          <Image src={ModalNight} alt="background_night" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full z-0" priority />
        )}
        {buttonType === 1 && (
          <div className='absolute left-1/2 transform -translate-x-1/2 bottom-[5vw] w-full flex justify-around'>
            <button onClick={handleCloseModal} className="mt-4 p-2 bg-red-500 text-white rounded z-10 w-[20vw] md:w-[15vw] text-xl md:text-2xl lg:text-4xl">{t('no')}</button>
            <button onClick={handleYesClick} className=" mt-4 p-2 bg-red-500 text-white rounded z-10 w-[20vw] md:w-[15vw] text-xl md:text-2xl lg:text-4xl">{t('yes')}</button>
          </div>
        )}
        {buttonType === 2 && (
          <div className='absolute left-1/2 transform -translate-x-1/2 bottom-[5vw] w-full flex justify-around'>
            <button onClick={handleCloseModal} className="mt-4 p-2 bg-red-500 text-white rounded z-10 w-[20vw] md:w-[15vw] text-xl md:text-2xl lg:text-4xl">{t('check')}</button>
          </div>
        )}
      </div>
    </div>
  );
}