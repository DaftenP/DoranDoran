'use client';

import Image from "next/image";
import BackgroundFieldOnly from "@/public/background/fieldonly.webp";
import Bottom from '@/components/bottom/bottom';
import Top from '@/components/top/top';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';

export default function Layout({ children }) {
  const locale = useLocale();
  const pathname = usePathname();

  const shouldShowTop = !(pathname.startsWith(`/${locale}/study/detail`) || pathname.startsWith(`/${locale}/study/daily`));
  const shouldShowBottom = !(pathname.startsWith(`/${locale}/study/detail`) || pathname.startsWith(`/${locale}/study/daily`));
  const backgroundHeight = pathname.startsWith(`/${locale}/study/detail`) || pathname.startsWith(`/${locale}/study/daily`) ? 'h-[100vh]' : 'h-[200vh]';

  return (
    <div className={`relative w-[100vw] ${backgroundHeight}`}>
      <Image
        src={BackgroundFieldOnly}
        alt="background-fieldonly"
        fill
        className="z-0"
        priority
      />
      {shouldShowTop && <Top className="relative z-30" />}
      <div className="relative z-0">{children}</div>
      {shouldShowBottom && <Bottom className="relative z-30"/>}
    </div>
  );
}
