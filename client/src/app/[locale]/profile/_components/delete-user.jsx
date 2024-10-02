"use client";

import { useLocale, useTranslations, NextIntlClientProvider } from "next-intl";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function DeleteUser() {
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
    <NextIntlClientProvider locale={locale} messages={messages}>
      <TranslatedDeleteUser />
    </NextIntlClientProvider>
  );
}

function TranslatedDeleteUser() {
  const t = useTranslations("index");
  const router = useRouter();
  const locale = useLocale();

  const handleDeleteUser = (e) => {
    e.preventDefault();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    axios
      .delete(`${apiUrl}/my-page/user`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then(() => {
        localStorage.removeItem("accessToken");
        router.push(`/${locale}/`);
      })
      .catch((error) => {});
  };

  return (
    <>
      <button
        className="bg-red-500 rounded-xl py-1 px-3"
        onClick={handleDeleteUser}
      >
        <p className="text-white text-xl md:text-3xl">{t("delete-user")}</p>
      </button>
    </>
  );
}
