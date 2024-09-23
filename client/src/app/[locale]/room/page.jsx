"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations, NextIntlClientProvider } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import Shelf from "@/public/icon2/shelf.webp";
import Back from "@/public/icon/back.webp";
import MyCharacter from "./_components/my-character";
import Hat from "./_components/hat";
import Color from "./_components/color";
import Character from "./_components/character";

export default function Room() {
  // 메시지 상태 관리
  const [messages, setMessages] = useState(null);
  // 현재 로케일 가져오기
  const locale = useLocale();

  useEffect(() => {
    // 로케일에 따른 메시지 로딩 함수
    async function loadMessages() {
      try {
        const loadedMessages = await import(`messages/${locale}.json`);
        setMessages(loadedMessages.default);
      } catch (error) {
        console.error(`Failed to load messages for locale: ${locale}`);
      }
    }
    loadMessages();
  }, [locale]);

  return (
    // NextIntlClientProvider로 로케일과 메시지 제공
    <NextIntlClientProvider locale={locale} messages={messages}>
      <TranslatedBottom />
    </NextIntlClientProvider>
  );
}

function TranslatedBottom() {
  // 번역 함수 가져오기
  const t = useTranslations("index");
  const locale = useLocale();
  // 활성 탭 상태 관리
  const [activeTab, setActiveTab] = useState("color");

  // 현재 선택된 탭에 따라 컴포넌트 렌더링
  const renderTabContent = () => {
    switch (activeTab) {
      case "color":
        return <Color />;
      case "hat":
        return <Hat />;
      case "character":
        return <Character />;
      default:
        return <Color />;
    }
  };

  return (
    <div className="w-screen h-screen">
      {/* 상단바 */}
      <div className="flex justify-center items-center w-full h-[7.5%]">
        <div className="w-[20%] flex justify-center">
          <Link href={`/${locale}`}>
            <Image src={Back} alt="back" className="w-8" />
          </Link>
        </div>
        <p className="w-[60%] text-2xl text-center">{t("dressing-room")}</p>
        <div className="w-[20%]" />
      </div>

      {/* 나의 캐릭터 */}
      <MyCharacter />

      {/* 메뉴 탭 */}
      <div className="relative w-screen h-[7.5%] flex justify-center z-10">
        {["color", "hat", "character"].map((tab) => (
          <div
            key={tab}
            className={`flex justify-center items-center w-[30%] text-xl rounded-tl-[15px] rounded-tr-[15px]  ${
              activeTab === tab
                ? "bg-[#a76800] border border-[#5c3d21]"
                : "bg-[#d3b88c]/60 border border-[#5c3d21]/60"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            <p>{t(tab)}</p>
          </div>
        ))}
      </div>
      {/* 옷장 아이템 */}
      {renderTabContent()}

      {/* 옷장 이미지 */}
      <Image
        src={Shelf}
        alt="shelf"
        className="fixed bottom-0 w-full h-[63%]"
      />
    </div>
  );
}
