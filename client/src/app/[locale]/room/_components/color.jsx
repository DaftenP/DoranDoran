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

const birdImages = {
  1: bird1, 2: bird2, 3: bird3, 4: bird4, 5: bird5,
  6: bird6, 7: bird7, 8: bird8, 9: bird9, 10: bird10, 11: bird11,
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
  const [selectedCharacter, setSelectedCharacter] = useState({ itemType: 1, itemId: null });
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    axios.get(`${apiUrl}/inventory/item`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((response) => {
        // itemType이 1인 아이템만 필터링 (캐릭터)
        const filteredItems = response.data.data.filter(
          (item) => item.itemType === 1
        );
        setItems(filteredItems);
      })
      .catch();
  }, [apiUrl]);

  const handleCharacterSelect = (itemId) => {
    const newSelectedCharacter = { itemType: 1, itemId };
    setSelectedCharacter(newSelectedCharacter);
    onSelectCharacter(newSelectedCharacter);

    axios.patch(`${apiUrl}/inventory/equip`, newSelectedCharacter, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((response) => {
        window.location.reload();
      })
      .catch((error) => {});
  };

  return (
    <div className="w-full h-full grid grid-cols-3 grid-rows-5">
      {[...Array(15)].map((_, index) => {
        const slotNumber = index + 1;
        const item = items.find((item) => item.itemId === slotNumber);
        return (
          <div
            key={index}
            className={`rounded-md border border-[#5c3d21]/60 ${
              selectedCharacter.itemId === item?.itemId ? "border-2 border-white" : ""}`}
            onClick={() => item && handleCharacterSelect(item.itemId)}
          >
            {item && (
              <div className="w-full h-full flex items-center justify-center">
                <Image src={birdImages[item.itemId]} alt="캐릭터" className="w-auto h-[90%]" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}