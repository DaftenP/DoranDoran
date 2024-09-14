"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations, NextIntlClientProvider } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import Button from "../_components/button";
import SignupComponent from "../_components/signup-component";

export default function SignUp() {
  const [messages, setMessages] = useState(null);
  const locale = useLocale();
  // 현재 로케일에 맞는 메시지 파일을 동적으로 로드
  useEffect(() => {
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
  // NextIntlClientProvider를 사용하여 번역된 컴포넌트 렌더링
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <TranslatedBottom />
    </NextIntlClientProvider>
  );
}
// 실제 번역된 회원가입 양식을 포함하는 컴포넌트
function TranslatedBottom() {
  const t = useTranslations("index");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("english");
  // 지원되는 언어 목록
  const languages = [
    { code: "en", name: "english" },
    { code: "ko", name: "korean" },
    { code: "ja", name: "japanese" },
    { code: "zh", name: "chinese" },
    { code: "ru", name: "russian" },
  ];
  // 언어 선택 드롭다운 토글 함수
  const toggleDropdown = () => setIsOpen(!isOpen);
  // 언어 선택 시 실행되는 함수
  const selectLanguage = (lang) => {
    setSelectedLanguage(lang.name);
    setIsOpen(false);
    const newPathname = pathname.replace(/^\/[a-z]{2}/, `/${lang.code}`);
    router.push(newPathname);
  };
  return (
    <div className="relative w-screen h-screen flex flex-col items-center">
      {/* 페이지 제목 */}
      <div className="mt-14 mb-7 text-center">
        <p className="text-2xl mb-2">{t("create-your-account")}</p>
        <p>{t("please-fill-in-all-the-fields-below")}</p>
      </div>
      {/* 언어 선택 드롭다운 */}
      <div
        className="absolute top-[16%] right-[12.5%] m-2 w-24 h-5 flex items-center justify-center rounded-full bg-white/60 shadow-md"
        onClick={toggleDropdown}
      >
        <p className="text-sm cursor-pointer">{t(selectedLanguage)} ▼</p>
        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-24 bg-white rounded-md shadow-lg z-10 overflow-hidden">
            {languages.map((lang) => (
              <div
                key={lang.code}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer truncate"
                onClick={() => selectLanguage(lang)}
              >
                {t(lang.name)}
              </div>
            ))}
          </div>
        )}
      </div>
      {/* 회원가입 컴포넌트 */}
      <SignupComponent />
      {/* 버튼 컴포넌트 */}
      <div className="mt-4">
        <Button text={t("cancel")} href={`/${locale}`} />
        <Button text={t("ok")} />
      </div>
    </div>
  );
}
