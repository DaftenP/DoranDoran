"use client";

import { useState, useEffect } from "react";
import { useLocale, NextIntlClientProvider } from "next-intl";
import axios from "axios";
import Image from "next/image";

const renderBackground = (backgroundId) => {
  switch (backgroundId) {
    case 1:
      return "https://ssafy-tailored.b-cdn.net/shop/bg/day.webp";
    case 2:
      return "https://ssafy-tailored.b-cdn.net/shop/bg/launch.webp";
    case 3:
      return "https://ssafy-tailored.b-cdn.net/shop/bg/day-blue.webp";
    case 4:
      return "https://ssafy-tailored.b-cdn.net/shop/bg/night-blue.webp";
    case 5:
      return "https://ssafy-tailored.b-cdn.net/shop/bg/launch-blue.webp";
    default:
      return "https://ssafy-tailored.b-cdn.net/shop/bg/day.webp";
  }
};

export default function Background({ onSelectBackground }) {
  const locale = useLocale();
  const [messages, setMessages] = useState(null);

  useEffect(() => {
    import(`messages/${locale}.json`)
      .then(setMessages)
      .catch(() => {});
  }, [locale]);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <TranslatedBackground onSelectBackground={onSelectBackground} />
    </NextIntlClientProvider>
  );
}

function TranslatedBackground({ onSelectBackground }) {
  const [items, setItems] = useState([]);
  const [selectedBackground, setSelectedBackground] = useState({ itemType: 3, itemId: 1 }); // 기본값을 1로 설정
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    axios.get(`${apiUrl}/inventory/item`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((response) => {
        const filteredItems = response.data.data.filter((item) => item.itemType === 3);
        
        // 1번 아이템이 없으면 추가
        if (!filteredItems.some(item => item.itemId === 1)) {
          filteredItems.unshift({ itemId: 1, itemType: 3 });
        }
        
        setItems(filteredItems);
      })
      .catch((error) => {
       // console.error("배경 아이템 불러오기 실패:", error) 
      });
  }, [apiUrl]);

  useEffect(() => {
    // 컴포넌트 마운트 시 기본 배경 선택 정보 전달
    if (typeof onSelectBackground === "function") {
      onSelectBackground(selectedBackground);
    }
  }, []);

  const handleBackgroundSelect = (itemId) => {
    const newSelectedBackground = { itemType: 3, itemId };
    setSelectedBackground(newSelectedBackground);
    if (typeof onSelectBackground === "function") {
      onSelectBackground(newSelectedBackground);
    }

    axios.patch(`${apiUrl}/inventory/equip`, newSelectedBackground, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then(() => {})
      .catch();
  };

  return (
    <div className="w-full h-full overflow-hidden">
      <div className="w-full h-full overflow-y-auto">
        <div className="grid grid-cols-3 gap-4 p-4" style={{ gridAutoRows: "200px" }}>
          {items.map((item) => (
            <div
              key={item.itemId}
              className={`rounded-md border border-[#5c3d21]/60 overflow-hidden 
                transition-transform transform
                ${
                selectedBackground.itemId === item.itemId ? "border-2 border-white scale-105" : ""
              }`}
              onClick={() => handleBackgroundSelect(item.itemId)}
            >
              <div className="w-full h-full relative">
                <Image 
                  src={renderBackground(item.itemId)} 
                  alt="background" 
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}