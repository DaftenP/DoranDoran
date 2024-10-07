"use client";

import { useState, useEffect } from "react";
import { useLocale, NextIntlClientProvider } from "next-intl";
import axios from "axios";
import Image from "next/image";

const birdImages = {
  1: "https://ssafy-tailored.b-cdn.net/shop/bird/1.webp",
  2: "https://ssafy-tailored.b-cdn.net/shop/bird/2.webp",
  3: "https://ssafy-tailored.b-cdn.net/shop/bird/3.webp",
  4: "https://ssafy-tailored.b-cdn.net/shop/bird/4.webp",
  5: "https://ssafy-tailored.b-cdn.net/shop/bird/5.webp",
  6: "https://ssafy-tailored.b-cdn.net/shop/bird/6.webp",
  7: "https://ssafy-tailored.b-cdn.net/shop/bird/7.webp",
  8: "https://ssafy-tailored.b-cdn.net/shop/bird/8.webp",
  9: "https://ssafy-tailored.b-cdn.net/shop/bird/9.webp",
  10: "https://ssafy-tailored.b-cdn.net/shop/bird/10.webp",
  11: "https://ssafy-tailored.b-cdn.net/shop/bird/11.webp",
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
                <Image src={birdImages[item.itemId]} alt="캐릭터" width={200} height={100} className="w-auto h-[90%]" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}