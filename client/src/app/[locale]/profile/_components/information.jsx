"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations, NextIntlClientProvider } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import Email from "@/public/icon/email.webp";
import Pencil from "@/public/icon/pencil.webp";
import Profile from "@/public/icon/profile.webp";
import Birthday from "@/public/icon/birthday.webp";
import Language from "@/app/[locale]/(account)/_components/language";

export default function Information() {
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
  const locale = useLocale();

  return (
    <>
      <div className="w-[90%] py-2">
        <Language />
      </div>
      <div className="border-2 border-[#B0BEC5] bg-[#FFF5E1] w-[90%] h-[50%] rounded-3xl flex flex-col justify-center items-center">
        {/* 닉네임 수정 */}
        <div className="w-[90%] h-1/4 flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src={Profile}
              alt="Profile"
              className="w-[18%] md:w-[30%] pointer-events-none"
            />
            <div className="ml-2 md:ml-5 flex flex-col">
              <p className="text-sm md:text-2xl">{t("nickname")}</p>
              <p className="text-xl md:text-4xl">ssafy123</p>
            </div>
          </div>
          <Image src={Pencil} alt="Pencil" className="w-[10%] md:w-[7.5%]" />
        </div>
        <hr className="w-[90%] border-t border-[#ACACAC]" />
        {/* 이메일 수정 */}
        <div className="w-[90%] h-1/4 flex items-center">
          <Image
            src={Email}
            alt="Email"
            className="w-[8.5%] ml-1 pointer-events-none"
          />
          <div className="ml-2 flex flex-col md:ml-5">
            <p className="text-sm md:text-2xl">{t("e-mail")}</p>
            <p className="text-xl md:text-4xl">ssafy@ssafy.com</p>
          </div>
        </div>
        <hr className="w-[90%] border-t border-[#ACACAC]" />
        {/* 생년월일 수정 */}
        <div className="w-[90%] h-1/4 flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src={Birthday}
              alt="Birthday"
              className="w-[15%] md:w-[25%] pointer-events-none"
            />
            <div className="ml-2 flex flex-col md:ml-4">
              <p className="text-sm md:text-2xl">{t("birth")}</p>
              <p className="text-xl md:text-4xl">1997/09/24</p>
            </div>
          </div>
          <Image src={Pencil} alt="pencil" className="w-[10%] md:w-[7.5%]" />
        </div>
        <hr className="w-[90%] border-t border-[#ACACAC]" />
        {/* 비밀번호 수정 */}
        <div className="w-full h-1/4 flex justify-center items-center">
          <Link
            href={`/${locale}/profile/setting/change-password`}
            className="w-[75%] h-[50%] bg-[#FFE4B5] rounded-full flex justify-center items-center"
          >
            <p className="text-2xl md:text-4xl">{t("change-password")}</p>
          </Link>
        </div>
      </div>
    </>
  );
}
