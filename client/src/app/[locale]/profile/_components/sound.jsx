"use client";

import { useLocale, useTranslations, NextIntlClientProvider } from "next-intl";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setVolume } from '@/store/sound';

// 메인 Sound 컴포넌트
export default function Sound() {
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
      <TranslatedSound />
    </NextIntlClientProvider>
  );
}

// 번역된 Sound 컴포넌트
function TranslatedSound() {
  const t = useTranslations("index");
  const dispatch = useDispatch();
  const volume = useSelector((state) => state.sound.volume);

  useEffect(() => {
    // 볼륨 변경 시 오디오 객체의 볼륨 업데이트
    if (typeof window !== "undefined") {
      if (window.audioMain) { window.audioMain.volume = volume }
      if (window.audioNight) { window.audioNight.volume = volume }
    }
  }, [volume]);

  // 볼륨 변경 핸들러
  const handleVolumeChange = (e) => { const newVolume = parseFloat(e.target.value); dispatch(setVolume(newVolume)) };

  return (
    <>
      <p className="text-2xl md:text-5xl pb-2">{t("sound")}</p>
      <div className="border-2 border-[#B0BEC5] bg-[#FFF5E1] w-[90%] h-[10%] rounded-3xl flex items-center justify-center flex-col">
        <div className="w-[90%] h-[85%] flex items-center justify-between">
          <div className="h-full flex flex-col w-full">
            <p className="md:text-3xl">{t("background-music")}</p>
            <div className="relative w-full h-[50%]">
              <input type="range" min="0" max="1" step="0.01" value={volume}
                onChange={handleVolumeChange}
                className="w-full h-full appearance-none bg-[#FFFBF2] rounded-full outline-none"
                style={{
                  WebkitAppearance: "none",
                  background: `linear-gradient(to right, #FFE4B5 0%, #FFE4B5 ${volume * 100}%, #FFFBF2 ${volume * 100}%, #FFFBF2 100%)`,
                }}
              />
              {/* 볼륨 컨트롤의 스타일 */}
              <style jsx>{`
                input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 20px; height: 20px; background: #FFE4B5; cursor: pointer; border-radius: 50% }
                input[type="range"]::-moz-range-thumb { width: 20px; height: 20px; background: #FFE4B5; cursor: pointer; border-radius: 50%; border: none }
              `}</style>
            </div>
          </div>
          {/* 현재 볼륨 표시 */}
          <p className="md:text-3xl">{(volume * 100).toFixed(0)}%</p>
        </div>
      </div>
    </>
  );
}