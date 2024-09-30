"use client";

import { useLocale, useTranslations, NextIntlClientProvider } from "next-intl";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from 'next/navigation';

export default function Logout() {
  const [messages, setMessages] = useState(null);
  const locale = useLocale();

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

  if (!messages) {
    return <div>Loading...</div>; // 메시지가 로드될 때까지 로딩 표시
  }

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <TranslatedLogout />
    </NextIntlClientProvider>
  );
}

function TranslatedLogout() {
  const t = useTranslations("index");
  const locale = useLocale();
  const router = useRouter();

  // 로그아웃 logout 함수
  const handleLogout = (e) => {
    e.preventDefault();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    axios.get(`${apiUrl}/logout`)
      .then((response) => {
        console.log("로그아웃 성공:", response);
        // localStorage.removeItem('token');
        router.push(`/${locale}/`);
      })
      .catch((error) => {
        console.error("로그아웃 실패:", error);
      });
  };

  return (
    <>
      <button className="bg-blue-500 rounded-xl py-1 px-3" onClick={handleLogout}>
        <p className="text-white text-xl md:text-3xl">{t("logout")}</p>
      </button>
    </>
  );
}