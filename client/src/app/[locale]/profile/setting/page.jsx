import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Back from "@/public/icon/back.webp";
import Information from "@/app/[locale]/profile/_components/information";
import Sound from "@/app/[locale]/profile/_components/sound";
import DeleteUser from "@/app/[locale]/profile/_components/delete-user";

export default function Setting() {
  const locale = useLocale();
  const t = useTranslations("index");

  return (
    <div className="w-screen h-screen flex items-center flex-col">
      {/* 상단 메뉴바 */}
      <div className="flex items-center w-full h-[7.5%] my-[2vh]">
        <div className="w-[20%] flex justify-center">
          <Link href={`/${locale}/profile`}>
            <Image src={Back} alt="back" className="w-9 h-9 md:w-12 md:h-12 lg:w-16 lg:h-16 ml-4" />
          </Link>
        </div>
        <p className="w-[60%] text-2xl md:text-5xl text-center">
          {t("setting")}
        </p>
        <div className="w-[20%]" />
      </div>
      <hr className="w-full border-t border-[#ACACAC]" />
      {/* 세팅 컴포넌트 */}
      <div className="w-full h-full flex justify-center items-center">
        <div className="bg-white w-[90%] h-[90%] rounded-3xl flex justify-center items-center flex-col border-2 border-[#B0BEC5]">
          <Information />
          <hr className="w-[90%] border-t border-[#ACACAC] my-6" />
          <Sound />
          <div className="w-[90%] py-3 flex items-center justify-end">
            <DeleteUser />
          </div>
        </div>
      </div>
    </div>
  );
}
