"use client";

import { useState, useEffect } from "react";
import { useLocale, NextIntlClientProvider } from "next-intl";
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
  const [items, setItems] = useState([]);
  const [selectedHat, setSelectedHat] = useState({ itemType: 2, itemId: null });
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    axios.get(`${apiUrl}/inventory/item`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((response) => {
        const filteredItems = response.data.data.filter(
          (item) => item.itemType === 2
        );
        setItems(filteredItems);
      })
      .catch(error => console.error("Failed to fetch items:", error));
  }, [apiUrl]);

  const handleHatSelect = (itemId) => {
    const newSelectedHat = { itemType: 2, itemId };
    setSelectedHat(newSelectedHat);
    onSelectHat(newSelectedHat);

    axios.patch(`${apiUrl}/inventory/equip`, newSelectedHat, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((response) => {
        window.location.reload();
      })
      .catch((error) => console.error("Failed to equip hat:", error));
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
              selectedHat.itemId === item?.itemId ? "border-2 border-white" : ""}`}
            onClick={() => item && handleHatSelect(item.itemId)}
          >
            {item && (
              <div className="w-full h-full flex items-center justify-center">
                <Image src={hatImages[item.itemId]} alt="모자" width={200} height={100} className="w-auto h-[60%]" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}