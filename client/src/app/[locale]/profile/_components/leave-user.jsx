import { useTranslations } from "next-intl";

export default function TranslatedLeaveUser() {
  const t = useTranslations("index");

  return (
    <div className="w-[90%] flex justify-end">
      <button className="bg-red-500 rounded-xl my-2 py-1 px-5">
        <p className="text-white text-xl md:text-3xl">{t("delete-user")}</p>
      </button>
    </div>
  );
}

// "use client";

// import { useLocale, useTranslations, NextIntlClientProvider } from "next-intl";
// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function LeaveUser() {
//   const [messages, setMessages] = useState(null);
//   const locale = useLocale();

//   useEffect(() => {
//     async function loadMessages() {
//       try {
//         const loadedMessages = await import(`messages/${locale}.json`);
//         setMessages(loadedMessages.default);
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
//       <TranslatedLeaveUser />
//     </NextIntlClientProvider>
//   );
// }

// function TranslatedLeaveUser() {
//   const t = useTranslations("index");

//   const handleLeaveUser = (e) => {
//     e.preventDefault();
//     const apiUrl = process.env.NEXT_PUBLIC_API_URL;
//     axios
//       .delete(`${apiUrl}/my-page/user`, {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//       .then((response) => {
//         console.warn("회원탈퇴 성공:", response);
//       })
//       .catch((error) => {
//         console.warn("회원탈퇴 실패:", error);
//       });
//   };

//   return (
//     <div className="w-[90%] flex justify-end">
//       <button
//         className="bg-red-500 rounded-xl my-2 py-1 px-5"
//         onClick={handleLeaveUser}
//       >
//         <p className="text-white text-xl md:text-3xl">{t("delete-user")}</p>
//       </button>
//     </div>
//   );
// }
