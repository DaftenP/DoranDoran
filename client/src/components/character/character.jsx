"use client";

import { useEffect, useState } from "react";
import { fetchUserData } from "@/store/user";
import { useDispatch, useSelector } from "react-redux";
import { useLocale, NextIntlClientProvider } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import bird1 from "@/public/shop-bird/bird (1).webp";
import bird2 from "@/public/shop-bird/bird (2).webp";
import bird3 from "@/public/shop-bird/bird (3).webp";
import bird4 from "@/public/shop-bird/bird (4).webp";
import bird5 from "@/public/shop-bird/bird (5).webp";
import bird6 from "@/public/shop-bird/bird (6).webp";
import bird7 from "@/public/shop-bird/bird (7).webp";
import bird8 from "@/public/shop-bird/bird (8).webp";
import bird9 from "@/public/shop-bird/bird (9).webp";
import bird10 from "@/public/shop-bird/bird (10).webp";
import bird11 from "@/public/shop-bird/bird (11).webp";

const birdImages = {
  1: bird1, 2: bird2, 3: bird3, 4: bird4, 5: bird5, 6: bird6,
  7: bird7, 8: bird8, 9: bird9, 10: bird10, 11: bird11,
};

export default function Character() {
  const [messages, setMessages] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const locale = useLocale();
  const dispatch = useDispatch();

  useEffect(() => {
    async function loadMessages() {
      try {
        const loadedMessages = await import(`messages/${locale}.json`);
        setMessages(loadedMessages.default);
      } catch (error) {
        console.error("Failed to load messages:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadMessages();

    dispatch(fetchUserData());
  }, [locale, dispatch]);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {isLoading ? (
        <div className="w-[50%] aspect-square flex items-center justify-center md:w-[60%] md:aspect-[4/3]">
          <p>loading...</p>
        </div>
      ) : (
        <TranslatedCharacter />
      )}
    </NextIntlClientProvider>
  );
}

function TranslatedCharacter() {
  const locale = useLocale();
  const user = useSelector((state) => state.user);
  const colorNumber = user.profile.color;
  const characterImage = (colorNumber && birdImages[colorNumber]) || bird1;

  return (
    <div className="w-[50%] aspect-square flex items-center justify-center md:w-[60%] md:aspect-[4/3]">
      <Link href={`/${locale}/room`} className="w-full h-full flex items-center justify-center">
        <div className="relative flex items-center justify-center">
          <Image
            src={characterImage}
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