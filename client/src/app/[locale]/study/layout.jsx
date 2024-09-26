import Image from "next/image";
import BackgroundFieldOnly from "@/public/background/fieldonly.webp";
import Bottom from '@/components/bottom/bottom';
import Top from '@/components/top/top';

export default function Layout({ children }) {
  return (
    <div className="relative w-[100vw] h-[200vh]">
      <Image
        src={BackgroundFieldOnly}
        alt="background-fieldonly"
        fill
        className="z-0"
        priority
      />
      <Top className="relative z-30"/>
      <div className="relative z-0">{children}</div>
      <Bottom className="relative z-30"/>
    </div>
  );
}
