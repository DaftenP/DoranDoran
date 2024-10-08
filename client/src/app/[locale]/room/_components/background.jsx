"use client";

import { useState, useEffect } from "react";
import { useLocale, NextIntlClientProvider } from "next-intl";
import axios from "axios";
import Image from "next/image";

// 배경 이미지 URL을 반환하는 함수
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

// 메인 컴포넌트: 언어 설정 및 번역된 컴포넌트 렌더링
export default function Background({ onSelectBackground }) {
  const locale = useLocale();
  const [messages, setMessages] = useState(null);

  // 언어 파일 로드
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

// 번역된 배경 선택 컴포넌트
function TranslatedBackground({ onSelectBackground }) {
  const [items, setItems] = useState([]);
  const [selectedBackground, setSelectedBackground] = useState({ itemType: 3, itemId: null });
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // API에서 아이템 데이터 가져오기
  useEffect(() => {
    axios.get(`${apiUrl}/inventory/item`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((response) => {
        // itemType이 3인 아이템만 필터링 (배경)
        const filteredItems = response.data.data.filter(
          (item) => item.itemType === 3
        );
        setItems(filteredItems);
      })
      .catch();
  }, [apiUrl]);

  // 배경 선택 처리 함수
  const handleBackgroundSelect = (itemId) => {
    const newSelectedBackground = { itemType: 3, itemId };
    setSelectedBackground(newSelectedBackground);
    if (typeof onSelectBackground === "function") {
      onSelectBackground(newSelectedBackground);
    }

    // 선택된 배경 정보를 서버에 전송
    axios.patch(`${apiUrl}/inventory/equip`, newSelectedBackground, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((response) => {})
      .catch((error) => {});
  };

  // 배경 그리드 렌더링
  return (
    <div className="w-full h-full grid grid-cols-3 grid-rows-5">
      {[...Array(15)].map((_, index) => {
        const slotNumber = index + 1;
        const item = items.find((item) => item.itemId === slotNumber);
        return (
          <div
            key={index}
            className={`rounded-md border border-[#5c3d21]/60 ${
              selectedBackground.itemId === item?.itemId ? "border-2 border-white" : ""}`}
            onClick={() => item && handleBackgroundSelect(item.itemId)}
          >
            {item && (
              <div className="w-full h-full flex items-center justify-center">
                <Image 
                  src={renderBackground(item.itemId)} 
                  alt="background" 
                  className="w-full h-full object-cover"
                  width={100}
                  height={100}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}