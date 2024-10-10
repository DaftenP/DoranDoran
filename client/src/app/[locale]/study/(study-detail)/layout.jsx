'use client'

import { useSelector } from 'react-redux';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import Image from "next/image";
import Back from '@/public/icon/back.webp';
import Manual from '@/public/icon/manual.webp';
import { usePathname } from 'next/navigation';

export default function Layout({ children }) {
  const locale = useLocale()
  const userBackground = useSelector((state) => state.user.profile.background);

  const pathname = usePathname();
  const path = pathname.startsWith(`/${locale}/study/daily`) ? 'main' : 'study';

  const renderBackground = () => {
    switch (userBackground) {
      case 1:
        return "https://ssafy-tailored.b-cdn.net/shop/bg/day.webp";
      case 2:
        return "https://ssafy-tailored.b-cdn.net/shop/bg/launch.webp";
      case 3:
        return "https://ssafy-tailored.b-cdn.net/shop/bg/day-blue.webp";
      case 4:
        return "https://ssafy-tailored.b-cdn.net/shop/bg/night-blue.webp";
      case 5:
        return "https://ssafy-tailored.b-cdn.net/shop/bg/launch-blue.webp";
      default:
        return "https://ssafy-tailored.b-cdn.net/shop/bg/day.webp"; // 기본 배경 이미지
    }
  };

  return (
    <div
      className="relative h-[100vh] overflow-hidden"
      style={{
        backgroundImage: `url(${renderBackground()})`, // 배경 이미지로 설정
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="flex justify-between mt-[2vh] relative z-10 p-1">
        <Link href={`/${locale}/${path}`}>
          <Image src={Back} alt="back" className="w-9 h-9 md:w-12 md:h-12 lg:w-16 lg:h-16 cursor-pointer ml-4" />
        </Link>
        <Image src={Manual} alt="manual_icon" className="w-9 h-9 md:w-12 md:h-12 lg:w-16 lg:h-16 cursor-pointer mr-4" />
      </div>
      <div className="relative z-10 p-1">
        {children}
      </div>
    </div>
  );
}
