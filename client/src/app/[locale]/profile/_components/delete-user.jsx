"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useLocale, useTranslations, NextIntlClientProvider } from "next-intl";
import axios from "axios";
import Modal from "@/components/modal/modal";

export default function DeleteUser() {
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

  if (!messages) {
    return <div>Loading...</div>;
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <TranslatedDeleteUser />
    </NextIntlClientProvider>
  );
}

function TranslatedDeleteUser() {
  const t = useTranslations("index");
  const router = useRouter();
  const locale = useLocale();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [modalMessage, setModalMessage] = useState(null);

  // 모달 열기 함수
  const handleOpenModal = (messageIndex) => {
    setModalMessage(modalMessages[messageIndex]);
    setIsOpenModal(true);
  };

  // 모달 닫기 함수
  const handleCloseModal = () => {
    setIsOpenModal(false);
  };

  // 모달 메시지 정의
  const modalMessages = [
    {
      message: "do-you-want-to-leave?",
      background: "bird",
      buttonLink: "profile/setting",
      buttonType: 1,
    },
  ];

  // 모달에서 '예' 버튼 클릭 처리 함수
  const handleYesClick = (buttonLink) => {
    if (buttonLink === "profile/setting") {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      axios
        .delete(`${apiUrl}/my-page/user`, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        })
        .then(() => {
          localStorage.removeItem("accessToken");
          router.push(`/${locale}/`);
        })
        .catch((error) => {});
    }
  };

  return (
    <>
      <button className="bg-red-500 rounded-xl py-1 px-3" onClick={() => handleOpenModal(0)}>
        <p className="text-white text-xl md:text-3xl">{t("delete-user")}</p>
      </button>
      {isOpenModal && (
        <div>
          <Modal handleYesClick={handleYesClick} handleCloseModal={handleCloseModal} message={modalMessage} />
        </div>
      )}
    </>
  );
}