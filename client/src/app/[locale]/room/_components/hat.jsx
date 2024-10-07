"use client";

import { useState, useEffect } from "react";
import { useLocale, NextIntlClientProvider } from "next-intl";
import axios from "axios";
import Image from "next/image";
import Hat1 from "@/public/shop-hat/hat (1).webp";
import Hat2 from "@/public/shop-hat/hat (2).webp";
import Hat3 from "@/public/shop-hat/hat (3).webp";
import Hat4 from "@/public/shop-hat/hat (4).webp";
import Hat5 from "@/public/shop-hat/hat (5).webp";
import Hat6 from "@/public/shop-hat/hat (6).webp";
import Hat7 from "@/public/shop-hat/hat (7).webp";
import Hat8 from "@/public/shop-hat/hat (8).webp";
import Hat9 from "@/public/shop-hat/hat (9).webp";
import Hat10 from "@/public/shop-hat/hat (10).webp";
import Hat11 from "@/public/shop-hat/hat (11).webp";
import Hat12 from "@/public/shop-hat/hat (12).webp";
import Hat13 from "@/public/shop-hat/hat (13).webp";
import Hat14 from "@/public/shop-hat/hat (14).webp";
import Hat15 from "@/public/shop-hat/hat (15).webp";

// 모든 모자 이미지를 객체로 저장
const hatImages = {
  1: Hat1, 2: Hat2, 3: Hat3, 4: Hat4, 5: Hat5, 6: Hat6, 7: Hat7, 8: Hat8, 
  9: Hat9, 10: Hat10, 11: Hat11, 12: Hat12, 13: Hat13, 14: Hat14, 15: Hat15,
};

// 메인 컴포넌트: 언어 설정 및 번역된 컴포넌트 렌더링
export default function Hat({ onSelectHat }) {
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
      <TranslatedHat onSelectHat={onSelectHat} />
    </NextIntlClientProvider>
  );
}

// 번역된 모자 선택 컴포넌트
function TranslatedHat({ onSelectHat }) {
  const [items, setItems] = useState([]);
  const [selectedHat, setSelectedHat] = useState({ itemType: 2, itemId: null });
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // API에서 아이템 데이터 가져오기
  useEffect(() => {
    axios.get(`${apiUrl}/inventory/item`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((response) => {
        // itemType이 2인 아이템만 필터링 (모자)
        const filteredItems = response.data.data.filter(
          (item) => item.itemType === 2
        );
        setItems(filteredItems);
      })
      .catch();
  }, [apiUrl]);

  // 모자 선택 처리 함수
  const handleHatSelect = (itemId) => {
    const newSelectedHat = { itemType: 2, itemId };
    setSelectedHat(newSelectedHat);
    if (typeof onSelectHat === "function") {
      onSelectHat(newSelectedHat);
    }

    // 선택된 모자 정보를 서버에 전송
    axios.patch(`${apiUrl}/inventory/equip`, newSelectedHat, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((response) => {
        window.location.reload();
      })
      .catch((error) => {});
  };

  // 모자 그리드 렌더링
  return (
    <div className="w-full h-full grid grid-cols-3 grid-rows-5">
      {[...Array(15)].map((_, index) => {
        const slotNumber = index + 1;
        const item = items.find((item) => item.itemId === slotNumber);
        return (
          <div
            key={index}
            className={`rounded-md border border-[#5c3d21]/60 ${
              selectedHat.itemId === item?.itemId ? "border-2 border-white" : ""}`}
            onClick={() => item && handleHatSelect(item.itemId)}
          >
            {item && (
              <div className="w-full h-full flex items-center justify-center">
                <Image src={hatImages[item.itemId]} alt="모자" className="w-auto h-[60%]" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}