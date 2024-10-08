"use client";

import { useLocale, useTranslations, NextIntlClientProvider } from "next-intl";
import { useEffect, useState } from "react";
import { fetchUserData } from "@/store/user";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import Bronze from '@/public/rank/bronze.webp'
import Diamond from '@/public/rank/diamond.webp'
import Gold from '@/public/rank/gold.webp'
import Platinum from '@/public/rank/platinum.webp'
import Silver from '@/public/rank/silver.webp'
import Logout from "@/app/[locale]/profile/_components/logout";

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
  const rankImage = { 0: Bronze, 1000: Bronze, 2000: Silver, 3000: Gold, 4000: Platinum, 5000: Diamond }

  return (
    <div className="bg-white w-[90%] h-[40%] rounded-3xl flex flex-col justify-center items-center">
      <div className="border-2 border-[#B0BEC5] bg-[#FFF5E1] w-[90%] h-[70%] rounded-3xl">
        <div className="w-full h-1/2 flex">
          {/* 랭크 */}
          <div className="w-1/3 border-b-2 border-r-2 border-[#B0BEC5] flex flex-col justify-center items-center">
            <div className="h-1/2 text-xl md:text-4xl flex justify-center items-center">
              {t("rank")}
            </div>
            <div className="w-full h-1/2 flex justify-center items-center">
            <Image src={rankImage[user.status.rank]} alt="rank" className="w-auto h-5/6" />
            </div>
          </div>
          {/* 레벨 */}
          <div className="w-1/3 border-b-2 border-[#B0BEC5]">
            <div className="h-1/2 text-xl md:text-4xl flex justify-center items-center">
              {t("level")}
            </div>
            <div className="h-1/2 flex justify-center items-center">
              <p className="text-xl md:text-4xl">
                Lv. {Math.floor(user.status.xp / 100)}
              </p>
            </div>
          </div>
          {/* 잼 */}
          <div className="w-1/3 border-b-2 border-l-2 border-[#B0BEC5]">
            <div className="h-1/2 text-xl md:text-4xl flex justify-center items-center">
              {t("gem")}
            </div>
            <div className="h-1/2 text-xl md:text-4xl flex justify-center items-center">
              {user.status.gem}
            </div>
          </div>
        </div>
        <div className="w-full h-1/2 flex">
          {/* 닉네임 */}
          <div className="w-1/2 border-r-2 border-[#B0BEC5]">
            <div className="h-1/2 text-xl md:text-4xl flex justify-center items-center">
              {t("nickname")}
            </div>
            <div className="h-1/2 text-xl md:text-4xl flex justify-center items-center">
              {user.profile.nickname}
            </div>
          </div>
          {/* 맞힌 문제 */}
          <div className="w-1/2">
            <div className="h-1/2 text-xl md:text-4xl flex justify-center items-center text-center">
              {t("correct-answer")}
            </div>
            <div className="h-1/2 text-xl md:text-4xl flex justify-center items-center">
              {user.profile.psize}
            </div>
          </div>
        </div>
      </div>
      <div className="w-[90%] pt-3 flex items-center justify-end">
        <Logout />
      </div>
    </div>
  );
}
