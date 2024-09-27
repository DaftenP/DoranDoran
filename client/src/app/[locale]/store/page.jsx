'use client';

import Image from "next/image";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations, NextIntlClientProvider } from 'next-intl';
import Signs from "@/public/icon2/signs.webp";
import Itemlist from "./_components/itemlist";
import ShopCharacter from "@/public/icon2/shop-character.webp";
import ShopColor from "@/public/icon2/shop-color.webp";
import ShopEquipment from "@/public/icon2/shop-equipment.webp";
import ShopBackground from "@/public/icon2/shop-background.webp";
import ShopItem from "@/public/icon2/shop-item.webp";
import ShopGambling from "@/public/icon2/shop-gambling.webp";


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

    if (!messages) {
      return <div>Loading...</div>; // 메시지가 로드될 때까지 로딩 표시
    }
  
    return (
      <NextIntlClientProvider locale={locale} messages={messages}>
        <Storelist />
      </NextIntlClientProvider>
    );
  }


function Storelist() {
  const t = useTranslations('index');

  const items = [
    { itemName: t('character'), itemIcon: ShopCharacter, itemCost: '8000' },
    { itemName: t('color'), itemIcon: ShopColor, itemCost: '8000' },
    { itemName: t('equipment'), itemIcon: ShopEquipment, itemCost: '8000' },
    { itemName: t('background'), itemIcon: ShopBackground, itemCost: '8000' },
    { itemName: t('item'), itemIcon: ShopItem, itemCost: '8000' },
    { itemName: t('gambling'), itemIcon: ShopGambling, itemCost: '8000' },
    ];

    return (
      <div className="w-[100vw] h-[100vh] relative">
        <section className="w-[90vw] h-[75vh] top-[10%] left-[5%] absolute bg-[#D9D9D9] bg-opacity-[30%] rounded-[20px] border-[3px] border-[#ffffff]">
          <Image
            src={Signs}
            alt="signs"
            className="w-[30%] h-[10%] left-[35%] absolute"
          />
          <div className="w-[30%] h-[10%] top-[2%] left-[35%] absolute grid place-items-center">
            <span className="text-base sm:text-2xl base:text-3xl lg:text-4xl xl:text-5xl text-white font-['Itim']">{t('store')}</span>
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