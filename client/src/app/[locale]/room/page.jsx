"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations, NextIntlClientProvider } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import Back from "@/public/icon/back.webp";
import Hat from "@/app/[locale]/room/_components/hat";
import Character from "@/components/character/character";
import Color from "@/app/[locale]/room/_components/color";
import Background from "@/app/[locale]/room/_components/background";
// import Shelf from "@/public/icon2/shelf.webp";

export default function Room() {
  const [messages, setMessages] = useState(null);
  const locale = useLocale();

  useEffect(() => {
    async function loadMessages() {
      try {
        const loadedMessages = await import(`messages/${locale}.json`);
        setMessages(loadedMessages.default);
      } catch (error) {}
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
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  // 현재 선택된 탭에 따라 컴포넌트 렌더링
  const renderTabContent = () => {
    switch (activeTab) {
      case "color":
        return <Color onSelectCharacter={setSelectedCharacter} />;
      case "hat":
        return <Hat />;
      case "background":
        return <Background />;
      default:
        return <Color onSelectCharacter={setSelectedCharacter} />;
    }
  };

  return (
    <div className="w-screen h-screen">
      {/* 상단바 */}
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

      {/* 나의 캐릭터 */}
      <div className="w-full h-[32%] flex justify-center items-center">
        <Character selectedCharacter={selectedCharacter} />
      </div>

      {/* 메뉴 탭 */}
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

        {/* 옷장 이미지 */}
        {/* <Image src={Shelf} alt="shelf" className="w-full" /> */}
      </div>
    </div>
  );
}
