"use client";

import { login } from '@/store/authSlice';
import { useDispatch } from 'react-redux';
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useLocale, useTranslations, NextIntlClientProvider } from "next-intl";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import Modal from "@/components/modal/modal";
import HidePassword from "@/public/icon/hide-password.webp";
import ShowPassword from "@/public/icon/show-password.webp";

// 메인 로그인 폼 컴포넌트
export default function LoginForm() {
  const locale = useLocale();
  const [messages, setMessages] = useState(null);

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
      <LoginFormContent />
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

// 실제 로그인 폼 컴포넌트
function LoginFormContent() {
  const t = useTranslations("index");
  const locale = useLocale();
  const router = useRouter();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [modalMessage, setModalMessage] = useState({});
  const [formData, setFormData] = useState({email: "", password: ""});

  // 비밀번호 표시/숨김 토글 함수
  const togglePasswordVisibility = () => {setShowPassword(!showPassword)};

  // 입력 필드 변경 핸들러
  const loginChange = (e) => {setFormData({ ...formData, [e.target.name]: e.target.value })};

  // 로그인 폼 제출 핸들러
  const loginSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    axios.post(`${apiUrl}/login`,
        { email: formData.email, password: formData.password },
        {
          headers: {"Content-Type": "application/json"},        
          withCredentials: true,
        })
      .then((response) => {
        // 로그인 성공 시 처리
        const accessToken = response.headers["access"];
        localStorage.setItem("accessToken", accessToken);
        dispatch(login(accessToken));
        router.push(`/${locale}/main`);
      })
      .catch((error) => {
        // 로그인 실패 시 처리
        const errorMessage = error.response.data.message
        if (errorMessage === '존재하지 않는 이메일입니다.') {
          setModalMessage({title: "login-failed", message: "email-does-not-exist", background: "bird", buttonType: 2});
        } else if (errorMessage === '비밀번호가 잘못되었습니다. 다시 시도해 주세요.') {
          setModalMessage({title: "login-failed", message: "password-is-incorrect", background: "bird", buttonType: 2});
        } else {
          setModalMessage({title: "login-failed", background: "bird", buttonType: 2});
        }
        setIsOpenModal(true);
      })
      .finally(() => {setIsLoading(false)});
    };

  // 모달 닫기 핸들러
  const handleCloseModal = () => {setIsOpenModal(false);};

  return (
    <>
      {isLoading && <LoadingOverlay />}
      <form onSubmit={loginSubmit} className="w-full flex flex-col justify-center items-center gap-5">
        {/* 이메일 입력 필드 */}
        <div className="relative w-[75%] h-10 md:h-20">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={loginChange}
            placeholder={t("e-mail")}
            className="w-full h-full rounded-full bg-white/60 shadow-md text-xl md:text-4xl pl-7 md:pl-14"
          />
        </div>
        {/* 비밀번호 입력 필드 */}
        <div className="relative w-[75%] h-10 md:h-20">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={loginChange}
            placeholder={t("password")}
            className="w-full h-full rounded-full bg-white/60 shadow-md text-xl md:text-4xl pl-7 md:pl-14"
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
        <button type="submit" className="w-[75%] h-10 md:h-20 rounded-full bg-white/60 shadow-md">
          <p
            className="text-2xl md:text-5xl bg-gradient-to-r from-[#DBB4F3] to-[#FFC0B1]"
            style={{WebkitBackgroundClip: "text",WebkitTextFillColor: "transparent"}}>
            {t("login")}
          </p>
        </button>
        {/* 비밀번호 찾기 링크 */}
        <div className="w-[75%] flex justify-end md:my-3">
          <Link href={`/${locale}/change-password`} className="text-sm md:text-3xl text-[#1f7efa]">
            {t("forgot-your-password?")}
          </Link>
        </div>
      </form>
      {/* 모달 컴포넌트 */}
      {isOpenModal && (
        <Modal handleYesClick={handleCloseModal} handleCloseModal={handleCloseModal} message={modalMessage}/>
      )}
    </>
  );
}