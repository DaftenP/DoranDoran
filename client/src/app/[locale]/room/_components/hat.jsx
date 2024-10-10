"use client";

import { useState, useEffect } from "react";
import { useLocale, NextIntlClientProvider } from "next-intl";
import axios from "axios";
import Image from "next/image";

// 모자 이미지 URL 매핑
const hatImages = {
  1: "https://ssafy-tailored.b-cdn.net/shop/hat/1.webp",
  2: "https://ssafy-tailored.b-cdn.net/shop/hat/2.webp",
  3: "https://ssafy-tailored.b-cdn.net/shop/hat/3.webp",
  4: "https://ssafy-tailored.b-cdn.net/shop/hat/4.webp",
  5: "https://ssafy-tailored.b-cdn.net/shop/hat/5.webp",
  6: "https://ssafy-tailored.b-cdn.net/shop/hat/6.webp",
  7: "https://ssafy-tailored.b-cdn.net/shop/hat/7.webp",
  8: "https://ssafy-tailored.b-cdn.net/shop/hat/8.webp",
  9: "https://ssafy-tailored.b-cdn.net/shop/hat/9.webp",
  10: "https://ssafy-tailored.b-cdn.net/shop/hat/10.webp",
  11: "https://ssafy-tailored.b-cdn.net/shop/hat/11.webp",
  12: "https://ssafy-tailored.b-cdn.net/shop/hat/12.webp",
  13: "https://ssafy-tailored.b-cdn.net/shop/hat/13.webp",
  14: "https://ssafy-tailored.b-cdn.net/shop/hat/14.webp",
  15: "https://ssafy-tailored.b-cdn.net/shop/hat/15.webp",
};

export default function Hat({ onSelectHat = () => {} }) {
  const locale = useLocale();
  const [messages, setMessages] = useState(null);

  useEffect(() => {
    import(`messages/${locale}.json`)
      .then(setMessages)
      .catch(() => {});
  }, [locale]);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <TranslatedHat onSelectHat={onSelectHat} />
    </NextIntlClientProvider>
  );
}

// 번역된 Hat 컴포넌트
function TranslatedHat({ onSelectHat }) {
  const [items, setItems] = useState([]); // 사용 가능한 모자 아이템 목록
  const [selectedHat, setSelectedHat] = useState({ itemType: 2, itemId: null }); // 현재 선택된 모자
  const apiUrl = process.env.NEXT_PUBLIC_API_URL; // API 엔드포인트 URL

  // 컴포넌트 마운트 시 모자 아이템 목록 가져오기
  useEffect(() => {
    axios.get(`${apiUrl}/inventory/item`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((response) => {
        // itemType이 2인 아이템만 필터링 (모자 아이템)
        const filteredItems = response.data.data.filter(
          (item) => item.itemType === 2
        );
        setItems(filteredItems);
      })
      .catch((error) => {
        // console.error("아이템 불러오기 실패:", error) 
       });
  }, [apiUrl]);

  // 모자 선택 처리 함수
  const handleHatSelect = (itemId) => {
    const newSelectedHat = { itemType: 2, itemId };
    setSelectedHat(newSelectedHat);
    onSelectHat(newSelectedHat); // 부모 컴포넌트에 선택 정보 전달

    // 선택된 아이템 장착 요청
    axios.patch(`${apiUrl}/inventory/equip`, newSelectedHat, {
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
        {/* 3열 그리드 레이아웃, 각 행의 높이는 100px */}
        <div className="grid grid-cols-2 gap-3 p-3" style={{ gridAutoRows: "100px" }}>
          {/* 각 모자 아이템을 그리드 아이템으로 렌더링 */}
          {items.map((item) => (
            <div
              key={item.itemId}
              className={`rounded-md transition-colors
                transition-transform transform
                ${selectedHat.itemId === item.itemId ? "bg-[#FFFFF0]/50 scale-105" : "bg-[#FFFFF0]/10"}`}
              onClick={() => handleHatSelect(item.itemId)}
            >
              <div className="w-full h-full flex items-center justify-center">
                {/* 모자 이미지 표시 */}
                <Image 
                  src={hatImages[item.itemId]} 
                  alt="hat" 
                  width={200} 
                  height={100} 
                  className="w-auto h-[60%] object-contain" 
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}