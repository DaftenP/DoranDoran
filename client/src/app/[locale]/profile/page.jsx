import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import MyCharacter from "./_components/my-character";
import Fire from "@/public/icon2/fire.webp";
import Setting from "@/public/icon/setting.webp";
import Bottom from "@/components/bottom/bottom";

export default function Profile() {
  const locale = useLocale();
  const t = useTranslations("index");

  return (
    <>
      <div className="w-screen h-screen flex flex-col overflow-auto">
        <div className="flex items-center w-full h-[7.5%]">
          <div className="w-[10%]" />
          <p className="w-[80%] text-center text-2xl md:text-5xl p-10">
            {t("my-page")}
          </p>
          <Link href={`/${locale}/profile/setting`} className="w-[10%]">
            <Image src={Setting} alt="setting" className="w-[75%] " />
          </Link>
        </div>
        <hr className="w-full border-t border-[#ACACAC]" />
        <div className="w-full flex flex-col justify-center items-center">
          <MyCharacter />
          <div className="bg-white w-[90%] h-screen rounded-3xl mb-24 flex flex-col justify-center items-center">
            <div className="border-2 border-[#B0BEC5] bg-[#FFF5E1] w-[90%] h-[30%] rounded-3xl"></div>
            <hr className="w-[90%] border-t border-[#ACACAC] my-5" />
            <div className="flex justify-center items-center mb-2">
              <p className="text-2xl md:text-5xl">{t("streak")}</p>
              <Image src={Fire} alt="fire" className="w-[15%]" />
            </div>
            <div className="border-2 border-[#B0BEC5] w-[90%] h-[50%] bg-[#FFF5E1] rounded-3xl"></div>
          </div>
        </div>
      </div>
      <Bottom />
    </>
  );
}
