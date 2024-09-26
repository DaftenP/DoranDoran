"use client";

import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useLocale, useTranslations, NextIntlClientProvider } from "next-intl";
import Email from "@/public/icon/email.webp";
import Password from "@/public/icon/password.webp";
import HidePassword from "@/public/icon/hide-password.webp";
import ShowPassword from "@/public/icon/show-password.webp";

// 메인 LoginForm 컴포넌트
export default function LoginForm() {
  const locale = useLocale();
  const [messages, setMessages] = useState(null);

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
      <LoginFormContent />
    </NextIntlClientProvider>
  );
}

// 실제 로그인 폼
function LoginFormContent() {
  const t = useTranslations("index");
  const locale = useLocale();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // 비밀번호 표시/숨김 토글 함수
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // 입력 필드 변경 핸들러
  const loginChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 폼 제출 핸들러
  const loginSubmit = (e) => {
    e.preventDefault();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    axios.post(`${apiUrl}/login`,
        {
          email: formData.email,
          password: formData.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.warn("로그인 성공:", response);
        router.push(`/${locale}/main`);
      })
      .catch((error) => {
        console.warn("로그인 실패:", error);
      });
  };

  return (
    <form
      onSubmit={loginSubmit}
      className="w-full flex flex-col justify-center items-center gap-5"
    >
      {/* 이메일 입력 필드 */}
      <div className="relative w-[75%] h-10 md:h-20">
        <Image
          src={Email}
          alt="email"
          className="absolute w-[6%] md:w-[5%] top-1/2 transform -translate-y-1/2 left-5 md:left-10 pointer-events-none"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={loginChange}
          placeholder={t("e-mail")}
          className="w-full h-full rounded-full bg-white/60 shadow-md text-xl md:text-4xl pl-14 md:pl-28"
        />
      </div>
      {/* 비밀번호 입력 필드 */}
      <div className="relative w-[75%] h-10 md:h-20">
        <Image
          src={Password}
          alt="password"
          className="absolute w-[6%] md:w-[5%] top-1/2 transform -translate-y-1/2 left-5 md:left-10 pointer-events-none"
        />
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          value={formData.password}
          onChange={loginChange}
          placeholder={t("password")}
          className="w-full h-full rounded-full bg-white/60 shadow-md text-xl md:text-4xl pl-14 md:pl-28"
        />
        {/* 비밀번호 표시/숨김 토글 버튼 */}
        <Image
          src={showPassword ? ShowPassword : HidePassword}
          alt={showPassword ? "ShowPassword" : "HidePassword"}
          className="absolute w-[7.5%] md:w-[6.5%] top-1/2 transform -translate-y-1/2 right-5 md:right-10 cursor-pointer"
          onClick={togglePasswordVisibility}
        />
      </div>
      {/* 로그인 버튼 */}
      <button
        type="submit"
        className="w-[75%] h-10 md:h-20 rounded-full bg-white/60 shadow-md"
      >
        <p
          className="text-2xl md:text-5xl bg-gradient-to-r from-[#DBB4F3] to-[#FFC0B1]"
          style={{
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {t("login")}
        </p>
      </button>
      {/* 비밀번호 찾기 링크 */}
      <div className="w-[75%] flex justify-end mb-5">
        <Link
          href={`/${locale}/change-password`}
          className="text-sm md:text-3xl text-[#1f7efa] "
        >
          {t("forgot-your-password?")}
        </Link>
      </div>
    </form>
  );
}