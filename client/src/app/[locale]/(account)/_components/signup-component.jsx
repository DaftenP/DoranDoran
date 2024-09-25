"use client";

import { useLocale, useTranslations, NextIntlClientProvider } from "next-intl";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Button from "./button";

// 메인 회원가입 컴포넌트
export default function SignupComponent() {
  const [messages, setMessages] = useState(null);
  const locale = useLocale();

  // 언어별 메시지 로드
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
      <TranslatedSignup />
    </NextIntlClientProvider>
  );
}

// 번역된 회원가입 컴포넌트
function TranslatedSignup() {
  const locale = useLocale();
  const t = useTranslations("index");
  const router = useRouter();
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [formData, setFormData] = useState({
    nickname: "",
    email: "",
    password: "",
    confirmPassword: "",
    verificationCode: "",
  });

  // 입력 변경 핸들러
  const signupChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (value.trim() !== "") {
      setErrors((prev) => ({ ...prev, [name]: false }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: "empty" }));
    }
    if (name === "password" || name === "confirmPassword") {
      validatePasswordMatch();
    }
  };

  // 포커스 잃을 때 핸들러
  const signupBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
    validateField(name);
  };

  // 개별 필드 유효성 검사 함수
  const validateField = (fieldName) => {
    const value = formData[fieldName];
    if (value.trim() === "") {
      setErrors((prev) => ({ ...prev, [fieldName]: "empty" }));
    } else if (fieldName === "confirmPassword") {
      validatePasswordMatch();
    } else {
      setErrors((prev) => ({ ...prev, [fieldName]: false }));
    }
  };

  // 비밀번호 일치 여부 검사
  const validatePasswordMatch = () => {
    if (formData.password !== formData.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: true,
      }));
    } else {
      setErrors((prev) => ({ ...prev, confirmPassword: false }));
    }
  };

  // 회원가입 제출 핸들러
  const signupSubmit = (e) => {
    e.preventDefault();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    axios.post(`${apiUrl}/regist`,
        {
          nickname: formData.nickname,
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
        console.warn("회원가입 성공:", response);
        router.push(`/${locale}`);
      })
      .catch((error) => {
        console.warn("회원가입 실패:", error);
      });
  };

  return (
    <form
      onSubmit={signupSubmit}
      className="w-[75%] flex flex-col items-center"
    >
      <div className="w-full flex flex-col gap-4">
        {/* 닉네임 입력 필드 */}
        <div className="relative">
          <div className="flex">
            <p className="text-red-500 md:text-3xl mr-1">*</p>
            <p className="md:text-3xl mb-1">{t("nickname")}</p>
          </div>
          <input
            type="text"
            name="nickname"
            value={formData.nickname}
            onChange={signupChange}
            onBlur={signupBlur}
            placeholder={t("nickname")}
            className={`w-full h-10 md:h-20 rounded-full bg-white/60 shadow-md text-xl md:text-3xl pl-8 pr-28 ${
              touched.nickname && errors.nickname
                ? "border-2 border-red-500"
                : ""
            }`}
          />
          {touched.nickname && errors.nickname === "empty" && (
            <p className="text-red-500 md:text-3xl text-right">
              {t("please-enter-your-nickname!")}
            </p>
          )}
        </div>
        {/* 이메일 입력 필드 */}
        <div className="relative">
          <div className="flex">
            <p className="text-red-500 md:text-3xl mr-1">*</p>
            <p className="md:text-3xl mb-1">{t("e-mail")}</p>
          </div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={signupChange}
            onBlur={signupBlur}
            placeholder={t("e-mail")}
            className={`w-full h-10 md:h-20 rounded-full bg-white/60 shadow-md text-xl md:text-3xl pl-8 pr-28 ${
              touched.email && errors.email ? "border-2 border-red-500" : ""
            }`}
          />
          <p
            className="absolute top-1/2 right-5 md:text-3xl bg-gradient-to-r from-[#DBB4F3] to-[#FFC0B1]"
            style={{
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {t("send")}
          </p>
        </div>
        {/* 인증 코드 입력 필드 */}
        <div className="relative">
          <div className="flex">
            <p className="text-red-500 md:text-3xl mr-1">*</p>
            <p className="md:text-3xl mb-1">{t("verification-code")}</p>
          </div>
          <input
            type="text"
            name="verificationCode"
            value={formData.verificationCode}
            onChange={signupChange}
            onBlur={signupBlur}
            placeholder="123456"
            className={`w-full h-10 md:h-20 rounded-full bg-white/60 shadow-md text-xl md:text-3xl pl-8 pr-28 ${
              touched.verificationCode && errors.verificationCode
                ? "border-2 border-red-500"
                : ""
            }`}
          />
          <p
            className="md:text-3xl absolute top-1/2 right-5 bg-gradient-to-r from-[#DBB4F3] to-[#FFC0B1]"
            style={{
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {t("confirm")}
          </p>
        </div>
        {/* 비밀번호 입력 필드 */}
        <div>
          <div className="flex">
            <p className="text-red-500 md:text-3xl mr-1">*</p>
            <p className="md:text-3xl mb-1">{t("password")}</p>
          </div>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={signupChange}
            onBlur={signupBlur}
            placeholder={t("password")}
            className={`w-full h-10 md:h-20 md:text-3xl rounded-full bg-white/60 shadow-md text-xl pl-8 ${
              touched.password && errors.password
                ? "border-2 border-red-500"
                : ""
            }`}
          />
          {touched.password && errors.password === "empty" && (
            <p className="text-red-500 md:text-3xl text-right">
              {t("please-enter-your-password!")}
            </p>
          )}
        </div>

        {/* 비밀번호 확인 입력 필드 */}
        <div>
          <div className="flex">
            <p className="text-red-500 md:text-3xl mr-1">*</p>
            <p className="md:text-3xl mb-1">{t("confirm-password")}</p>
          </div>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={signupChange}
            onBlur={signupBlur}
            placeholder={t("confirm-password")}
            className={`w-full h-10 md:h-20 rounded-full md:text-3xl bg-white/60 shadow-md text-xl pl-8 ${
              touched.confirmPassword && errors.confirmPassword
                ? "border-2 border-red-500"
                : ""
            }`}
          />
          {touched.confirmPassword && errors.confirmPassword && (
            <p className="text-red-500 md:text-3xl text-right">
              {t("passwords-do-not-match!")}
            </p>
          )}
        </div>
      </div>
      {/* 버튼 */}
      <div>
        <Button text={t("cancel")} href={`/${locale}`} />
        <Button text={t("ok")} type="submit" />
      </div>
    </form>
  );
}
