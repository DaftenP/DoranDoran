import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link"; // 새로 추가된 import
import Profile from "@/public/icon/profile.webp";
import Birthday from "@/public/icon/birthday.webp";
import Email from "@/public/icon/email.webp";
import Translation from "@/public/icon/translation.webp";
import Pencil from "@/public/icon/pencil.webp";

export default function Information() {
  const t = useTranslations("index");
  const locale = useLocale();

  return (
    <>
      <div className="border-2 border-[#B0BEC5] bg-[#FFF5E1] w-[90%] h-[50%] rounded-3xl flex flex-col justify-center items-center">
        {/* 닉네임 수정 */}
        <div className="w-[90%] h-1/5 flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src={Profile}
              alt="Profile"
              className="w-[18%] md:w-[30%] pointer-events-none"
            />
            <div className="ml-2 md:ml-5 flex flex-col">
              <p className="text-[10px] md:text-xl">{t("nickname")}</p>
              <p className="md:text-3xl">{t("nickname")}</p>
            </div>
          </div>
          <Image src={Pencil} alt="Pencil" className="w-[10%] md:w-[7.5%]" />
        </div>
        <hr className="w-[90%] border-t border-[#ACACAC]" />
        {/* 이메일 수정 */}
        <div className="w-[90%] h-1/5 flex items-center">
          <Image src={Email} alt="Email" className="w-[8.5%] ml-1 pointer-events-none" />
          <div className="ml-2 flex flex-col md:ml-5">
            <p className="text-[10px] md:text-xl">{t("e-mail")}</p>
            <p className="md:text-3xl">{t("e-mail")}</p>
          </div>
        </div>
        <hr className="w-[90%] border-t border-[#ACACAC]" />
        {/* 생년월일 수정 */}
        <div className="w-[90%] h-1/5 flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src={Birthday}
              alt="Birthday"
              className="w-[18%] md:w-[40%] pointer-events-none"
            />
            <div className="ml-2 flex flex-col md:ml-5">
              <p className="text-[10px] md:text-xl">{t("birth")}</p>
              <p className="md:text-3xl">{t("birth")}</p>
            </div>
          </div>
          <Image src={Pencil} className="w-[10%] md:w-[7.5%]" />
        </div>
        <hr className="w-[90%] border-t border-[#ACACAC] mb-2" />
        {/* 언어 수정 */}
        <div className="w-[90%] h-1/5 flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src={Translation}
              alt="Translation"
              className="w-[22%] md:w-16 ml-1 pointer-events-none"
            />
            <div className="ml-2 flex flex-col md:ml-5">
              <p className="text-[10px] md:text-xl">{t("language")}</p>
              <p className="md:text-3xl">{t("english")}</p>
            </div>
          </div>
          <Image src={Pencil} alt="Pencil" className="w-[10%] md:w-[7.5%]" />
        </div>
        <hr className="w-[90%] border-t border-[#ACACAC]" />
        {/* 비밀번호 수정 */}
        <div className="w-full h-1/5 flex items-center">
          <Link
            href={`/${locale}/profile/setting/change-password`}
            className="w-[60%] bg-[#FFE4B5] rounded-full flex justify-center ml-5"
          >
            <p className="text-xl md:text-4xl">{t("change-password")}</p>
          </Link>
        </div>
      </div>
    </>
  );
}
