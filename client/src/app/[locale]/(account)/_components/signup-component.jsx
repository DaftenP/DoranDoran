"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useLocale, useTranslations, NextIntlClientProvider } from "next-intl";
import axios from "axios";
import Button from "./button";
import Modal from "@/components/modal/modal";

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

// 회원가입 폼 컴포넌트
function TranslatedSignup() {
  const locale = useLocale();
  const t = useTranslations("index");
  const router = useRouter();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // 폼 데이터 상태
  const [formData, setFormData] = useState({
    nickname: "",
    email: "",
    password: "",
    confirmPassword: "",
    verificationCode: "",
  });

  // 입력 필드 터치 상태
  const [touched, setTouched] = useState({
    nickname: false,
    email: false,
    password: false,
    confirmPassword: false,
    verificationCode: false,
  });

  // 입력 변경 핸들러
  const signupChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 블러 이벤트 핸들러
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true })
  };

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    setIsOpenModal(false);
    if (shouldRedirect) {router.push(`/${locale}`)}
  };

  // 이메일 전송 핸들러
  const emailSubmit = (e) => {
    e.preventDefault();
    setModalMessage({ message: "sending", background: "night" });
    setIsOpenModal(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    axios.post(`${apiUrl}/mail/regist`, null, {
        params: { email: formData.email },
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("이메일 요청 성공:", response);
        setIsEmailSent(true);
        setModalMessage({message: "email-sending-successful", background: "bird", buttonType: 2});
      })
      .catch((error) => {
        console.error("이메일 요청 실패:", error);
        setIsEmailSent(false);
        setModalMessage({message: "email-sending-failed", background: "bird", buttonType: 2});
      })
      .finally(() => {setIsOpenModal(true)});
  };

  // 인증 코드 확인 핸들러
  const verifyCode = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    axios.get(`${apiUrl}/mail/check`, {
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
        setIsEmailVerified(true);
        setModalMessage({message: "verification-successful", background: "bird", buttonType: 2});
      })
      .catch((error) => {
        console.warn("인증 코드 확인 실패:", error);
        setIsEmailVerified(false);
        setModalMessage({message: "verification-failed", background: "bird", buttonType: 2});
      })
      .finally(() => {setIsOpenModal(true)});
  };

  // 폼 유효성 검사
  const validateForm = () => {
    return (
      formData.nickname.trim() !== "" &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
      isEmailVerified &&
      formData.password.length >= 8 &&
      formData.password === formData.confirmPassword
    );
  };

  // 회원가입 제출 핸들러
  const signupSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setModalMessage({message: "signup-failed", background: "bird", buttonType: 2});
      setIsOpenModal(true);
      return;
    }
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
        })
      .then((response) => {
        console.warn("회원가입 성공:", response);
        setModalMessage({message: "signup-successful", background: "bird", buttonType: 2});
        setShouldRedirect(true);
      })
      .catch((error) => {
        console.warn("회원가입 실패:", error);
        setModalMessage({message: "signup-failed", background: "bird", buttonType: 2});
      })
      .finally(() => {setIsOpenModal(true)});
  };

  // 입력 필드 클래스 생성 함수
  const getInputClass = (name, value) => {
    if (!touched[name]) return inputStyle;
    switch (name) {
      case "nickname":
        return `${inputStyle} ${value.trim() ? "border-2 border-green-500" : "border-2 border-red-500"}`;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return `${inputStyle} ${emailRegex.test(value) ? "border-2 border-green-500" : "border-2 border-red-500"}`;
      case "verificationCode":
        return `${inputStyle} ${isEmailVerified ? "border-2 border-green-500" : "border-2 border-red-500"}`;
      case "password":
        const isValidPassword = value && value.length >= 8;
        return `${inputStyle} ${isValidPassword ? "border-2 border-green-500" : "border-2 border-red-500"}`;
      case "confirmPassword":
        return `${inputStyle} ${value && value === formData.password ? "border-2 border-green-500" : "border-2 border-red-500"}`;
      default: return inputStyle;
    }
  };

  // 스타일 정의
  const inputStyle =
    "w-full h-10 md:h-20 rounded-full bg-white/60 shadow-md text-xl md:text-3xl pl-8 pr-20 transition-colors";

  const buttonStyle =
    "absolute top-1/2 right-5 md:text-3xl bg-gradient-to-r from-[#DBB4F3] to-[#FFC0B1] text-transparent bg-clip-text";

  return (
    <>
      {/* 회원가입 폼 */}
      <form onSubmit={signupSubmit} className="w-[75%] flex flex-col items-center">
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

          {/* 인증 코드 입력 필드 */}
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
              {t("confirm")}
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

        {/* 취소 및 확인 버튼 */}
        <div>
          <Button text={t("cancel")} href={`/${locale}`} />
          <Button text={t("ok")} type="submit" disabled={!validateForm()} />
        </div>
      </form>

      {/* 모달 컴포넌트 */}
      {isOpenModal && (
        <Modal
          handleYesClick={handleCloseModal}
          handleCloseModal={handleCloseModal}
          message={modalMessage.message}
          background={modalMessage.background}
          buttonType={modalMessage.buttonType}
        />
      )}
    </>
  );
}