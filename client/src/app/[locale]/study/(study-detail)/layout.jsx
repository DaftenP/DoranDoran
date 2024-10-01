import { useLocale } from 'next-intl';
import Link from 'next/link';
import Image from "next/image";
import BackgroundLaunch from "@/public/background/launch.webp";
import Back from '@/public/icon/back.webp';
import Manual from '@/public/icon/manual.webp';

export default function Layout({ children }) {
  const locale = useLocale()

  return (
    <div className="relative h-[100vh] overflow-hidden">
      <Image
        src={BackgroundLaunch}
        alt="background-launch"
        fill
        className="z-0"
        priority
      />
      <div className="flex justify-between pt-[1vh] relative z-10 p-1">
        <Link href={`/${locale}/main`}>
          <Image src={Back} alt="back" className="w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 cursor-pointer ml-2" />
        </Link>
        <Image src={Manual} alt="manual_icon" className="w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 cursor-pointer mr-2" />
      </div>
      <div className="relative z-10 p-1">
        {children}
      </div>
    </div>
  );
}
