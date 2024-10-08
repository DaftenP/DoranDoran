import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import LogoKr from "@/public/logo/logo-kr.webp";
import LoginForm from "@/app/[locale]/(account)/_components/login-component";

export default function Login() {
  const locale = useLocale();
  const t = useTranslations("index");
  
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="w-full h-full flex flex-col justify-center items-center">
        {/* 로고 이미지 */}
        <Image src={LogoKr} alt="Logo" className="md:w-[75%] w-[75%] h-auto mb-10" priority />
        {/* 로그인 컴포넌트 */}
        <LoginForm />
        <hr className="w-[75%] my-5 border-t border-[#ACACAC]" />
        {/* 회원가입 링크 */}
        <div className="flex flex-col">
          <p className="text-sm md:text-3xl">{t("ready-to-speak-korean-together?")}</p>
          <Link href={`/${locale}/signup`} className="text-center text-lg md:text-4xl text-[#1f7efa]">
            {t("sign-up")}
          </Link>
        </div>
      </div>
    </div>
  );
}