import { useTranslations } from "next-intl";
import Image from "next/image";
import Profile from "@/public/icon/profile.png";
import Birthday from "@/public/icon/birthday.png";
import Email from "@/public/icon/email.png";
import Translation from "@/public/icon/translation.png";
import Pencil from "@/public/icon/pencil.png";

export default function Information() {
  const t = useTranslations("index");

  return (
    <>
      <div className="border-2 border-[#B0BEC5] bg-[#FFF5E1] w-[90%] h-[50%] rounded-3xl flex flex-col justify-center items-center">
        {/* 닉네임 수정 */}
        <div className="w-[90%] h-1/5 flex items-center justify-between">
          <div className="flex items-center">
            <Image src={Profile} className="w-[12%] pointer-events-none" />
            <div className="ml-2 flex flex-col">
              <p className="text-[10px]">{t("nickname")}</p>
              <p>{t("nickname")}</p>
            </div>
          </div>
          <Image src={Pencil} className="w-[10%] cursor-pointer" />
        </div>
        <hr className="w-[90%] border-t border-[#ACACAC]" />
        {/* 이메일 수정 */}
        <div className="w-[90%] h-1/5 flex items-center">
          <Image src={Email} className="w-[8.5%] ml-1 pointer-events-none" />
          <div className="ml-2 flex flex-col">
            <p className="text-[10px]">{t("e-mail")}</p>
            <p>{t("e-mail")}</p>
          </div>
        </div>
        <hr className="w-[90%] border-t border-[#ACACAC]" />
        {/* 생년월일 수정 */}
        <div className="w-[90%] h-1/5 flex items-center justify-between">
          <div className="flex items-center">
            <Image src={Birthday} className="w-[12%] pointer-events-none" />
            <div className="ml-2 flex flex-col">
              <p className="text-[10px]">{t("birth")}</p>
              <p>{t("birth")}</p>
            </div>
          </div>
          <Image src={Pencil} className="w-[10%] cursor-pointer" />
        </div>
        <hr className="w-[90%] border-t border-[#ACACAC] mb-2" />
        {/* 언어 수정 */}
        <div className="w-[90%] h-1/5 flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src={Translation}
              className="w-[22%] ml-1 pointer-events-none"
            />
            <div className="ml-2 flex flex-col">
              <p className="text-[10px]">{t("language")}</p>
              <p>{t("english")}</p>
            </div>
          </div>
          <Image src={Pencil} className="w-[10%] cursor-pointer" />
        </div>
        <hr className="w-[90%] border-t border-[#ACACAC]" />
        {/* 비밀번호 수정 */}
        <div className="w-full h-1/5 flex items-center">
          <div className="w-[60%] bg-[#FFE4B5] rounded-full flex justify-center ml-5 cursor-pointer">
            <p className="text-xl">{t("change-password")}</p>
          </div>
        </div>
      </div>
    </>
  );
}
