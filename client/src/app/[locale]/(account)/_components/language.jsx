"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations, NextIntlClientProvider } from "next-intl";
import { useRouter, usePathname } from "next/navigation";

// 로컬 스토리지에서 언어 설정을 불러오는 함수
const loadLanguageFromStorage = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('selectedLocale');
  }
  return null;
};

// 언어 설정을 로컬 스토리지에 저장하는 함수
const saveLanguageToStorage = (lang) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('selectedLocale', lang);
  }
};

export default function Language() {
  const currentLocale = useLocale();
  const [messages, setMessages] = useState(null);
  const [locale, setLocale] = useState(() => {
    const savedLocale = loadLanguageFromStorage();
    return savedLocale || currentLocale;
  });

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
      <TranslatedLanguage setLocale={setLocale} initialLocale={locale} />
    </NextIntlClientProvider>
  );
}

function TranslatedLanguage({ setLocale, initialLocale }) {
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

  // 현재 locale에 해당하는 언어를 찾아 초기값 설정
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    const langObj = languages.find((lang) => lang.code === initialLocale);
    return langObj ? langObj.name : "english";
  });

  // 언어 선택 드롭다운 토글 함수
  const toggleDropdown = () => setIsOpen(!isOpen);
  
  // 언어 선택 시 실행되는 함수
  const selectLanguage = (lang) => {
    setSelectedLanguage(lang.name);
    setIsOpen(false);
    const newPathname = pathname.replace(/^\/[a-z]{2}/, `/${lang.code}`);
    router.push(newPathname);
    saveLanguageToStorage(lang.code);
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