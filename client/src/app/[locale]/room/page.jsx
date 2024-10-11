"use client"; // 클라이언트 사이드 렌더링을 위한 지시어

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

export default function Room() {
  const [messages, setMessages] = useState(null);
  const locale = useLocale();

  useEffect(() => {
    async function loadMessages() {
      try {
        const loadedMessages = await import(`messages/${locale}.json`);
        setMessages(loadedMessages.default);
      } catch (error) {
        // console.error("Failed to load messages:", error);
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
  const [selectedBackground, setSelectedBackground] = useState(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    // 사용자 데이터 가져오기
    axios
      .get(`${apiUrl}/my-page/user`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((response) => {
        const { color, hat } = response.data.data;
        setSelectedColor({ itemType: 1, itemId: color });
        setSelectedHat({ itemType: 2, itemId: hat });
      })
      .catch();
  }, [apiUrl]);

  // 활성 탭에 따른 컴포넌트 렌더링
  const renderTabContent = () => {
    switch (activeTab) {
      case "color":
        return <Color onSelectCharacter={setSelectedColor} />;
      case "hat":
        return <Hat onSelectHat={setSelectedHat} />;
      case "background":
        return <Background onSelectBackground={setSelectedBackground} />;
      default:
        return <Color onSelectCharacter={setSelectedColor} />;
    }
  };

  return (
    <div className="w-screen h-screen">
      <Image
        src={renderBackground(selectedBackground?.itemId)}
        alt="background"
        layout="fill"
        objectFit="fit"
        style={{ zIndex: -1 }}
      />
      <div className="w-full h-[8%] flex justify-center items-center">
        <div className="w-[20%] flex justify-center">
          <Link href={`/${locale}/main`}>
            <Image src={Back} alt="back" className="w-8 md:w-14" />
          </Link>
        </div>
        <p className="w-[60%] text-2xl md:text-5xl text-center">{t("dressing-room")}</p>
        <div className="w-[20%]" />
      </div>

      {/* 캐릭터 표시 영역 */}
      <div className="w-full h-[32%] flex justify-center items-center">
        {selectedColor && selectedHat && (
          <BirdCharacter color={selectedColor.itemId} hatId={selectedHat.itemId} />
        )}
      </div>

      {/* 커스터마이징 옵션 영역 */}
      <div className="w-full h-[60%] flex flex-col items-center justify-center">
        {/* 탭 메뉴 */}
        <div className="flex w-[90%] h-[8%] mb-5">
          {["color", "hat", "background"].map((tab) => (
            <div
              key={tab}
              className={`w-full flex justify-center items-center text-xl rounded-[100px] m-1 p-1  backdrop-blur-md transition-colors duration-300
                ${
                  activeTab === tab
                    ? "bg-[#151638]/90 border border-[#151638] text-[#FFFFF0]"
                    : "border border-[#151638]/60 text-[#151638]/60"
                }`}
              onClick={() => setActiveTab(tab)}>
              <p className="md:text-5xl">{t(tab)}</p>
            </div>
          ))}
        </div>
        {/* 선택된 탭의 내용 */}
        <div className="w-[90%] h-[80%] flex justify-center items-center bg-[#151638]/50 backdrop-blur-md rounded-[10px]">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
