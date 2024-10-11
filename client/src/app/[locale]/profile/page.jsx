import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import Bottom from "@/components/bottom/bottom";
import Setting from "@/public/icon/setting.webp";
import Character from "@/components/character/character";
import UserInfo from "@/app/[locale]/profile/_components/user-info";
import UserGameInfo from "@/app/[locale]/profile/_components/user-game-info";
import Logout from "@/app/[locale]/profile/_components/logout";

export default function Profile() {
  const locale = useLocale();
  const t = useTranslations("index");

  return (
    <>
      <div className="w-screen h-screen flex flex-col overflow-auto">
        <div className="flex items-center w-full h-[7.5%]">
          <div className="w-[10%]" />
          <p className="w-[80%] text-center text-2xl md:text-5xl p-10">{t("my-page")}</p>
          <Link href={`/${locale}/profile/setting`} className="w-[10%]">
            <Image src={Setting} alt="setting" className="w-[75%] md:w-[55%]" />
          </Link>
        </div>
        <hr className="w-full border-t border-[#ACACAC]" />
        <div className="w-full h-[82.5%] flex flex-col items-center justify-center gap-3 md:gap-10">
          <div className="bg-white/60 w-[75%] md:w-[60%] h-[42.5%] md:h-[40%] rounded-[15%] border-4 border-[#B0BEC5] flex justify-center items-end">
          <Character />
            <div className="absolute top-[13%] md:top-[10%] lg:top-[14%] bg-amber-800/85 border-2 border-amber-900 w-[50%] md:w-[30%] h-[5%] rounded-xl flex justify-center items-center">
              <p className="text-2xl md:text-4xl text-white">{t("go-room")}</p>
            </div>
          </div>   
          <UserGameInfo />
          <UserInfo />
          <div className="w-[90%] flex items-center justify-end">
            <Logout />
          </div>
        </div>
      </div>
      <Bottom />
    </>
  );
}
