'use client';

import { fetchUserData } from "@/store/user";
import { useLocale, NextIntlClientProvider } from 'next-intl';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import Image from 'next/image'

export default function Character() {
  const [messages, setMessages] = useState(null);
  const locale = useLocale()
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
    async function loadMessages() {
      try {
        const loadedMessages = await import(`messages/${locale}.json`);
        setMessages(loadedMessages.default);
      } catch (error) {
        // console.error("Failed to load messages:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadMessages();

    dispatch(fetchUserData());
  }, [locale, dispatch]);

  return (
        <NextIntlClientProvider locale={locale} messages={messages}>
          {isLoading ? (
            <div className="w-[50%] aspect-square flex items-center justify-center md:w-[60%] md:aspect-[4/3]">
              <p>loading...</p>
            </div>
          ) : (
            <TranslatedCharacter />
          )}
        </NextIntlClientProvider>
      );
    }

function TranslatedCharacter() {
  const locale = useLocale()
  const user = useSelector((state) => state.user);
  const equipment = user.profile.equipment
  const color = user.profile.color

  const renderHat = () => {
    switch (equipment) {
      case 1:
        return <Image src={"https://ssafy-tailored.b-cdn.net/shop/hat/1.webp"} alt="hat_icon" width={200} height={100} className="absolute transform -translate-y-[1vh] translate-x-[13vh] w-auto h-[9vh] z-30" />;
      case 2:
        return <Image src={"https://ssafy-tailored.b-cdn.net/shop/hat/2.webp"} alt="hat_icon" width={200} height={100} className="absolute transform -translate-y-[1vh] translate-x-[13vh] w-auto h-[9vh] z-30" />;
      case 3:
        return <Image src={"https://ssafy-tailored.b-cdn.net/shop/hat/3.webp"} alt="hat_icon" width={200} height={100} className="absolute transform -translate-y-[2.8vh] translate-x-[15vh] w-[12vh] h-[8vh] z-30" />;
      case 4:
        return <Image src={"https://ssafy-tailored.b-cdn.net/shop/hat/4.webp"} alt="hat_icon" width={200} height={100} className="absolute transform scale-x-[-1] -translate-y-[1.5vh] translate-x-[12vh] w-auto h-[8vh] z-30" />;
      case 5:
        return <Image src={"https://ssafy-tailored.b-cdn.net/shop/hat/5.webp"} alt="hat_icon" width={200} height={100} className="absolute transform scale-x-[-1] -translate-y-[1.5vh] translate-x-[9vh] w-auto h-[9vh] z-30" />;
      case 6:
        return <Image src={"https://ssafy-tailored.b-cdn.net/shop/hat/6.webp"} alt="hat_icon" width={200} height={100} className="absolute transform scale-x-[-1] -translate-y-[2.8vh] translate-x-[14vh] w-auto h-[9vh] z-30" />;
      case 7:
        return <Image src={"https://ssafy-tailored.b-cdn.net/shop/hat/7.webp"} alt="hat_icon" width={200} height={100} className="absolute transform -translate-y-[2vh] translate-x-[12vh] w-auto h-[9vh] z-30" />;
      case 8:
        return <Image src={"https://ssafy-tailored.b-cdn.net/shop/hat/8.webp"} alt="hat_icon" width={200} height={100} className="absolute transform -translate-y-[2vh] translate-x-[10vh] w-auto h-[9vh] z-30" />;
      case 9:
        return <Image src={"https://ssafy-tailored.b-cdn.net/shop/hat/9.webp"} alt="hat_icon" width={200} height={100} className="absolute transform -translate-y-[1vh] translate-x-[12.5vh] w-auto h-[7vh] z-30" />;
      case 10:
        return <Image src={"https://ssafy-tailored.b-cdn.net/shop/hat/10.webp"} alt="hat_icon" width={200} height={100} className="absolute transform -translate-y-[0.2vh] translate-x-[12.5vh] w-[15vh] h-[8vh] z-30" />;
      case 11:
        return <Image src={"https://ssafy-tailored.b-cdn.net/shop/hat/11.webp"} alt="hat_icon" width={200} height={100} className="absolute transform -translate-y-[2.5vh] translate-x-[13vh] w-auto h-[9vh] z-30" />;
      case 12:
        return <Image src={"https://ssafy-tailored.b-cdn.net/shop/hat/12.webp"} alt="hat_icon" width={200} height={100} className="absolute transform -translate-y-[1vh] translate-x-[12vh] w-auto h-[8vh] z-30" />;
      case 13:
        return <Image src={"https://ssafy-tailored.b-cdn.net/shop/hat/13.webp"} alt="hat_icon" width={200} height={100} className="absolute transform scale-x-[-1] -translate-y-[3vh] translate-x-[11vh] w-auto h-[9vh] z-30" />;
      case 14:
        return <Image src={"https://ssafy-tailored.b-cdn.net/shop/hat/14.webp"} alt="hat_icon" width={200} height={100} className="absolute transform -translate-y-[3vh] translate-x-[15vh] w-[12vh] h-[8vh] z-30" />;
      case 15:
        return <Image src={"https://ssafy-tailored.b-cdn.net/shop/hat/15.webp"} alt="hat_icon" width={200} height={100} className="absolute transform -translate-y-[2vh] translate-x-[13vh] w-auto h-[9vh] z-30" />;
      default:
        return null;
    }
  }

  const renderBird = () => {
    switch (color) {
      case 1:
        return <Image src={`https://ssafy-tailored.b-cdn.net/shop/bird/1.webp`} alt="bird" width={200} height={100} className="relative w-auto h-[29vh] z-20" />;
      case 2:
        return <Image src={"https://ssafy-tailored.b-cdn.net/shop/bird/2.webp"} alt="bird" width={200} height={100} className="relative w-auto h-[29vh] z-20" />;
      case 3:
        return <Image src={"https://ssafy-tailored.b-cdn.net/shop/bird/3.webp"} alt="bird" width={200} height={100} className="relative w-auto h-[29vh] z-20" />;
      case 4:
        return <Image src={"https://ssafy-tailored.b-cdn.net/shop/bird/4.webp"} alt="bird" width={200} height={100} className="relative w-auto h-[29vh] z-20" />;
      case 5:
        return <Image src={"https://ssafy-tailored.b-cdn.net/shop/bird/5.webp"} alt="bird" width={200} height={100} className="relative w-auto h-[29vh] z-20" />;
      case 6:
        return <Image src={"https://ssafy-tailored.b-cdn.net/shop/bird/6.webp"} alt="bird" width={200} height={100} className="relative w-auto h-[29vh] z-20" />;
      case 7:
        return <Image src={"https://ssafy-tailored.b-cdn.net/shop/bird/7.webp"} alt="bird" width={200} height={100} className="relative w-auto h-[29vh] z-20" />;
      case 8:
        return <Image src={"https://ssafy-tailored.b-cdn.net/shop/bird/8.webp"} alt="bird" width={200} height={100} className="relative w-auto h-[29vh] z-20" />;
      case 9:
        return <Image src={"https://ssafy-tailored.b-cdn.net/shop/bird/9.webp"} alt="bird" width={200} height={100} className="relative w-auto h-[29vh] z-20" />;
      case 10:
        return <Image src={"https://ssafy-tailored.b-cdn.net/shop/bird/10.webp"} alt="bird" width={200} height={100} className="relative w-auto h-[29vh] z-20" />;
      case 11:
        return <Image src={"https://ssafy-tailored.b-cdn.net/shop/bird/11.webp"} alt="bird" width={200} height={100} className="relative w-auto h-[29vh] z-20" />;
      default:
        return null;
    }
  }

  return (
    <div className='flex items-center justify-center mt-[3vh]'>
      <div className='relative'>
        {renderHat()}
        <Link href={`/${locale}/room`}>
        {renderBird()}
        </Link>
      </div>
    </div>
  );
}
