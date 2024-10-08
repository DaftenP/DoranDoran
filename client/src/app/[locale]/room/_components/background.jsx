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

// 메인 Background 컴포넌트
export default function Background({ onSelectBackground }) {
  const locale = useLocale();
  const [messages, setMessages] = useState(null);

  // 로케일에 따른 메시지 로드
  useEffect(() => {
    import(`messages/${locale}.json`)
      .then(setMessages)
      .catch(() => {});
  }, [locale]);

  // NextIntlClientProvider로 감싸서 다국어 지원
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <TranslatedBackground onSelectBackground={onSelectBackground} />
    </NextIntlClientProvider>
  );
}

// 번역된 Background 컴포넌트
function TranslatedBackground({ onSelectBackground }) {
  const [items, setItems] = useState([]); // 사용 가능한 배경 아이템 목록
  const [selectedBackground, setSelectedBackground] = useState({ itemType: 3, itemId: null }); // 현재 선택된 배경
  const apiUrl = process.env.NEXT_PUBLIC_API_URL; // API 엔드포인트 URL

  // 컴포넌트 마운트 시 배경 아이템 목록 가져오기
  useEffect(() => {
    axios.get(`${apiUrl}/inventory/item`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((response) => {
        // itemType이 3인 아이템만 필터링 (배경 아이템)
        const filteredItems = response.data.data.filter((item) => item.itemType === 3);
        setItems(filteredItems);
      })
      .catch(error => console.error("배경 아이템 불러오기 실패:", error));
  }, [apiUrl]);

  // 배경 선택 처리 함수
  const handleBackgroundSelect = (itemId) => {
    const newSelectedBackground = { itemType: 3, itemId };
    setSelectedBackground(newSelectedBackground);
    if (typeof onSelectBackground === "function") {
      onSelectBackground(newSelectedBackground); // 부모 컴포넌트에 선택 정보 전달
    }

    // 선택된 배경 아이템 장착 요청
    axios.patch(`${apiUrl}/inventory/equip`, newSelectedBackground, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then(() => {})
      .catch();
  };

  // UI 렌더링
  return (
    <div className="w-full h-full overflow-hidden">
      <div className="w-full h-full overflow-y-auto">
        {/* 3열 그리드 레이아웃, 각 행의 높이는 200px */}
        <div className="grid grid-cols-3 gap-4 p-4" style={{ gridAutoRows: "200px" }}>
          {/* 각 배경 아이템을 그리드 아이템으로 렌더링 */}
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
                {/* 배경 이미지 표시 */}
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