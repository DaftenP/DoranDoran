"use client";

import { useState, useEffect } from "react";
import { useLocale, NextIntlClientProvider } from "next-intl";
import axios from "axios";
import Image from "next/image";
import bird1 from "@/public/shop-bird/bird (1).webp";
import bird2 from "@/public/shop-bird/bird (2).webp";
import bird3 from "@/public/shop-bird/bird (3).webp";
import bird4 from "@/public/shop-bird/bird (4).webp";
import bird5 from "@/public/shop-bird/bird (5).webp";
import bird6 from "@/public/shop-bird/bird (6).webp";
import bird7 from "@/public/shop-bird/bird (7).webp";
import bird8 from "@/public/shop-bird/bird (8).webp";
import bird9 from "@/public/shop-bird/bird (9).webp";
import bird10 from "@/public/shop-bird/bird (10).webp";
import bird11 from "@/public/shop-bird/bird (11).webp";

// 모든 새 이미지를 객체로 저장
const birdImages = {
  1: bird1, 2: bird2, 3: bird3, 4: bird4, 5: bird5, 6: bird6,
  7: bird7, 8: bird8, 9: bird9, 10: bird10, 11: bird11,
};

export default function Color({ onSelectCharacter }) {
  const locale = useLocale();
  const [messages, setMessages] = useState(null);

  useEffect(() => {
    import(`messages/${locale}.json`)
      .then(setMessages)
      .catch(() => {});
  }, [locale]);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <TranslatedColor onSelectCharacter={onSelectCharacter} />
    </NextIntlClientProvider>
  );
}

function TranslatedColor({ onSelectCharacter }) {
  const [items, setItems] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(1);

  // API에서 아이템 데이터 가져오기
  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    axios.get(`${apiUrl}/inventory/item`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((response) => {
        // itemType이 1인 아이템만 필터링
        const filteredItems = response.data.data.filter((item) => item.itemType === 1);
        setItems(filteredItems);
      })
      .catch((error) => console.log("error:", error));
  }, []);

  const handleCharacterSelect = (slotNumber, itemId) => {
    if (itemId) {
      setSelectedCharacter(slotNumber);
      onSelectCharacter(birdImages[itemId]);
      console.log(`Selected bird: ${itemId}`);
    }
  };

  return (
    <div className="w-full h-full grid grid-cols-3 grid-rows-5">
      {[...Array(15)].map((_, index) => {
        const slotNumber = index + 1;
        // 첫 번째 슬롯은 항상 기본 캐릭터, 나머지는 API에서 받아온 데이터로 채움
        const item = slotNumber === 1 ? { itemId: 1 } : items.find((item) => item.itemId === slotNumber);

        return (
          <div
            key={index}
            className="rounded-md border border-[#5c3d21]/60"
            onClick={() => item && handleCharacterSelect(slotNumber, item.itemId)}
          >
            {item && (
              <div className="w-full h-full flex items-center justify-center">
                <Image
                  src={birdImages[item.itemId]}
                  alt="bird"
                  width={100}
                  height={100}
                  style={{ width: 'auto', height: '100%' }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}