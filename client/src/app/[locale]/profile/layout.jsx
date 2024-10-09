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
        return "https://ssafy-tailored.b-cdn.net/shop/bg/day.webp";
    }
  };

  return (
    <div
      className="relative min-h-screen"
      style={{
        backgroundImage: `url(${renderBackground()})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
}
