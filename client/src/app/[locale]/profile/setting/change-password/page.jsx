"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useLocale, useTranslations, NextIntlClientProvider } from "next-intl";

export default function ChangePassword() {
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

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <TranslatedInformation />
    </NextIntlClientProvider>
  );
}

function TranslatedInformation() {
  const t = useTranslations("index");
  const router = useRouter();

  return (
    <div className="w-full h-full text-center flex flex-col justify-center items-center">
      <div className="h-1/3 text-2xl md:text-4xl flex justify-center items-center">
        <p>{t("protect-your-account-by-updating-your-password")}</p>
      </div>
      <div className="w-full h-2/3 flex flex-col justify-center items-center">
        <div className="w-full h-1/3 flex justify-center items-center">
          <input
            type="password"
            className="w-[75%] h-[75%] text-xl md:text-4xl pl-2 rounded-2xl"
            placeholder="Current Password"
          />
        </div>
        <div className="w-full h-1/3 flex justify-center items-center">
          <input
            type="password"
            className="w-[75%] h-[75%] text-xl md:text-4xl pl-2 rounded-2xl"
            placeholder="New Password"
          />
        </div>
        <div className="w-full h-1/3 flex justify-center items-center">
          <input
            type="password"
            className="w-[75%] h-[75%] text-xl md:text-4xl pl-2 rounded-2xl"
            placeholder="New Password Confirm"
          />
        </div>
      </div>
      <div className="w-[85%] h-1/4 flex justify-center items-center gap-5">
        <div
          className="w-full h-1/2 bg-[#FFC0B1]/80 border-2 border-[#FF8669] rounded-2xl flex justify-center items-center text-2xl md:text-4xl"
          onClick={() => router.back()}
        >
          {t("cancel")}
        </div>
        <div className="w-full h-1/2 bg-[#DBB4F3]/80 border-2 border-[#9E00FF] rounded-2xl flex justify-center items-center text-2xl md:text-4xl">
          {t("save")}
        </div>
      </div>
    </div>
  );
}
