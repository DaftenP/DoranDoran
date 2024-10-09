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
import Rank from "@/public/icon/rank.png";
import Level from "@/public/icon/level.png";
import Answer from "@/public/icon/answer.png";

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
  const rankText = {
    0: "Bronze",
    1000: "Bronze",
    2000: "Silver",
    3000: "Gold",
    4000: "Platinum",
    5000: "Diamond",
  };
  const rankColor = {
    0: "#cd7f32",
    1000: "#cd7f32",
    2000: "#c0c0c0",
    3000: "#ffd700",
    4000: "#e5e4e2",
    5000: "#b9f2ff",
  };

  return (
    <div className="w-[90%] rounded-3xl flex flex-row justify-between items-center mt-3 mb-3">
      <div
        className="bg-white/60 backdrop-blur-md w-[32%] mr-2 text-l md:text-4xl flex justify-center items-center border border-[#B0BEC5]"
        style={{
          color: rankColor[user.status.rank],
          padding: "5px 10px",
          borderRadius: "20px",
        }}>
        <Image src={rankImage[user.status.rank]} alt="rank" className="w-5 h-5" />
        <div className="ml-2">{rankText[user.status.rank]}</div>
      </div>
      <div
        className="bg-white/60 backdrop-blur-md w-[28%] mr-2 text-l md:text-4xl flex justify-center items-center border border-[#B0BEC5]"
        style={{
          padding: "5px 10px",
          borderRadius: "20px",
        }}>
        <Image src={Level} alt="level" className="w-5 h-5" />
        <div className="ml-2">LV.{Math.floor(user.status.xp / 100)}</div>
      </div>
      <div
        className="bg-white/60 backdrop-blur-md w-[40%] text-l md:text-4xl flex justify-center items-center border border-[#B0BEC5]"
        style={{
          padding: "5px 10px",
          borderRadius: "20px",
        }}>
        <Image src={Answer} alt="answer" className="w-5 h-5" />
        <div className="ml-2">{user.profile.psize} Solved</div>
      </div>
    </div>
  );
}
