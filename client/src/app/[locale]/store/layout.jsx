import Image from "next/image";
import BackgroundNight from "@/public/background/night.webp";
import Bottom from '@/components/bottom/bottom';
import Top from '@/components/top/top';

export default function Layout({ children }) {
  return (
    <div className="relative min-h-screen">
      <Image
        src={BackgroundNight}
        alt="background-night"
        fill
        className="z-0"
        priority
      />
      <Top className="relative z-2"/>
      <div className="relative z-1">{children}</div>
      <Bottom className="relative z-2"/>
    </div>
  );
}
