import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import Google from "@/public/icon/google.png";
import LogoKr from "@/public/logo/logo-kr.png";
import LoginForm from "./_components/login-component";

export default function Login() {
  const locale = useLocale();
  const t = useTranslations("index");
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="w-[75%] max-w-md flex flex-col items-center">
        {/* 로고 이미지 */}
        <Image src={LogoKr} alt="Logo" className="w-full h-auto mb-10" />
        {/* 로그인 컴포넌트 */}
        <LoginForm />
        <hr className="w-full border-t border-[#ACACAC] mt-5" />
        {/* 구글 이미지 */}
        <Image src={Google} alt="Google" className="my-10 cursor-pointer" />
        {/* 회원가입 링크 */}
        <div className="flex flex-col">
          <p className="text-sm">{t("ready-to-speak-korean-together?")}</p>
          <Link
            href={`/${locale}/signup`}
            className="text-center text-lg text-[#1f7efa] cursor-pointer"
          >
            {t("sign-up")}
          </Link>
        </div>
      </div>
    </div>
  );
}
