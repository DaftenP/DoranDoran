"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useLocale, useTranslations, NextIntlClientProvider } from "next-intl";
import axios from "axios";

export default function ChangePassword() {
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
      <TranslatedInformation />
    </NextIntlClientProvider>
  );
}

function TranslatedInformation() {
  const t = useTranslations("index");
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  // 비밀번호 변경 처리 함수
  const handleChangePassword = (e) => {
    e.preventDefault();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    // 새 비밀번호와 확인 비밀번호가 일치하는지 확인
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }
    // API를 통해 비밀번호 변경 요청
    axios.patch(`${apiUrl}/my-page/password`,
      { prevPassword: currentPassword,  modPassword: newPassword },
      { headers: {"Content-Type": "application/json"}, withCredentials: true }
    )
      .then((response) => { router.back() })
      .catch((error) => { setError(t("password-change-error")) }
    );
  };

  return (
    <div className="w-full h-full text-center flex flex-col justify-center items-center">
      <div className="h-1/3 text-2xl md:text-4xl flex justify-center items-center">
        <p>{t("protect-your-account-by-updating-your-password")}</p>
      </div>
      <div className="w-full h-2/3 flex flex-col justify-center items-center">
        {/* 현재 비밀번호 입력 필드 */}
        <div className="w-full h-1/3 flex justify-center items-center">
          <input
            type="password"
            className="w-[75%] h-[75%] text-xl md:text-4xl pl-2 rounded-2xl"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        {/* 새 비밀번호 입력 필드 */}
        <div className="w-full h-1/3 flex justify-center items-center">
          <input
            type="password"
            className="w-[75%] h-[75%] text-xl md:text-4xl pl-2 rounded-2xl"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        {/* 새 비밀번호 확인 입력 필드 */}
        <div className="w-full h-1/3 flex justify-center items-center">
          <input
            type="password"
            className="w-[75%] h-[75%] text-xl md:text-4xl pl-2 rounded-2xl"
            placeholder="New Password Confirm"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
      </div>
      {/* 에러 메시지 표시 */}
      {error && <div className="text-red-500">{error}</div>}
      {/* 취소 및 저장 버튼 */}
      <div className="w-[85%] h-1/4 flex justify-center items-center gap-5">
        <div
          className="w-full h-1/2 bg-[#FFC0B1]/80 border-2 border-[#FF8669] rounded-2xl flex justify-center items-center text-2xl md:text-4xl cursor-pointer"
          onClick={() => router.back()}
        >
          {t("cancel")}
        </div>
        <div
          className="w-full h-1/2 bg-[#DBB4F3]/80 border-2 border-[#9E00FF] rounded-2xl flex justify-center items-center text-2xl md:text-4xl cursor-pointer"
          onClick={handleChangePassword}
        >
          {t("save")}
        </div>
      </div>
    </div>
  );
}