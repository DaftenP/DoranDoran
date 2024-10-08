"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations, NextIntlClientProvider } from "next-intl";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import Back from "@/public/icon/back.webp";
import Hat from "@/app/[locale]/room/_components/hat";
import Color from "@/app/[locale]/room/_components/color";
import Background from "@/app/[locale]/room/_components/background";
import BirdCharacter from "@/app/[locale]/room/_components/birdcharacter";

export default function Room() {
  const [messages, setMessages] = useState(null);
  const locale = useLocale();

  useEffect(() => {
    async function loadMessages() {
      try {
        const loadedMessages = await import(`messages/${locale}.json`);
        setMessages(loadedMessages.default);
      } catch (error) {
        console.error("Failed to load messages:", error);
      }
    }
    loadMessages();
  }, [locale]);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <TranslatedBottom />
    </NextIntlClientProvider>
  );
}

function TranslatedBottom() {
  const t = useTranslations("index");
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState("color");
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedHat, setSelectedHat] = useState(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    axios.get(`${apiUrl}/my-page/user`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((response) => {
        const { color, hat } = response.data.data;
        setSelectedColor({ itemType: 1, itemId: color });
        setSelectedHat({ itemType: 2, itemId: hat });
      })
      .catch((error) => console.error("Failed to fetch user data:", error))
  }, [apiUrl]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "color":
        return <Color onSelectCharacter={setSelectedColor} />;
      case "hat":
        return <Hat onSelectHat={setSelectedHat} />;
      case "background":
        return <Background />;
      default:
        return <Color onSelectCharacter={setSelectedColor} />;
    }
  };

  return (
    <div className="w-screen h-screen">
      <div className="w-full h-[8%] flex justify-center items-center">
        <div className="w-[20%] flex justify-center">
          <Link href={`/${locale}/main`}>
            <Image src={Back} alt="back" className="w-8 md:w-14" />
          </Link>
        </div>
        <p className="w-[60%] text-2xl md:text-5xl text-center">
          {t("dressing-room")}
        </p>
        <div className="w-[20%]" />
      </div>

      <div className="w-full h-[32%] flex justify-center items-center">
        {selectedColor && selectedHat && (
          <BirdCharacter 
            color={selectedColor.itemId} 
            hatId={selectedHat.itemId}
          />
        )}
      </div>

      <div className="w-full h-[60%] flex flex-col items-center justify-center">
        <div className="flex w-[90%] h-[15%]">
          {["color", "hat", "background"].map((tab) => (
            <div
              key={tab}
              className={`w-full flex justify-center items-center text-xl rounded-t-[15px] rounded-b-md  
                ${
                  activeTab === tab
                    ? "bg-[#A46D46] border border-[#5c3d21]/60"
                    : "bg-[#d3b88c]/60 border border-[#5c3d21]/60"
                }`}
              onClick={() => setActiveTab(tab)}
            >
              <p className="md:text-5xl">{t(tab)}</p>
            </div>
          ))}
        </div>
        <div className="w-[90%] h-[80%] flex justify-center items-center bg-[#A46D46]/50">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}