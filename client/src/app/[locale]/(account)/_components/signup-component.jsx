"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useLocale, useTranslations, NextIntlClientProvider } from "next-intl";
import axios from "axios";
import Button from "./button";
import Modal from "@/components/modal/modal";

// 메인 회원가입 컴포넌트
export default function SignupComponent() {
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
      <TranslatedSignup />
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

// 번역된 회원가입 폼 컴포넌트
function TranslatedSignup() {
  const locale = useLocale();
  const t = useTranslations("index");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showPasswordError, setShowPasswordError] = useState(false);
  const [showPasswordMismatchError, setShowPasswordMismatchError] = useState(false);
  const [formData, setFormData] = useState({nickname: "", email: "", password: "", confirmPassword: "", verificationCode: ""});
  const [touched, setTouched] = useState({nickname: false, email: false, password: false, confirmPassword: false, verificationCode: false});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 폼 데이터 및 관련 상태 초기화 함수
  const resetFormData = () => {
    setFormData({nickname: "", email: "", password: "", confirmPassword: "", verificationCode: ""});
    setIsEmailVerified(false);
    setIsEmailSent(false);
    localStorage.removeItem("signupFormData");
    localStorage.removeItem("isEmailVerified");
    localStorage.removeItem("isEmailSent");
  };

  // Cancel 버튼 클릭 핸들러
  const handleCancel = () => { resetFormData(); router.push(`/${locale}`)};

  // localStorage에서 데이터 불러오기
  useEffect(() => {
    const savedFormData = localStorage.getItem("signupFormData");
    if (savedFormData) {setFormData(JSON.parse(savedFormData))}
    const savedIsEmailVerified = localStorage.getItem("isEmailVerified");
    if (savedIsEmailVerified) {setIsEmailVerified(JSON.parse(savedIsEmailVerified))}
    const savedIsEmailSent = localStorage.getItem("isEmailSent");
    if (savedIsEmailSent) {setIsEmailSent(JSON.parse(savedIsEmailSent))}
  }, []);

  // 입력 변경 핸들러
  const signupChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);
    // localStorage에 데이터 저장
    localStorage.setItem("signupFormData", JSON.stringify(updatedFormData));
    // 비밀번호 필드에 대한 유효성 검사
    if (name === "password") {setShowPasswordError(value.length > 0 && value.length < 8)}
    if (name === "confirmPassword" || name === "password") {
      setShowPasswordMismatchError(
        updatedFormData.password !== updatedFormData.confirmPassword &&
          updatedFormData.confirmPassword.length > 0
      );
    }};

  // 블러 이벤트 핸들러
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
    // 비밀번호 필드에 대한 추가 검사
    if (name === "password") {
      setShowPasswordError(formData.password.length > 0 && formData.password.length < 8);
    }
    // 비밀번호 확인 필드에 대한 추가 검사
    if (name === "confirmPassword") {
      setShowPasswordMismatchError(formData.password !== formData.confirmPassword && formData.confirmPassword.length > 0);
    }};

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    setIsOpenModal(false);
    if (shouldRedirect) {
      router.push(`/${locale}`);
      // 회원가입 성공 시 localStorage 클리어
      localStorage.removeItem("signupFormData");
      localStorage.removeItem("isEmailVerified");
      localStorage.removeItem("isEmailSent");
    }
  };

  // 이메일 전송 핸들러
  const emailSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    axios.post(`${apiUrl}/mail/regist`, null, {
        params: {email: formData.email},
        headers: {"Content-Type": "application/json"},
      })
      .then((response) => {
        setIsLoading(false);
        setIsEmailSent(true);
        localStorage.setItem("isEmailSent", JSON.stringify(true));
        setModalMessage({message: "email-sending-successful", background: "bird", buttonType: 2});
      })
      .catch((error) => {
        setIsLoading(false);
        setIsEmailSent(false);
        localStorage.setItem("isEmailSent", JSON.stringify(false));
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
        localStorage.setItem("isEmailVerified", JSON.stringify(true));
        setModalMessage({message: "verification-successful", background: "bird", buttonType: 2});
      })
      .catch((error) => {
        setIsLoading(false);
        setIsEmailVerified(false);
        localStorage.setItem("isEmailVerified", JSON.stringify(false));
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
    if (!validateForm() || isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    setIsLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    axios.post(`${apiUrl}/regist`,
        {nickname: formData.nickname, email: formData.email, password: formData.password},
        {headers: {"Content-Type": "application/json"}}
      )
      .then((response) => {
        setModalMessage({message: "signup-successful", background: "bird", buttonType: 2});
        setShouldRedirect(true);
      })
      .catch((error) => {
        setModalMessage({message: "signup-failed", background: "bird", buttonType: 2});
      })
      .finally(() => {
        setIsOpenModal(true);
        setIsLoading(false);
        setIsSubmitting(false);
      });
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
    }};

  // 스타일 정의
  const inputStyle =
    "w-full h-10 md:h-20 rounded-full bg-white/60 shadow-md text-xl md:text-3xl pl-5 pr-16 transition-colors";

  const buttonStyle =
    "absolute top-1/2 right-5 md:text-3xl bg-gradient-to-r from-[#DBB4F3] to-[#FFC0B1] text-transparent bg-clip-text";

  return (
    <>
      {isLoading && <LoadingOverlay />}
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
          <div className="relative mt-3 md:mt-6">
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
            <button type="button" onClick={emailSubmit} className={buttonStyle} disabled={!formData.email || isEmailSent}>
              {t("send")}
            </button>
          </div>
          {/* 인증 코드 입력 필드 */}
          <div className="relative my-3  md:my-6">
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
            <div className="h-3 md:h-6">
            {showPasswordError && (
              <p className="text-red-500 md:text-3xl flex justify-end">
                {t("password-at-least-8-digits")}
              </p>
            )}
            </div>
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
              className={getInputClass("confirmPassword", formData.confirmPassword)}
              required
            />
            <div className="h-3 md:h-6">
              {showPasswordMismatchError && (
                <p className="text-red-500 md:text-3xl flex justify-end">
                  {t("password-mismatch")}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 취소 및 확인 버튼 */}
        <div>
        <Button text={t("cancel")} onClick={handleCancel} />
        <Button text={t("ok")} type="submit" disabled={!validateForm() || isSubmitting} />
      </div>
      </form>

      {/* 모달 컴포넌트 */}
      {isOpenModal && (
        <Modal handleYesClick={handleCloseModal} handleCloseModal={handleCloseModal} message={modalMessage} />
      )}
    </>
  );
}