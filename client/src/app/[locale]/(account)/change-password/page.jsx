"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations, NextIntlClientProvider } from "next-intl";
import axios from "axios";
import Image from "next/image";
import Doryeoni from "@/public/logo/doryeoni.webp";
import Raoni from "@/public/logo/raoni.webp";
import Button from "../_components/button";

export default function ChangeComponent() {
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
      <TranslatedChagne />
    </NextIntlClientProvider>
  );
}

function TranslatedChagne() {
  const locale = useLocale();
  const t = useTranslations("index");
  const [formData, setFormData] = useState({ email: "" });
  const [touched, setTouched] = useState({
    email: false,
    verificationCode: false,
  });
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  // 입력값 변경 핸들러
  const signupChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 입력 필드 포커스 핸들러
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
  };

  // 이메일 인증 요청 POST 함수
  const emailSubmit = (e) => {
    e.preventDefault();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    axios
      .put(`${apiUrl}/mail/reset`, null, {
        params: { email: formData.email },
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.warn("이메일 요청 성공:", response);
      })
      .catch((error) => {
        console.warn("이메일 요청 실패:", error);
      });
  };

  // 입력 스타일 정의
  const inputStyle =
    "w-full h-10 md:h-20 rounded-full bg-white/60 shadow-md text-xl md:text-3xl pl-8 pr-20 transition-colors";

  // 버튼 스타일 정의
  const buttonStyle =
    "absolute top-1/2 right-5 md:text-3xl bg-gradient-to-r from-[#DBB4F3] to-[#FFC0B1] text-transparent bg-clip-text";

  // 입력 클래스 가져오기
  const getInputClass = (name, value) => {
    if (!touched[name]) return inputStyle;
    switch (name) {
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 이메일 정규 표현식
        return `${inputStyle} ${
          emailRegex.test(value)
            ? "border-2 border-green-500"
            : "border-2 border-red-500"
        }`;
      default:
        return inputStyle;
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center">
      <div className="mt-14 mb-7 text-center">
        <p className="text-2xl md:text-5xl mb-2">{t("change-password")}</p>
        <p className="md:text-4xl">{t("set-your-new-password")}</p>
      </div>
      <div className="w-[75%]">
        {/* 이메일 입력 필드 */}
        <div className="relative">
          <div className="flex">
            <p className="text-red-500 md:text-3xl mr-1">*</p>
            <p className="md:text-3xl">{t("e-mail")}</p>
          </div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={signupChange}
            onBlur={handleBlur}
            placeholder={t("e-mail")}
            className={getInputClass("email", formData.email)}
          />
          <button type="button" onClick={emailSubmit} className={buttonStyle}>
            {t("send")}
          </button>
        </div>

        {/* 버튼 */}
        <div className="flex justify-center">
          <Button text={t("cancel")} href={`/${locale}`} />
          <Button text={t("ok")} />
        </div>
      </div>

      <Image
        src={Doryeoni}
        alt="Doryeoni"
        className="w-[18%] absolute top-[55%] right-[15%]"
      />
      <Image
        src={Raoni}
        alt="Raoni"
        className="w-[28%] absolute top-[60%] left-[15%]"
      />
    </div>
  );
}
