"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useLocale, useTranslations, NextIntlClientProvider } from "next-intl";
import axios from "axios";
import Image from "next/image";
import Modal from "@/components/modal/modal";
import Raoni from "@/public/logo/raoni.webp";
import Doryeoni from "@/public/logo/doryeoni.webp";
import Button from "@/app/[locale]/(account)/_components/button";

export default function ChangeComponent() {
  const [messages, setMessages] = useState(null);
  const locale = useLocale();

  useEffect(() => {
    async function loadMessages() {
      try {
        const loadedMessages = await import(`messages/${locale}.json`);
        setMessages(loadedMessages.default);
      } catch (error) {}
    }
    loadMessages();
  }, [locale]);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <TranslatedChange />
    </NextIntlClientProvider>
  );
}

// 로딩 오버레이 컴포넌트
function LoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
    </div>
  );
}

// 비밀번호 변경 폼 컴포넌트
function TranslatedChange() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("index");
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [formData, setFormData] = useState({email: "", verificationCode: "" });
  const [touched, setTouched] = useState({email: false, verificationCode: false});
  const [modalMessage, setModalMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isPasswordResetSuccess, setIsPasswordResetSuccess] = useState(false);

  // 입력 변경 핸들러
  const signupChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 블러 이벤트 핸들러
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
  };

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    setIsOpenModal(false);
    if (isPasswordResetSuccess) {router.push("/")}
  };

  // 임시 비밀번호 변경 핸들러
  const PasswordSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    axios.put(`${apiUrl}/mail/reset`, null, {
        params: { email: formData.email },
        headers: {"Content-Type": "application/json"},
      })
      .then((response) => {
        setIsLoading(false);
        setIsEmailSent(true);
        setIsPasswordResetSuccess(true);
        setModalMessage({message: "Passcode issued successfully", background: "bird", buttonType: 2});
      })
      .catch((error) => {
        setIsLoading(false);
        setIsEmailSent(false);
        setIsPasswordResetSuccess(false);
        setModalMessage({message: "Failed to issue password", background: "bird", buttonType: 2});
      })
      .finally(() => {setIsOpenModal(true)});
  };

  // 이메일 전송 핸들러
  const emailSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    axios.post(`${apiUrl}/mail/password`, null, {
        params: {email: formData.email},
        headers: {"Content-Type": "application/json"},
      })
      .then((response) => {
        setIsLoading(false);
        setIsEmailSent(true);
        setModalMessage({message: "email-sending-successful", background: "bird", buttonType: 2});
      })
      .catch((error) => {
        setIsLoading(false);
        setIsEmailSent(false);
        setModalMessage({message: "email-sending-failed", background: "bird", buttonType: 2});
      })
      .finally(() => {setIsOpenModal(true)});
  };

  // 인증 코드 확인 핸들러
  const verifyCode = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    axios.get(`${apiUrl}/mail/check`, {
        params: {email: formData.email, userNumber: formData.verificationCode},
        headers: {"Content-Type": "application/json"},
      })
      .then((response) => {
        setIsLoading(false);
        setIsEmailVerified(true);
        setModalMessage({message: "verification-successful", background: "bird", buttonType: 2});
      })
      .catch((error) => {
        setIsLoading(false);
        setIsEmailVerified(false);
        setModalMessage({message: "verification-failed", background: "bird", buttonType: 2});
      })
      .finally(() => {setIsOpenModal(true)});
  };

  // 입력 필드 기본 스타일
  const inputStyle =
    "w-full h-10 md:h-20 rounded-full bg-white/60 shadow-md text-xl md:text-3xl pl-5 pr-16 transition-colors";

  const buttonStyle =
    "absolute top-1/2 right-5 md:text-3xl bg-gradient-to-r from-[#DBB4F3] to-[#FFC0B1] text-transparent bg-clip-text"
     
  // 입력 필드 클래스 생성 함수
  const getInputClass = (name, value) => {
    if (!touched[name]) return inputStyle;
    switch (name) {
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return `${inputStyle} ${emailRegex.test(value) ? "border-2 border-green-500" : "border-2 border-red-500"}`;
      case "verificationCode":
        return `${inputStyle} ${ isEmailVerified ? "border-2 border-green-500" : "border-2 border-red-500"}`;
      default: return inputStyle;
    }};

  return (
    <>
      {isLoading && <LoadingOverlay />}
      <form onSubmit={PasswordSubmit} className="w-screen h-screen flex flex-col items-center">
        {/* 제목 */}
        <div className="mt-14 mb-7 text-center">
          <p className="text-2xl md:text-5xl mb-2">{t("change-password")}</p>
          <p className="md:text-4xl">{t("set-your-new-password")}</p>
        </div>
        <div className="w-[75%]">
          {/* 이메일 입력 필드 */}
          <div className="relative mb-3">
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
            <button type="button" onClick={emailSubmit} className={buttonStyle} disabled={!formData.email || isEmailSent}>
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
              placeholder="12345678"
              className={getInputClass("verificationCode", formData.verificationCode)}
              required
            />
            <button type="button" onClick={verifyCode} className={buttonStyle} disabled={!formData.verificationCode || isEmailVerified}>
              {t("confirm")}
            </button>
          </div>
          {/* 취소 및 확인 버튼 */}
          <div className="flex justify-center">
            <Button text={t("cancel")} href={`/${locale}`} />
            <Button text={t("ok")} type="submit" />
          </div>
        </div>
        {/* 이미지 */}
        <Image src={Doryeoni} alt="Doryeoni" className="w-[18%] absolute top-[55%] right-[15%]" priority />
        <Image src={Raoni} alt="Raoni" className="w-[28%] absolute top-[60%] left-[15%]" priority />
      </form>
      {/* 모달 컴포넌트 */}
      {isOpenModal && (
        <Modal handleYesClick={handleCloseModal} handleCloseModal={handleCloseModal} message={modalMessage} />
      )}
    </>
  );
}