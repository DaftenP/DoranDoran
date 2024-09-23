import { useLocale, useTranslations } from "next-intl";
import Button from "../_components/button";
import Language from "../_components/language";
import SignupComponent from "../_components/signup-component";

export default function SignUp() {
  const t = useTranslations("index");
  const locale = useLocale();

  return (
    <div className="relative w-screen h-screen flex flex-col items-center">
      {/* 페이지 제목 */}
      <div className="mt-14 mb-7 text-center">
        <p className="text-2xl md:text-5xl mb-2">{t("create-your-account")}</p>
        <p className="md:text-4xl">
          {t("please-fill-in-all-the-fields-below")}
        </p>
      </div>
      {/* 언어 설정 컴포넌트 */}
      <div className="pt-2 w-[75%] flex">
        <Language />
      </div>
      {/* 회원가입 컴포넌트 */}
      <SignupComponent />
      {/* 버튼 컴포넌트 */}
      <div className="mt-4">
        <Button text={t("cancel")} href={`/${locale}`} />
        <Button text={t("ok")} />
      </div>
    </div>
  );
}
