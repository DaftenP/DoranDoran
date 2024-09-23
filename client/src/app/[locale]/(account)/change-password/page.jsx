import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Doryeoni from "@/public/logo/doryeoni.webp";
import Raoni from "@/public/logo/raoni.webp";
import Button from "../_components/button";

export default function SignUp() {
  const locale = useLocale();
  const t = useTranslations("index");
  return (
    <div className="relative w-screen h-screen flex flex-col items-center">
      <div className="mt-14 mb-7 text-center">
        <p className="text-2xl md:text-5xl mb-2">{t("change-password")}</p>
        <p className="md:text-4xl">{t("set-your-new-password")}</p>
      </div>
      {/* 이메일 */}
      <div className="w-[75%] flex flex-col items-center">
        <div className="relative w-full mb-4">
          <div className="flex">
            <p className="text-red-500 md:text-3xl mr-1">*</p>
            <p className="md:text-3xl mb-1">{t("e-mail")}</p>
          </div>
          <input
            type="email"
            placeholder={t("e-mail")}
            className="w-full h-10 md:h-20 rounded-full bg-white/60 shadow-md text-xl md:text-3xl pl-8 pr-28"
          />
          <p
            className="absolute top-1/2 right-5 bg-gradient-to-r from-[#DBB4F3] to-[#FFC0B1] md:text-3xl"
            style={{
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {t("send")}
          </p>
        </div>

        {/* 인증 코드 입력 필드 */}
        <div className="relative w-full">
          <div className="flex">
            <p className="text-red-500 md:text-3xl mr-1">*</p>
            <p className="md:text-3xl mb-1">{t("verification-code")}</p>
          </div>
          <input
            type="text"
            placeholder="123456"
            className="w-full h-10 md:h-20 rounded-full bg-white/60 shadow-md text-xl md:text-3xl pl-8 pr-28"
          />
          <p
            className="absolute top-1/2 right-5 bg-gradient-to-r from-[#DBB4F3] to-[#FFC0B1] md:text-3xl"
            style={{
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {t("confirm")}
          </p>
        </div>
        {/* 버튼 */}
        <div className="mt-2">
          <Button text={t("cancel")} href={`/${locale}`} />
          <Button text={t("ok")} />
        </div>
        <Image src={Doryeoni} alt="Doryeoni" className="w-[18%] absolute top-[55%] right-[15%]" />
        <Image src={Raoni} alt="Raoni" className="w-[28%] absolute top-[60%] left-[15%]" />
      </div>
    </div>
  );
}
