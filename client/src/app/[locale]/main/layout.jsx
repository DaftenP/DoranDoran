'use client'

import { useSelector } from "react-redux";
import One from "@/public/background/day.webp";
import Two from "@/public/background/launch.webp";
import Three from "@/public/background/day-blue.webp";
import Four from "@/public/background/night-blue.webp";
import Five from "@/public/background/launch-blue.webp";

export default function Layout({ children }) {
  const userBackground = useSelector((state) => state.user.profile.background);

  const renderBackground = () => {
    switch (userBackground) {
      case 1:
        return One.src;
      case 2:
        return Two.src;
      case 3:
        return Three.src;
      case 4:
        return Four.src;
      case 5:
        return Five.src;
      default:
        return One.src; // 기본 배경 이미지
    }
  };

  return (
    <div
      className="relative min-h-screen"
      style={{
        backgroundImage: `url(${renderBackground()})`, // 배경 이미지로 설정
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="relative z-10 p-1">{children}</div>
    </div>
  );
}
