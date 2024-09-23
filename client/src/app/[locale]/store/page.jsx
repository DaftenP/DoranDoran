'use client';

import Image from "next/image";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations, NextIntlClientProvider } from 'next-intl';
import Signs from "@/public/icon2/signs.webp";
import Itemlist from "./_components/itemlist";
import Shop_Character from "@/public/icon2/shop-character.webp";
import Shop_Color from "@/public/icon2/shop-color.webp";
import Shop_Equipment from "@/public/icon2/shop-equipment.webp";
import Shop_Background from "@/public/icon2/shop-background.webp";
import Shop_Item from "@/public/icon2/shop-item.webp";
import Shop_Gambling from "@/public/icon2/shop-gambling.webp";


export default function Store() {
    const [messages, setMessages] = useState(null);
    const locale = useLocale();
    // 현재 로케일에 맞는 메시지 파일을 동적으로 로드
  
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
  
    return (
      <NextIntlClientProvider locale={locale} messages={messages}>
        <Storelist />
      </NextIntlClientProvider>
    );
  }


function Storelist() {
  const items = [
    { itemName: 'Character', itemIcon: Shop_Character, itemCost: '8000' },
    { itemName: 'Color', itemIcon: Shop_Color, itemCost: '8000' },
    { itemName: 'Equipment', itemIcon: Shop_Equipment, itemCost: '8000' },
    { itemName: 'Background', itemIcon: Shop_Background, itemCost: '8000' },
    { itemName: 'Item', itemIcon: Shop_Item, itemCost: '8000' },
    { itemName: 'Gambling', itemIcon: Shop_Gambling, itemCost: '8000' },
    ];

    const locale = useLocale();
    // 현재 로케일에 맞는 메시지 파일을 동적으로 로드

    return (
      <div className="w-[100vw] h-[100vh] relative">
        <section className="w-[90vw] h-[75vh] top-[10%] left-[5%] absolute bg-[#D9D9D9] bg-opacity-[30%] rounded-[20px] border-[3px] border-[#ffffff]">
          <Image
            src={Signs}
            alt="signs"
            className="w-[30%] h-[10%] left-[35%] absolute"
          />
          <div className="w-[30%] h-[10%] top-[2%] left-[35%] absolute grid place-items-center">
            <span className="text-base sm:text-2xl base:text-3xl lg:text-4xl xl:text-5xl text-white font-['Itim']">S T O R E</span>
          </div>

          <article className="relative absolute top-[15%] grid grid-cols-2 gap-y-4 place-items-center text-sm sm:text-lg base:text-xl lg:text-2xl xl:text-3xl">
            {items.map((item, index) => (
              <Itemlist
                key={index} 
                itemName={item.itemName} 
                itemIcon={item.itemIcon} 
                itemCost={item.itemCost} 
              />
            ))}
          </article>
        </section>
      </div>
      
    );
}