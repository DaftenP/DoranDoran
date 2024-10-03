"use client";

import axios from "axios";
import { useDispatch } from "react-redux";
import { logout } from "@/store/authSlice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useLocale, useTranslations, NextIntlClientProvider } from "next-intl";

export default function Logout() {
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

  if (!messages) {
    return <div>Loading...</div>;
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
  const dispatch = useDispatch();

  // 수정된 로그아웃 함수
  const handleLogout = (e) => {
    e.preventDefault();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    axios.get(`${apiUrl}/logout`)
      .then((response) => {
        localStorage.removeItem("accessToken");
        dispatch(logout());
        router.push(`/${locale}/`);
      })
      .catch((error) => {});
  };

  return (
    <>
      <button className="bg-blue-500 rounded-xl py-1 px-3" onClick={handleLogout}>
        <p className="text-white text-xl md:text-4xl">{t("logout")}</p>
      </button>
    </>
  );
}
