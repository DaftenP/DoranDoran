import Image from "next/image";
import { useTranslations } from "next-intl";
import Bronze from "@/public/rank/bronze.webp";
import Logout from "@/app/[locale]/profile/_components/logout";

export default function UserInfo() {
  const t = useTranslations("index");

  return (
    <div className="bg-white w-[90%] h-[50%] rounded-3xl flex flex-col justify-center items-center">
      <div className="border-2 border-[#B0BEC5] bg-[#FFF5E1] w-[90%] h-[75%] rounded-3xl">
        <div className="w-full h-1/2 flex">
          <div className="w-[30%] border-b-2 border-r-2 border-[#B0BEC5] flex flex-col justify-center items-center">
            <div className="h-1/3 text-xl md:text-4xl flex justify-center items-center">
              {t("rank")}
            </div>
            <div className="w-full h-2/3 flex justify-center items-center">
              <Image src={Bronze} alt="bronze" className="w-[55%] md:w-[35%]" />
            </div>
          </div>
          <div className="w-[30%] border-b-2 border-[#B0BEC5]">
            <div className="h-1/3 text-xl md:text-4xl flex justify-center items-center">
              {t("level")}
            </div>
            <div className="h-2/3 flex justify-center items-center">
              <p className="text-xl md:text-4xl">85</p>
            </div>
          </div>
          <div className="w-[40%] border-b-2 border-l-2 border-[#B0BEC5]">
            <div className="h-1/3 text-xl md:text-4xl flex justify-center items-center">
              {t("nickname")}
            </div>
            <div className="h-2/3 md:text-3xl flex justify-center items-center">
              {t("nickname")}
            </div>
          </div>
        </div>
        <div className="w-full h-1/2 flex">
          <div className="w-1/2 border-r-2 border-[#B0BEC5]">
            <div className="h-1/3 text-md md:text-4xl flex justify-center items-center">
              {t("view-achievements")}
            </div>
            <div className="h-2/3 flex justify-center items-center"></div>
          </div>
          <div className="w-1/2">
            <div className="h-1/3 text-md md:text-4xl flex justify-center items-center">
              {t("active-items")}
            </div>
            <div className="h-2/3 flex justify-center items-center"></div>
          </div>
        </div>
      </div>
      <div className="w-[90%] pt-3 flex items-center justify-end">
        <Logout />
      </div>
    </div>
  );
}
