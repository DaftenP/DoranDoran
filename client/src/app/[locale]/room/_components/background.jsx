"use client";

import { useState, useEffect } from "react";
import { useLocale, NextIntlClientProvider } from "next-intl";
import axios from "axios";
import Image from "next/image";
import Day from "@/public/background/day.webp";
import DayBlue from "@/public/background/day-blue.webp";
import Launch from "@/public/background/launch.webp";
import LaunchBlue from "@/public/background/launch-blue.webp";
import NightBlue from "@/public/background/night-blue.webp";

// 모든 배경 이미지를 객체로 저장
const backgroundImages = {1: Day, 2: DayBlue, 3: Launch, 4: LaunchBlue, 5: NightBlue};

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
      .catch((error) => console.log("error:", error));
  }, [apiUrl]);

  // 배경 선택 처리 함수
  const handleBackgroundSelect = (itemId) => {
    const newSelectedBackground = { itemType: 3, itemId };
    setSelectedBackground(newSelectedBackground);
    if (typeof onSelectBackground === "function") {
      onSelectBackground(newSelectedBackground);
    }
    console.log(`선택된 배경: ${itemId}`);
    console.log("newSelectedBackground:", newSelectedBackground);

    // 선택된 배경 정보를 서버에 전송
    axios.patch(`${apiUrl}/inventory/equip`, newSelectedBackground, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((response) => {
        console.log("패치 응답:", response.data);
      })
      .catch((error) => {
        console.error("선택된 배경 패치 중 오류:", error);
      });
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
                <Image src={backgroundImages[item.itemId]} alt="background" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}