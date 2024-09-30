"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useLocale, useTranslations, NextIntlClientProvider } from "next-intl";
import axios from "axios";
import Button from "./button";

export default function SignupComponent() {
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
      <TranslatedSignup />
    </NextIntlClientProvider>
  );
}

function TranslatedSignup() {
  const locale = useLocale();
  const t = useTranslations("index");
  const router = useRouter();

  // 폼 데이터 상태 관리
  const [formData, setFormData] = useState({
    nickname: "",
    email: "",
    password: "",
    confirmPassword: "",
    verificationCode: "",
  });

  // 입력 필드 터치 상태 관리
  const [touched, setTouched] = useState({
    nickname: false,
    email: false,
    password: false,
    confirmPassword: false,
    verificationCode: false,
  });

  // 이메일 인증 상태 관리
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  // 입력값 변경 핸들러
  const signupChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 입력 필드 포커스 아웃 핸들러
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
  };

  // 이메일 인증 요청 함수
  const emailSubmit = (e) => {
    e.preventDefault();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    axios
      .post(`${apiUrl}/mail/regist`, null, {
        params: { email: formData.email },
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.warn("이메일 요청 성공:", response);
        alert('이메일 요청 성공')
        setIsEmailSent(true);
      })
      .catch((error) => {
        console.warn("이메일 요청 실패:", error);
        setIsEmailSent(false);
      });
  };

  // 이메일 인증 코드 확인 함수
  const verifyCode = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    axios
      .get(`${apiUrl}/mail/check`, {
        params: {
          email: formData.email,
          userNumber: formData.verificationCode,
        },
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("인증 코드 확인 성공:", response);
        alert('인증 코드 확인 성공')
        setIsEmailVerified(true);
      })
      .catch((error) => {
        console.warn("인증 코드 확인 실패:", error);
        setIsEmailVerified(false);
      });
  };

  // 폼 유효성 검사 함수
  const validateForm = () => {
    return (
      formData.nickname.trim() !== "" && // 닉네임이 비어있지 않은지 확인
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && // 이메일 형식 확인
      isEmailVerified && // 이메일 인증 여부 확인
      formData.password.length >= 8 && // 비밀번호 길이 확인
      formData.password === formData.confirmPassword // 비밀번호 일치 확인
    );
  };

  // 회원가입 제출 함수
  const signupSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      console.warn("폼 유효성 검사 실패");
      return;
    }
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    axios
      .post(
        `${apiUrl}/regist`,
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
        alert('회원가입 성공')
      })
      .catch((error) => {
        console.warn("회원가입 실패:", error);
      });
  };

  // 입력 필드 기본 스타일
  const inputStyle =
    "w-full h-10 md:h-20 rounded-full bg-white/60 shadow-md text-xl md:text-3xl pl-8 pr-20 transition-colors";

  // 버튼 스타일
  const buttonStyle =
    "absolute top-1/2 right-5 md:text-3xl bg-gradient-to-r from-[#DBB4F3] to-[#FFC0B1] text-transparent bg-clip-text";

  // 입력 필드 유효성에 따른 스타일 적용 함수
  const getInputClass = (name, value) => {
    if (!touched[name]) return inputStyle;
    switch (name) {
      case "nickname":
        return `${inputStyle} ${
          value.trim() ? "border-2 border-green-500" : "border-2 border-red-500"
        }`;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return `${inputStyle} ${
          emailRegex.test(value)
            ? "border-2 border-green-500"
            : "border-2 border-red-500"
        }`;
      case "verificationCode":
        return `${inputStyle} ${
          isEmailVerified
            ? "border-2 border-green-500"
            : "border-2 border-red-500"
        }`;
      case "password":
        const isValidPassword = value && value.length >= 8;
        return `${inputStyle} ${
          isValidPassword
            ? "border-2 border-green-500"
            : "border-2 border-red-500"
        }`;
      case "confirmPassword":
        return `${inputStyle} ${
          value && value === formData.password
            ? "border-2 border-green-500"
            : "border-2 border-red-500"
        }`;
      default:
        return inputStyle;
    }
  };

  return (
    <form
      onSubmit={signupSubmit}
      className="w-[75%] flex flex-col items-center"
    >
      <div className="w-full flex flex-col gap-2 md:gap-5">
        {/* 닉네임 입력 필드 */}
        <div className="relative">
          <div className="flex">
            <p className="text-red-500 md:text-3xl mr-1">*</p>
            <p className="md:text-3xl">{t("nickname")}</p>
          </div>
          <input
            type="text"
            name="nickname"
            value={formData.nickname}
            onChange={signupChange}
            onBlur={handleBlur}
            placeholder={t("nickname")}
            className={getInputClass("nickname", formData.nickname)}
            required
          />
        </div>

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
            required
          />
          <button
            type="button"
            onClick={emailSubmit}
            className={buttonStyle}
            disabled={!formData.email || isEmailSent}
          >
            {t("send")}
          </button>
        </div>

        {/* 이메일 인증 코드 입력 필드 */}
        <div className="relative">
          <div className="flex">
            <p className="text-red-500 md:text-3xl mr-1">*</p>
            <p className="md:text-3xl">{t("verification-code")}</p>
          </div>
          <input
            type="text"
            name="verificationCode"
            value={formData.verificationCode}
            onChange={signupChange}
            onBlur={handleBlur}
            placeholder="123456"
            className={getInputClass(
              "verificationCode",
              formData.verificationCode
            )}
            required
          />
          <button
            type="button"
            onClick={verifyCode}
            className={buttonStyle}
            disabled={!formData.verificationCode || isEmailVerified}
          >
            {isEmailVerified ? t("verified") : t("confirm")}
          </button>
        </div>

        {/* 비밀번호 입력 필드 */}
        <div>
          <div className="flex">
            <p className="text-red-500 md:text-3xl mr-1">*</p>
            <p className="md:text-3xl">{t("password")}</p>
          </div>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={signupChange}
            onBlur={handleBlur}
            placeholder={t("password")}
            className={getInputClass("password", formData.password)}
            required
            minLength={8}
          />
        </div>

        {/* 비밀번호 확인 입력 필드 */}
        <div>
          <div className="flex">
            <p className="text-red-500 md:text-3xl mr-1">*</p>
            <p className="md:text-3xl">{t("confirm-password")}</p>
          </div>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={signupChange}
            onBlur={handleBlur}
            placeholder={t("confirm-password")}
            className={getInputClass(
              "confirmPassword",
              formData.confirmPassword
            )}
            required
          />
        </div>
      </div>

      {/* 버튼 그룹 */}
      <div>
        <Button text={t("cancel")} href={`/${locale}`} />
        <Button text={t("ok")} type="submit" disabled={!validateForm()} />
      </div>
    </form>
  );
}
