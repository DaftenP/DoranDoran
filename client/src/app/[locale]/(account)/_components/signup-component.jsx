import { useTranslations } from "next-intl";

export default function SignupComponent() {
  const t = useTranslations("index");
  return (
    <div className="w-[75%] flex flex-col items-center">
      <div className="w-full flex flex-col gap-4">
        {/* 닉네임 입력 필드 */}
        <div className="relative">
          <div className="flex">
            <p className="text-red-500 md:text-3xl mr-1">*</p>
            <p className="md:text-3xl mb-1">{t("nickname")}</p>
          </div>
          <input
            type="text"
            placeholder={t("nickname")}
            className="w-full h-10 md:h-20 rounded-full bg-white/60 shadow-md text-xl md:text-3xl pl-8 pr-28"
          />
          <p
            className="absolute top-1/2 right-5 md:text-3xl bg-gradient-to-r from-[#DBB4F3] to-[#FFC0B1]"
            style={{
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {t("check")}
          </p>
        </div>
        {/* 이메일 입력 필드 */}
        <div className="relative">
          <div className="flex">
            <p className="text-red-500 md:text-3xl mr-1">*</p>
            <p className="md:text-3xl mb-1">{t("e-mail")}</p>
          </div>
          <input
            type="email"
            placeholder={t("e-mail")}
            className="w-full h-10 md:h-20 rounded-full bg-white/60 shadow-md text-xl md:text-3xl pl-8 pr-28"
          />
          <p
            className="absolute top-1/2 right-5 md:text-3xl bg-gradient-to-r from-[#DBB4F3] to-[#FFC0B1]"
            style={{
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {t("send")}
          </p>
        </div>
        {/* 인증 코드 입력 필드 */}
        <div className="relative">
          <div className="flex">
            <p className="text-red-500 md:text-3xl mr-1">*</p>
            <p className="md:text-3xl mb-1">{t("verification-code")}</p>
          </div>
          <input
            type="text"
            placeholder="123456"
            className="w-full h-10 md:h-20 rounded-full bg-white/60 shadow-md text-xl md:text-3xl pl-8 pr-28"
          />
          <p
            className="md:text-3xl absolute top-1/2 right-5 bg-gradient-to-r from-[#DBB4F3] to-[#FFC0B1]"
            style={{
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {t("confirm")}
          </p>
        </div>
        {/* 비밀번호 입력 필드 */}
        <div>
          <div className="flex">
            <p className="text-red-500 md:text-3xl mr-1">*</p>
            <p className="md:text-3xl mb-1">{t("password")}</p>
          </div>
          <input
            type="password"
            placeholder={t("password")}
            className="w-full h-10 md:h-20 md:text-3xl rounded-full bg-white/60 shadow-md text-xl pl-8"
          />
        </div>
        {/* 비밀번호 확인 입력 필드 */}
        <div>
          <div className="flex">
            <p className="text-red-500 md:text-3xl mr-1">*</p>
            <p className="md:text-3xl mb-1">{t("confirm-password")}</p>
          </div>
          <input
            type="password"
            placeholder={t("confirm-password")}
            className="w-full h-10 md:h-20 rounded-full md:text-3xl bg-white/60 shadow-md text-xl pl-8"
          />
        </div>
      </div>
    </div>
  );
}
