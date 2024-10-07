'use client'

import { useSelector } from "react-redux";

export default function Layout({ children }) {
  const userBackground = useSelector((state) => state.user.profile.background);

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
