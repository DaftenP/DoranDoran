import Image from "next/image";
import BackgroundNight from "@/public/background/night.webp";

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
      <div className="relative z-10">{children}</div>
    </div>
  );
}