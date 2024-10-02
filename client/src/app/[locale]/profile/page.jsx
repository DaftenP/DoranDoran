import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import Bottom from "@/components/bottom/bottom";
import Setting from "@/public/icon/setting.webp";
import UserInfo from "@/app/[locale]/profile/_components/user-info";
import MyCharacter from "@/app/[locale]/profile/_components/my-character";

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
        <div className="w-full h-full flex flex-col items-center">
          <MyCharacter />
          <UserInfo />
        </div>
      </div>
      <Bottom />
    </>
  );
}