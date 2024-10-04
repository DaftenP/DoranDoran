"use client";

import { useLocale, useTranslations, NextIntlClientProvider } from "next-intl";
import { useEffect, useState } from "react";
import Image from "next/image";
import bird1 from "@/public/shop-bird/bird (1).webp";

export default function Character({ selectedCharacter }) {
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
      <TranslatedCharacter locale={locale} selectedCharacter={selectedCharacter} />
    </NextIntlClientProvider>
  );
}

function TranslatedCharacter({ selectedCharacter }) {
  const t = useTranslations("index");

  return (
    <div className="h-[42%] flex items-center justify-center">
      <div className="relative flex items-center justify-center">
        {selectedCharacter ? (
          <Image src={selectedCharacter} alt="Selected character" className="w-[75%] md:w-full" />
        ) : (
          <Image src={bird1} alt="bird1" className="w-[75%]" />
        )}
      </div>
    </div>
  );
}