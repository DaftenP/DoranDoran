import Image from "next/image";
import BackgroundField from "@/public/background/field.webp";
import Bottom from '@/components/bottom/bottom';
import Top from '@/components/top/top';

export default function Layout({ children }) {
  return (
    <div className="relative w-[100vw] h-[200vh] z-0">
      <Image
        src={BackgroundField}
        alt="background-field"
        fill
        className="z-0"
        priority
      />
      <Top className="relative z-10"/>
      <div className="relative z-1">{children}</div>
      <Bottom className="relative z-10"/>
    </div>
  );
}
