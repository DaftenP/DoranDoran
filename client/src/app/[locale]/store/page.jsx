'use client';

import Image from "next/image";
import { useState, useEffect } from 'react';
import { useLocale, useTranslations, NextIntlClientProvider } from 'next-intl';
import Signs from "@/public/icon2/signs.webp";
import Itemlist from "./_components/itemlist";
import ShopCharacter from "@/public/icon2/shop-character.webp";
import ShopColor from "@/public/icon2/shop-color.webp";
import ShopEquipment from "@/public/icon2/shop-equipment.webp";
import ShopBackground from "@/public/icon2/shop-background.webp";
import ShopItem from "@/public/icon2/shop-item.webp";
import ShopGambling from "@/public/icon2/shop-gambling.webp";
import Confetti from "react-confetti";

export default function Store() {
  const [messages, setMessages] = useState(null);
  const locale = useLocale();
  const [buyComplete, setBuyComplete] = useState(false)
  
  useEffect(() => {
    async function loadMessages() {
      try {
        const loadedMessages = await import(`messages/${locale}.json`);
        setMessages(loadedMessages.default); // 메시지 로드
      } catch (error) {
        // console.error(`Failed to load messages for locale: ${locale}`);
      }
    }
    loadMessages();
  }, [locale]);

  if (!messages) {
    return <div>Loading...</div>; // 메시지가 로드될 때까지 로딩 표시
  }
  
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <TranslatedStorelist setBuyComplete={setBuyComplete} />
      {buyComplete && <Confetti />}
    </NextIntlClientProvider>
  );
}

function TranslatedStorelist({ setBuyComplete }) {
  const t = useTranslations('index');

  const items = [
    { itemType: 0, itemName: t('character'), itemIcon: ShopCharacter, itemCost: '500' },
    { itemType: 1, itemName: t('color'), itemIcon: ShopColor, itemCost: '600' },
    { itemType: 2, itemName: t('equipment'), itemIcon: ShopEquipment, itemCost: '400' },
    { itemType: 3, itemName: t('background'), itemIcon: ShopBackground, itemCost: '900' },
    { itemType: 4, itemName: t('item'), itemIcon: ShopItem, itemCost: '500' },
    { itemType: 5, itemName: t('gambling'), itemIcon: ShopGambling, itemCost: '500' },
  ];

  return (
    <div className="w-[100vw] h-[100vh] relative">
      {/* {buyComplete && <Confetti />} */}
      <section className="w-[90vw] h-[75vh] top-[10%] left-[5%] absolute bg-black bg-opacity-[30%] rounded-[20px] border-[3px] border-[#ffffff]">
        <Image
          src={Signs}
          alt="signs"
          className="w-[30%] h-[10%] left-[35%] absolute"
        />
        <div className="w-[30%] h-[10%] top-[1.5%] left-[35%] absolute grid place-items-center">
          <span
            className="text-base sm:text-2xl base:text-3xl lg:text-4xl xl:text-5xl text-[#F4E3C3] font-bold"
            style={{
              textShadow: `
                4px 4px 5px rgba(0, 0, 0, 0.7), /* 강한 어두운 그림자 */
                -1px -1px 2px rgba(255, 255, 255, 0.3), /* 빛 반사 효과 */
                2px 2px 1px rgba(0, 0, 0, 0.4), /* 중간 그림자 */
                1px 1px 0 rgba(0, 0, 0, 0.2) /* 가장 얕은 그림자 */
              `,
            }}
          >
            {t('store')}
          </span>
        </div>

        <article className="relative absolute top-[15%] grid grid-cols-2 gap-y-4 place-items-center text-sm sm:text-lg base:text-xl lg:text-2xl xl:text-3xl">
          {items.map((item, index) => (
            <Itemlist
              key={index}
              itemName={item.itemName} 
              itemIcon={item.itemIcon} 
              itemCost={item.itemCost}
              itemType={item.itemType}
              setBuyComplete={setBuyComplete} 
            />
          ))}
        </article>
      </section>
    </div>
  );
}