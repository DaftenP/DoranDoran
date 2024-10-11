"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setVolume, setEffectVolume } from '@/store/sound';
import { useLocale, useTranslations, NextIntlClientProvider } from "next-intl";

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
  const effectVolume = useSelector((state) => state.sound.effectVolume);

  // 볼륨 변경 시 오디오 객체 업데이트
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.audioMain) { window.audioMain.volume = volume }
      if (window.audioNight) { window.audioNight.volume = volume }
    }
  }, [volume]);

  // 배경음악 볼륨 변경 핸들러
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    dispatch(setVolume(newVolume));
  };

  // 효과음 볼륨 변경 핸들러
  const handleEffectVolumeChange = (e) => {
    const newEffectVolume = parseFloat(e.target.value);
    dispatch(setEffectVolume(newEffectVolume));
  };

  return (
    <>
      <p className="text-2xl md:text-5xl pb-2">{t("sound")}</p>
      <div className="border-2 border-[#B0BEC5] bg-[#FFF5E1] w-[90%] rounded-3xl flex items-center justify-center flex-col p-4 space-y-4">
        <VolumeControl label={t("background-music")} value={volume} onChange={handleVolumeChange} />
        <VolumeControl label={t("sound-effects")} value={effectVolume} onChange={handleEffectVolumeChange} />
      </div>
    </>
  );
}

// 볼륨 컨트롤 컴포넌트
function VolumeControl({ label, value, onChange }) {
  return (
    <div className="w-full flex items-center justify-between">
      <div className="flex flex-col w-full pr-4">
        <p className="md:text-3xl">{label}</p>
        <div className="relative w-full h-[30px]">
          {/* 볼륨 조절 슬라이더 */}
          <input type="range" min="0" max="1" step="0.01" value={value}
            onChange={onChange}
            className="w-full h-full appearance-none bg-[#FFFBF2] rounded-full outline-none"
            style={{
              WebkitAppearance: "none",
              background: `linear-gradient(to right, #FFE4B5 0%, #FFE4B5 ${value * 100}%, #FFFBF2 ${value * 100}%, #FFFBF2 100%)`,
            }}
          />
          {/* 슬라이더 thumb(동그라미) 제거를 위한 스타일 */}
          <style jsx>{`
            input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 0; height: 0; }
            input[type="range"]::-moz-range-thumb { width: 0; height: 0; border: none; }
            input[type="range"]::-ms-thumb { appearance: none; width: 0; height: 0; }
          `}</style>
        </div>
      </div>
      {/* 현재 볼륨 퍼센트 표시 */}
      <p className="md:text-3xl">{(value * 100).toFixed(0)}%</p>
    </div>
  );
}