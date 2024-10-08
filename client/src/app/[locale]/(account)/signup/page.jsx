import { useTranslations } from "next-intl";
import Language from "@/app/[locale]/(account)/_components/language";
import SignupComponent from "@/app/[locale]/(account)/_components/signup-component";

export default function SignUp() {
  const t = useTranslations("index");

  return (
    <div className="relative w-screen h-screen flex flex-col items-center">
      {/* 페이지 제목 */}
      <div className="mt-14 mb-7 text-center">
        <p className="text-2xl md:text-5xl mb-2">{t("create-your-account")}</p>
        <p className="md:text-4xl">{t("please-fill-in-all-the-fields-below")}</p>
      </div>
      {/* 언어 설정 컴포넌트 */}
      <div className="pt-2 w-[75%] flex"><Language /></div>
      {/* 회원가입 컴포넌트 */}
      <SignupComponent />
    </div>
  );
}