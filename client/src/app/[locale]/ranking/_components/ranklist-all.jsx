'use-client';

import Image from "next/image";
import Bronze from "@/public/rank/bronze.webp";
import Silver from "@/public/rank/silver.webp";
import Gold from "@/public/rank/gold.webp";
import Platinum from "@/public/rank/platinum.webp";
import Diamond from "@/public/rank/diamond.webp";
import Bird2 from "@/public/shop-bird/bird (2).webp";

export default function RankListAll({userRank, userChar, userId, userTier, userXP, borderColor}) {
  return (
    <div className="relative flex items-center bg-white px-[4%] py-[2%] font-normal font-['Itim'] rounded-lg my-[2%]"  style={{ border: `2px solid ${borderColor}` }}>
      <span className="font-bold text-gray-600">{userRank}</span>
      <Image
        src={Bird2}
        alt="bird2"
        className="w-[auto] h-[80%] left-[12%] absolute"
      />
      <span className="left-[25%] absolute text-purple-500 font-medium">{userId}</span>
      <Image
        src={Diamond}
        alt="diamond"
        className="w-[auto] h-[80%] left-[60%] absolute"
      />
      <span className="left-[80%] absolute text-blue-600 font-semibold">{userXP}</span>
    </div>
  );
}