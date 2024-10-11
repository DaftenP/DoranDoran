"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useLocale, NextIntlClientProvider } from "next-intl";
import ChangePassword from "@/app/[locale]/profile/setting/change-password/page";

// 비밀번호 변경 인터셉트 컴포넌트
export default function InterceptChangePassword() {
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
      <TranslatedChagnePassword />
    </NextIntlClientProvider>
  );
}

// 정보를 표시하는 컴포넌트
function TranslatedChagnePassword() {
  const dialogRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    // 컴포넌트가 마운트되면 다이얼로그를 표시
    if (!dialogRef.current?.open) { dialogRef.current?.showModal() }
  }, []);

  return (
    <dialog
      // 다이얼로그 외부를 클릭하면 이전 페이지로 돌아감
      onClick={(e) => { if (e.target.nodeName === "DIALOG") {router.back()}}}
      className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[60%] flex flex-col items-center rounded-3xl shadow-xl z-10 bg-[#FFF5E1]"
      ref={dialogRef}
    >
      <ChangePassword />
      <style jsx>{`dialog::backdrop { background-color: rgba(0, 0, 0, 0.5) }`}</style>
    </dialog>
  );
}