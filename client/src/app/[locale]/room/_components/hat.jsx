"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations, NextIntlClientProvider } from "next-intl";
import axios from "axios";
import Image from "next/image";

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

function TranslatedHat({ onSelectHat }) {
  const t = useTranslations("index");
  const [items, setItems] = useState([]);
  const [selectedHat, setSelectedHat] = useState({ itemType: 2, itemId: null }); // 기본값을 null로 변경
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    axios.get(`${apiUrl}/inventory/item`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((response) => {
        const filteredItems = response.data.data.filter((item) => item.itemType === 2);
        // 빈 값 아이템(미착용) 추가
        filteredItems.unshift({ itemId: null, itemType: 2 });
        setItems(filteredItems);
      })
      .catch((error) => {
        // console.error("아이템 불러오기 실패:", error) 
       });
  }, [apiUrl]);

  useEffect(() => {
    // 컴포넌트 마운트 시 기본 모자 선택 정보 전달 (미착용 상태)
    onSelectHat(selectedHat);
  }, []);

  const handleHatSelect = (itemId) => {
    const newSelectedHat = { itemType: 2, itemId };
    setSelectedHat(newSelectedHat);
    onSelectHat(newSelectedHat);

    // 모든 아이템 선택 시 patch 요청 보내기 (null 아이템 포함)
    axios.patch(`${apiUrl}/inventory/equip`, newSelectedHat, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then(() => {})
      .catch(error => console.error("모자 장착 실패:", error));
  };

  return (
    <div className="w-full h-full overflow-hidden">
      <div className="w-full h-full overflow-y-auto">
        <div className="grid grid-cols-2 gap-3 p-3" style={{ gridAutoRows: "100px" }}>
          {items.map((item) => (
            <div
              key={item.itemId ?? 'no-hat'}
              className={`rounded-md transition-colors
                transition-transform transform
                ${selectedHat.itemId === item.itemId ? "bg-[#FFFFF0]/50 scale-105" : "bg-[#FFFFF0]/10"}
                ${item.itemId === null ? "border border-dashed border-gray-300" : ""}`}
              onClick={() => handleHatSelect(item.itemId)}
            >
              <div className="w-full h-full flex items-center justify-center">
                {item.itemId !== null && (
                  <Image 
                    src={hatImages[item.itemId]} 
                    alt="모자"
                    width={200} 
                    height={100} 
                    className="w-auto h-[60%] object-contain" 
                  />
                )}
                {item.itemId === null && (
                  <span className="text-3xl md:text-5xl text-gray-400">{t("no")}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}