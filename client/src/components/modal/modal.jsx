'use client';

import { useState, useEffect } from 'react';
import { useLocale, useTranslations, NextIntlClientProvider } from 'next-intl';
import Image from 'next/image'
import ModalBird from '@/public/modal/modal-bird.webp'
import ModalNight from '@/public/modal/modal-night.webp'
import ShopColor from "@/public/icon2/shop-color.webp";
import ShopEquipment from "@/public/icon2/shop-equipment.webp";
import ShopBackground from "@/public/icon2/shop-background.webp";
import Megaphone from "@/public/icon/megaphone.webp"
import Credit from "@/public/icon/credit.webp";
import Arrow from "@/public/icon/arrow.png"

export default function Modal({ handleYesClick, handleCloseModal, message }) {
  const [messages, setMessages] = useState(null);
  const locale = useLocale();

  useEffect(() => {
    async function loadMessages() {
      try {
        const loadedMessages = await import(`messages/${locale}.json`);
        setMessages(loadedMessages.default);
      } catch (error) {
        // console.error(`Failed to load messages for locale: ${locale}`);
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
      />
    </NextIntlClientProvider>
  );
}

const imageMap = {
  1: "day",
  2: "launch",
  3: "day-blue",
  4: "night-blue",
  5: "launch-blue"
};

function TranslatedModal({ handleYesClick, handleCloseModal, message }) {
  const t = useTranslations('index');
  const tutorData = JSON.parse(localStorage.getItem('tutor'))

  return (
    <div className='fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center'>
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-[80vw] h-[80vw] md:w-[60vw] md:h-[50vw] lg:w-[60vw] lg:h-[50vw] overflow-hidden z-9999">
        {message.title && (
          <div className='relative z-10 text-center text-2xl md:text-4xl lg:text-5xl mb-[8vh] text-purple-500'>
            {t(message.title)}
          </div>
        )}
        <div className='relative z-10 text-center text-xl md:text-2xl lg:text-4xl'>
          {t(message.message)}
        </div>
        <div>
          {message.image && (
            <>
              {message.image === 'color' && (
                <div>
                  <Image
                    src={ShopColor}
                    alt="color_icon"
                    className="relative w-[12vw] h-auto md:w-[8vw] md:h-auto lg:w-[8vw] lg:h-auto left-[50%] absolute transform -translate-x-1/2 translate-y-1/2 z-10"
                  />
                  <div className='absolute left-1/2 transform -translate-x-1/2 z-10 translate-y-6 md:translate-y-10 mt-[2vh]'>
                    <div className="relative w-[24vw] h-auto md:w-[16vw] md:h-auto lg:w-[16vw] lg:h-auto bg-[#d1d6de] rounded-[10px] flex items-center justify-center z-10" style={{ boxShadow: '0 1px 5px rgba(0, 0, 0, 0.5)'}}>
                      <Image src={Credit} alt="credit" className="w-auto h-[4vh] -left-[5%] absolute" />
                      <div className="text-white" >600</div>
                    </div>
                  </div>
                </div>
              )}
              {message.image === 'equipment' && (
                <div>
                  <Image
                    src={ShopEquipment}
                    alt="equipment_icon"
                    className="relative w-[12vw] h-auto md:w-[8vw] md:h-auto lg:w-[8vw] lg:h-auto left-[50%] absolute transform -translate-x-1/2 translate-y-1/2 z-10"
                  />
                  <div className='absolute left-1/2 transform -translate-x-1/2 z-10 translate-y-6 md:translate-y-10 mt-[2vh]'>
                    <div className="relative w-[24vw] h-auto md:w-[16vw] md:h-auto lg:w-[16vw] lg:h-auto bg-[#d1d6de] rounded-[10px] flex items-center justify-center z-10" style={{ boxShadow: '0 1px 5px rgba(0, 0, 0, 0.5)'}}>
                      <Image src={Credit} alt="credit" className="w-auto h-[4vh] -left-[5%] absolute" />
                      <div className="text-white" >400</div>
                    </div>
                  </div>
                </div>
              )}
              {message.image === 'background' && (
                <div>
                  <Image
                    src={ShopBackground}
                    alt="background_icon"
                    className="relative w-[12vw] h-auto md:w-[8vw] md:h-auto lg:w-[8vw] lg:h-auto left-[50%] absolute transform -translate-x-1/2 translate-y-1/2 z-10"
                  />
                  <div className='absolute left-1/2 transform -translate-x-1/2 z-10 translate-y-6 md:translate-y-10 mt-[2vh]'>
                    <div className="relative w-[24vw] h-auto md:w-[16vw] md:h-auto lg:w-[16vw] lg:h-auto bg-[#d1d6de] rounded-[10px] flex items-center justify-center z-10" style={{ boxShadow: '0 1px 5px rgba(0, 0, 0, 0.5)'}}>
                      <Image src={Credit} alt="credit" className="w-auto h-[4vh] -left-[5%] absolute" />
                      <div className="text-white" >900</div>
                    </div>
                  </div>
                </div>
              )}
              {message.image === 'megaphone' && (
                <div>
                  <Image
                    src={Megaphone}
                    alt="megaphone_icon"
                    className="relative w-[12vw] h-auto md:w-[8vw] md:h-auto lg:w-[8vw] lg:h-auto left-[50%] absolute transform -translate-x-1/2 translate-y-1/2 z-10"
                  />
                </div>
              )}
              {message.image === 'megaphone-down' && (
                <div>
                  <Image
                    src={Megaphone}
                    alt="megaphone_icon"
                    className="relative w-[20vw] h-auto md:w-[14vw] md:h-auto lg:w-[14vw] lg:h-auto left-[50%] absolute transform -translate-x-1/2 translate-y-1/3 z-10"
                  />
                  <div className='absolute flex items-center justify-center left-1/2 transform -translate-x-1/2 z-10 translate-y-6 md:translate-y-[5vh] mt-[2vh] text-black text-2xl md:text-4xl lg:text-5xl font-bold'>
                    <span className='text-blue-500'>{tutorData.tutorLimit}</span>
                    <Image 
                      src={Arrow} 
                      alt="arrow_icon" 
                      className="w-[4vw] h-auto md:w-[3vw] lg:w-[3vw] mx-4" 
                    />
                    <span className='text-red-500'>{tutorData.tutorLimit - 1}</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        <div>
          {message.imageUrl && (
            <>
              {message.imageUrl[0] === 1 && (
                <div>
                  <Image
                    src={`https://ssafy-tailored.b-cdn.net/shop/bird/${message.imageUrl[1]}.webp`}
                    alt="color_icon"
                    width={200}
                    height={100}
                    className="relative w-[30vw] h-[30vw] md:w-[20vw] md:h-[20vw] lg:w-[20vw] lg:h-[20vw] left-[50%] absolute transform -translate-x-1/2 md:translate-y-7 z-10"
                  />
                </div>
              )}
              {message.imageUrl[0] === 2 && (
                <div>
                  <Image
                    src={`https://ssafy-tailored.b-cdn.net/shop/hat/${message.imageUrl[1]}.webp`}
                    alt="equipment_icon"
                    width={200}
                    height={100}
                    className="relative w-auto h-[26vw] md:w-auto md:h-[16vw] lg:w-auto lg:h-[16vw] left-[50%] absolute transform -translate-x-1/2 md:translate-y-7 z-10"
                  />
                </div>
              )}
              {message.imageUrl[0] === 3 && (
                <div>
                  <Image
                    src={`https://ssafy-tailored.b-cdn.net/shop/bg/${imageMap[message.imageUrl[1]]}.webp`}
                    alt="background_icon"
                    width={200}
                    height={100}
                    className="relative rounded-3xl opacity-80 w-[30vw] h-[30vw] md:w-[20vw] md:h-[20vw] lg:w-[20vw] lg:h-[20vw] left-[50%] absolute transform -translate-x-1/2 md:translate-y-7 z-10"
                  />
                </div>
              )}
            </>
          )}
        </div>
        {message.background === 'bird' &&  (
          <Image src={ModalBird} alt="background_bird" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-70 w-[40vw] h-auto md:w-[30vw] md:h-auto lg:w-[30vw] lg:h-auto z-0" priority />
        )}
        {message.background === 'night' &&  (
          <Image src={ModalNight} alt="background_night" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full z-0" priority />
        )}
        {message.buttonType === 1 && (
          <div className="absolute left-1/2 transform -translate-x-1/2 bottom-[5vw] w-full flex justify-around">
            <button 
              onClick={handleCloseModal} 
              className="mt-4 p-2 bg-gradient-to-r from-[#FFD1C1] to-[#FFB3A5] text-white rounded-full shadow-md transition-all duration-300 hover:shadow-lg hover:scale-90 w-[30vw] md:w-[22vw] text-xl md:text-2xl lg:text-4xl"
            >
              {t('no')}
            </button>
            <button 
              onClick={() => handleYesClick(message.buttonLink)} 
              className="mt-4 p-2 bg-gradient-to-r from-[#D7B4F3] to-[#BFA6E6] text-white rounded-full shadow-md transition-all duration-300 hover:shadow-lg hover:scale-90 w-[30vw] md:w-[22vw] text-xl md:text-2xl lg:text-4xl"
            >
              {t('yes')}
            </button>
          </div>
        )}
        {message.buttonType === 2 && (
          <div className="absolute left-1/2 transform -translate-x-1/2 bottom-[5vw] w-full flex justify-center">
            <button 
              onClick={handleCloseModal} 
              className="mt-4 p-2 bg-gradient-to-r from-[#FFD1C1] to-[#FFB3A5] text-white rounded-full shadow-md transition-all duration-300 hover:shadow-lg hover:scale-90 w-[30vw] md:w-[22vw] text-xl md:text-2xl lg:text-4xl"
            >
              {t('yes')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}