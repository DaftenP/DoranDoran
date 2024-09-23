import Image from "next/image";
import BackgroundDay from "@/public/background/day.webp";

export default function Layout({ children }) {
  return (
    <div className="relative min-h-screen">
      <Image
        src={BackgroundDay}
        alt="background-day"
        fill
        className="z-0"
        priority
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}