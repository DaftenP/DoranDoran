import Image from "next/image";
import { useTranslations } from "next-intl";
import Fire from "@/public/icon2/fire.webp";

export default function Streak() {
  const t = useTranslations("index");

  return (
    <>
      <div className="flex justify-center items-center mb-2">
        <p className="text-2xl md:text-5xl">{t("streak")}</p>
        <Image src={Fire} alt="fire" className="w-[15%]" />
      </div>
      <div className="border-2 border-[#B0BEC5] w-[90%] h-[50%] bg-[#FFF5E1] rounded-3xl">
        <div className="h-1/3">
          <div className="h-1/3 text-xl md:text-4xl flex justify-center items-center">
            {t("free-talking")}
          </div>
          <div className="h-2/3 flex justify-center items-center gap-5">
            <div className="w-[40%] h-[75%] bg-[#FFE4B5] rounded-xl"></div>
            <div className="w-[40%] h-[75%] bg-[#FFE4B5] rounded-xl"></div>
          </div>
        </div>
        <div className="h-1/3">
          <div className="h-1/3 text-xl md:text-4xl flex justify-center items-center">
            {t("speaking")}
          </div>
          <div className="h-2/3 flex justify-center items-center gap-2">
            <div className="w-[30%] h-[75%] bg-[#FFE4B5] rounded-xl"></div>
            <div className="w-[30%] h-[75%] bg-[#FFE4B5] rounded-xl"></div>
            <div className="w-[30%] h-[75%] bg-[#FFE4B5] rounded-xl"></div>
          </div>
        </div>
        <div className="h-1/3">
          <div className="h-1/3 text-xl md:text-4xl flex justify-center items-center">
            {t("listening")}
          </div>
          <div className="h-2/3 flex justify-center items-center gap-5">
            <div className="w-[40%] h-[75%] bg-[#FFE4B5] rounded-xl"></div>
            <div className="w-[40%] h-[75%] bg-[#FFE4B5] rounded-xl"></div>
          </div>
        </div>
      </div>
    </>
  );
}
