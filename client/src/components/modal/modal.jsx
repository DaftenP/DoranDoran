"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import Image from "next/image";
import Raoni from "@/public/logo/raoni.webp";

export default function Modal({ children }) {
  const dialogRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal();
    }
  }, []);

  return createPortal(
    <dialog
      onClose={() => router.back()}
      onClick={(e) => {
        if (e.target.nodeName === "DIALOG") {
          router.back();
        }
      }}
      className="w-[80%] h-[40%] flex flex-col justify-center items-center rounded-lg shadow-xl z-10"
      ref={dialogRef}
    >
      <Image src={Raoni} alt="Raoni" className="w-[75%]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex justify-center items-center flex-col">
        <div className="w-2/3 h-1/2 flex justify-center items-center text-xl">
          {children}
        </div>
        <div className="w-[85%] h-1/3 flex justify-center items-center gap-5">
          <div className="w-full h-2/3 bg-[#FFC0B1]/80 border-2 border-[#FF8669] rounded-3xl flex justify-center items-center text-2xl"></div>
          <div className="w-full h-2/3 bg-[#DBB4F3]/80 border-2 border-[#9E00FF] rounded-3xl flex justify-center items-center text-2xl"></div>
        </div>
      </div>
      <style jsx>{`
        dialog::backdrop {
          background-color: rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </dialog>,
    document.getElementById("modal-root")
  );
}

// 'use client';

// import { useTranslations, NextIntlClientProvider } from 'next-intl';
// import { useEffect, useState } from 'react';

// export default function Modal() {
//   const [messages, setMessages] = useState(null);
//   const locale = 'en'; // 예시로 en 사용, 동적 처리 가능

//   useEffect(() => {
//     async function loadMessages() {
//       try {
//         const loadedMessages = await import(`messages/${locale}.json`);
//         setMessages(loadedMessages.default); // 메시지 로드
//       } catch (error) {
//         console.error(`Failed to load messages for locale: ${locale}`);
//       }
//     }
//     loadMessages();
//   }, [locale]);

//   if (!messages) {
//     return <div>Loading...</div>; // 메시지가 로드될 때까지 로딩 표시
//   }

//   return (
//     <NextIntlClientProvider locale={locale} messages={messages}>
//       <TranslatedModal />
//     </NextIntlClientProvider>
//   );
// }

// function TranslatedModal() {
//   const t = useTranslations('index');
//   const [isVisible, setIsVisible] = useState(false)

//   const handleModalClosed = () => {
//     setIsVisible(false)
//   }

//   return (
//     <div className={`fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center ${isVisible ? 'visible' : 'invisible'}`}>
//       <div className="bg-white p-6 rounded-lg shadow-lg">
//         <h2>안녕하세요</h2>
//         <button onClick={handleModalClosed} className="mt-4 p-2 bg-red-500 text-white rounded">닫기</button>
//       </div>
//     </div>
//   );
// }
