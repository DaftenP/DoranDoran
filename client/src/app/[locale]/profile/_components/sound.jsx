"use client";

import { useLocale, useTranslations, NextIntlClientProvider } from "next-intl";
import { useEffect, useState } from "react";

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

function TranslatedSound() {
  const t = useTranslations("index");
  const [volume, setVolume] = useState(50);

  useEffect(() => {
    if (typeof window !== "undefined" && window.audio) {
      window.audio.volume = volume / 100;
    }
  }, [volume]);

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
  };

  return (
    <>
      <p className="text-2xl md:text-5xl pb-2">{t("sound")}</p>
      <div className="border-2 border-[#B0BEC5] bg-[#FFF5E1] w-[90%] h-[10%] rounded-3xl flex items-center justify-center flex-col">
        <div className="w-[90%] h-[85%] flex items-center justify-between">
          <div className="h-full flex flex-col w-full">
            <p className="md:text-3xl">{t("background-music")}</p>
            <div className="relative w-full h-[50%]">
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
                className="w-full h-full appearance-none bg-[#FFFBF2] rounded-full outline-none"
                style={{
                  WebkitAppearance: "none",
                  background: `linear-gradient(to right, #FFE4B5 0%, #FFE4B5 ${volume}%, #FFFBF2 ${volume}%, #FFFBF2 100%)`,
                }}
              />
              <style jsx>{`
                input[type="range"]::-webkit-slider-thumb {
                  -webkit-appearance: none;
                  appearance: none;
                  width: 20px;
                  height: 20px;
                  background: #FFE4B5;
                  cursor: pointer;
                  border-radius: 50%;
                }
                input[type="range"]::-moz-range-thumb {
                  width: 20px;
                  height: 20px;
                  background: #FFE4B5;
                  cursor: pointer;
                  border-radius: 50%;
                  border: none;
                }
              `}</style>
            </div>
          </div>
          <p className="md:text-3xl">{volume}%</p>
        </div>
      </div>
    </>
  );
}