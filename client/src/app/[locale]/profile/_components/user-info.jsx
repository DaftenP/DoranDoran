"use client";

import { useLocale, useTranslations, NextIntlClientProvider } from "next-intl";
import { useEffect, useState } from "react";
import { fetchUserData } from "@/store/user";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import Bronze from "@/public/rank/bronze.webp";
import Diamond from "@/public/rank/diamond.webp";
import Gold from "@/public/rank/gold.webp";
import Platinum from "@/public/rank/platinum.webp";
import Silver from "@/public/rank/silver.webp";
import Credit from "@/public/icon/credit.webp";
import Nickname from "@/public/icon/nickname.png";

export default function UserInfo() {
  const [messages, setMessages] = useState(null);
  const locale = useLocale();
  const dispatch = useDispatch();

  useEffect(() => {
    async function loadMessages() {
      try {
        const loadedMessages = await import(`messages/${locale}.json`);
        setMessages(loadedMessages.default);
      } catch (error) {}
    }
    loadMessages();

    dispatch(fetchUserData());
  }, [locale, dispatch]);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <TranslatedUser />
    </NextIntlClientProvider>
  );
}

function TranslatedUser() {
  const t = useTranslations("index");
  const user = useSelector((state) => state.user);
  const rankImage = {
    0: Bronze,
    1000: Bronze,
    2000: Silver,
    3000: Gold,
    4000: Platinum,
    5000: Diamond,
  };

  return (
    <div className="bg-white/60 backdrop-blur-md w-[90%] rounded-3xl flex flex-col justify-center items-center mb-3 border border-[#B0BEC5]">
      <div className="w-[90%] rounded-3xl">
        <div className="flex flex-row justify-between items-center m-3">
          <div className="text-xl md:text-4xl flex justify-center items-center">
            <Image src={Nickname} alt="nickname" className="w-5 h-5" />
            <div className="ml-3">{t("nickname")}</div>
          </div>
          <div className="text-xl md:text-4xl flex justify-center items-center">
            {user.profile.nickname}
          </div>
        </div>
        <div className="flex flex-row justify-between items-center m-3">
          <div className="text-xl md:text-4xl flex justify-center items-center">
            <Image src={Credit} alt="credit" className="w-5 h-5" />
            <div className="ml-3">{t("gem")}</div>
          </div>
          <div className="text-xl md:text-4xl flex justify-center items-center">
            {user.status.gem}
          </div>
        </div>
      </div>
    </div>
  );
}
