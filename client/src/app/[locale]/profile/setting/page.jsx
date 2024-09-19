import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Back from "@/public/icon/back.png";
import Information from "@/app/[locale]/profile/_components/information";
import Sound from "@/app/[locale]/profile/_components/sound";

export default function Setting() {
  const locale = useLocale();
  const t = useTranslations("index");

  return (
    <div className="w-screen h-screen flex items-center flex-col">
      {/* 상단 메뉴바 */}
      <div className="flex items-center w-full h-[7.5%]">
        <div className="w-[20%] flex justify-center">
          <Link href={`/${locale}/profile`}>
            <Image src={Back} alt="back" className="w-8 cursor-pointer" />
          </Link>
        </div>
        <p className="w-[60%] text-2xl text-center">{t("setting")}</p>
        <div className="w-[20%]" />
      </div>
      <hr className="w-full border-t border-[#ACACAC]" />
      {/* 세팅 컴포넌트 */}
      <div className="w-full h-full flex justify-center items-center">
        <div className="bg-white w-[90%] h-[80%] rounded-3xl flex justify-center items-center flex-col">
          <Information />
          <hr className="w-[90%] border-t border-[#ACACAC] my-5" />
          <Sound />
        </div>
      </div>
    </div>
  );
}
