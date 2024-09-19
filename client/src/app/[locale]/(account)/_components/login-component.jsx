"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations, NextIntlClientProvider } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import Email from "@/public/icon/email.png";
import Password from "@/public/icon/password.png";
import HidePassword from "@/public/icon/hide-password.png";
import ShowPassword from "@/public/icon/show-password.png";

// 로그인 폼의 메인 컴포넌트
export default function LoginForm() {
  const locale = useLocale();
  const [messages, setMessages] = useState(null);

  // 현재 로케일에 맞는 메시지 파일을 동적으로 로드
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

  // NextIntlClientProvider를 사용하여 번역된 컴포넌트 렌더링
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <LoginFormContent />
    </NextIntlClientProvider>
  );
}

// 실제 로그인 폼 내용을 포함하는 컴포넌트
function LoginFormContent() {
  const t = useTranslations("index");
  const locale = useLocale();
  const [showPassword, setShowPassword] = useState(false);

  // 비밀번호 표시/숨김 토글 함수
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full flex flex-col gap-5">
      {/* 이메일 입력 필드 */}
      <div className="relative">
        <Image
          src={Email}
          alt="email"
          className="absolute w-[6%] top-1/2 transform -translate-y-1/2 left-5 pointer-events-none"
        />
        <input
          type="email"
          placeholder={t("e-mail")}
          className="w-full h-12 rounded-full bg-white/60 shadow-md text-xl pl-14"
        />
      </div>
      {/* 비밀번호 입력 필드 */}
      <div className="relative">
        <Image
          src={Password}
          alt="password"
          className="absolute w-[6%] top-1/2 transform -translate-y-1/2 left-5 pointer-events-none"
        />
        <input
          type={showPassword ? "text" : "password"}
          placeholder={t("password")}
          className="w-full h-12 rounded-full bg-white/60 shadow-md text-xl pl-14"
        />
        {/* 비밀번호 표시/숨김 토글 버튼 */}
        <Image
          src={showPassword ? ShowPassword : HidePassword}
          alt={showPassword ? "ShowPassword" : "HidePassword"}
          className="absolute w-[7.5%] top-1/2 transform -translate-y-1/2 right-5 cursor-pointer"
          onClick={togglePasswordVisibility}
        />
      </div>
      {/* 로그인 버튼 */}
      <button className="w-full h-10 rounded-full bg-white/60 shadow-md cursor-pointer">
        <p
          className="text-2xl bg-gradient-to-r from-[#DBB4F3] to-[#FFC0B1]"
          style={{
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {t("login")}
        </p>
      </button>
      <Link
        href={`/${locale}/change-password`}
        className="text-sm text-right text-[#1f7efa] cursor-pointer"
      >
        {t("forgot-your-password?")}
      </Link>
    </div>
  );
}
