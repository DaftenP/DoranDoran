"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations, NextIntlClientProvider } from "next-intl";
import { useRouter, usePathname } from "next/navigation";

export default function Language() {
  const [messages, setMessages] = useState(null);
  const [locale, setLocale] = useState(useLocale());

  useEffect(() => {
    const savedLocale = localStorage.getItem('selectedLocale');
    if (savedLocale) {
      setLocale(savedLocale);
    }

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
      <TranslatedLanguage setLocale={setLocale} />
    </NextIntlClientProvider>
  );
}

function TranslatedLanguage({ setLocale }) {
  const t = useTranslations("index");
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // 지원되는 언어 목록
  const languages = [
    { code: "en", name: "english" },
    { code: "ko", name: "korean" },
    { code: "ja", name: "japanese" },
    { code: "zh", name: "chinese" },
    { code: "ru", name: "russian" },
  ];

  // localStorage에서 저장된 언어 코드를 가져오거나, 없으면 현재 locale 사용
  const savedLocale = typeof window !== 'undefined' ? localStorage.getItem('selectedLocale') : null;
  const initialLocale = savedLocale || useLocale();

  // 현재 locale에 해당하는 언어를 찾아 초기값 설정
  const currentLanguage =
    languages.find((lang) => lang.code === initialLocale)?.name || "english";
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);

  // 언어 선택 드롭다운 토글 함수
  const toggleDropdown = () => setIsOpen(!isOpen);
  
  // 언어 선택 시 실행되는 함수
  const selectLanguage = (lang) => {
    setSelectedLanguage(lang.name);
    setIsOpen(false);
    const newPathname = pathname.replace(/^\/[a-z]{2}/, `/${lang.code}`);
    router.push(newPathname);
    localStorage.setItem('selectedLocale', lang.code);
    setLocale(lang.code);
  };

  return (
    <div className="relative w-full flex justify-center items-center">
      <div
        className="ml-auto w-[30%] flex justify-center items-center rounded-full bg-[#EBF5F4]"
        onClick={toggleDropdown}
      >
        <span className="text-sm md:text-2xl">{t(selectedLanguage)}</span>
        <span>▼</span>
      </div>
      {isOpen && (
        <div className="absolute top-full left-0 right-0 w-[30%] ml-auto mt-1 bg-white rounded-md shadow-md z-10">
          {languages.map((lang) => (
            <div
              key={lang.code}
              className="px-4 py-2 md:text-2xl text-center whitespace-nowrap"
              onClick={() => selectLanguage(lang)}
            >
              {t(lang.name)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}