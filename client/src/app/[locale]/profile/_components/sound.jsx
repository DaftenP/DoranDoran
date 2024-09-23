import { useTranslations } from "next-intl";

export default function Sound() {
  const t = useTranslations("index");

  return (
    <>
      <p className="text-xl md:text-5xl">{t("sound")}</p>
      <div className="border-2 border-[#B0BEC5] bg-[#FFF5E1] w-[90%] h-[30%] rounded-3xl flex items-center flex-col">
        {/* background music */}
        <div className="w-[90%] h-1/3 flex items-center justify-between">
          <div>
            <p className="md:text-3xl">{t("background-music")}</p>
            <div className="border-2 border-[#FFE4B5] bg-[#FFFBF2] w-[175%] h-5 rounded-full"></div>
          </div>
          <p className="md:text-3xl">50%</p>
        </div>
        {/* voice */}
        <div className="w-[90%] h-1/3 flex items-center justify-between">
          <div>
            <p className="md:text-3xl">{t("voice")}</p>
            <div className="border-2 border-[#FFE4B5] bg-[#FFFBF2] w-[610%] h-5 rounded-full"></div>
          </div>
          <p className="md:text-3xl">50%</p>
        </div>
        {/* sound effects */}
        <div className="w-[90%] h-1/3 flex items-center justify-between">
          <div>
            <p className="md:text-3xl">{t("sound-effects")}</p>
            <div className="border-2 border-[#FFE4B5] bg-[#FFFBF2] w-[230%] h-5 rounded-full"></div>
          </div>
          <p className="md:text-3xl">50%</p>
        </div>
      </div>
    </>
  );
}
