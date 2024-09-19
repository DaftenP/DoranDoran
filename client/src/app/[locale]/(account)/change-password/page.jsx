import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Doryeoni from "@/public/logo/doryeoni.png";
import Raoni from "@/public/logo/raoni.png";
import Button from "../_components/button";

export default function SignUp() {
  const locale = useLocale();
  const t = useTranslations("index");
  return (
    <div className="relative w-screen h-screen flex flex-col items-center">
      <div className="mt-14 mb-7 text-center">
        <p className="text-2xl mb-2">{t("change-password")}</p>
        <p>{t("set-your-new-password")}</p>
      </div>
      {/* 이메일 */}
      <div className="w-[75%] max-w-md flex flex-col items-center">
        <div className="relative">
          <div className="flex">
            <p className="text-red-500 mr-1">*</p>
            <p>{t("e-mail")}</p>
          </div>
          <input
            type="email"
            placeholder={t("e-mail")}
            className="w-full h-10 rounded-full bg-white/60 shadow-md text-xl pl-8 pr-28"
          />
          <p
            className="absolute top-1/2 right-5 cursor-pointer bg-gradient-to-r from-[#DBB4F3] to-[#FFC0B1]"
            style={{
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {t("send")}
          </p>
        </div>
        {/* 버튼 */}
        <div className="mt-4">
          <Button text={t("cancel")} href={`/${locale}`} />
          <Button text={t("ok")} />
        </div>
        <Image src={Doryeoni} className="w-[20%] absolute top-[55%] right-14" />
        <Image src={Raoni} className="w-[30%] absolute top-[45%] left-14" />
      </div>
    </div>
  );
}
