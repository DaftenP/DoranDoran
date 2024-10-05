"use client";

import { useEffect, useState } from "react";
import { useLocale, NextIntlClientProvider } from "next-intl";
import Link from "next/link";
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
      <TranslatedCharacter
        locale={locale}
        selectedCharacter={selectedCharacter}
      />
    </NextIntlClientProvider>
  );
}

function TranslatedCharacter({ selectedCharacter }) {
  const locale = useLocale();

  return (
    <div className="w-[50%] aspect-square flex items-center justify-center md:w-[60%] md:aspect-[4/3]">
      <Link
        href={`/${locale}/room`}
        className="w-full h-full flex items-center justify-center"
      >
        <div className="relative flex items-center justify-center">
          <Image
            src={selectedCharacter || bird1}
            alt="character"
            className="w-[75%] md:w-[300px]"
            style={{objectFit: "contain", maxWidth: "100%", maxHeight: "100%"}}
            priority
          />
        </div>
      </Link>
    </div>
  );
}