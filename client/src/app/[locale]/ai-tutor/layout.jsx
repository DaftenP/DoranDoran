import Image from "next/image";
import BackgroundLaunch from "@/public/background/launch.png";

export default function Layout({ children }) {
  return (
    <div className="relative min-h-screen">
      <Image
        src={BackgroundLaunch}
        alt="background-launch"
        fill
        className="z-0"
        priority
      />
      <div className="relative z-10 p-1">{children}</div>
    </div>
  );
}