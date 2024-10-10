'use-client';

import Image from "next/image";
import React, { forwardRef } from 'react';
import Bronze from "@/public/rank/bronze.webp";
import Silver from "@/public/rank/silver.webp";
import Gold from "@/public/rank/gold.webp";
import Platinum from "@/public/rank/platinum.webp";
import Diamond from "@/public/rank/diamond.webp";
import Bird1 from "@/public/shop-bird/bird (1).webp";
import Bird2 from "@/public/shop-bird/bird (2).webp";
import Bird3 from "@/public/shop-bird/bird (3).webp";
import Bird4 from "@/public/shop-bird/bird (4).webp";



export default forwardRef(function RankListAll({userorder, userChar, userName, userTier, userXP, borderColor }, ref) {

  const tierIcon = userTier === 5000 ? Diamond :
                  userTier === 4000 ? Platinum :
                  userTier === 3000 ? Gold :
                  userTier === 2000 ? Silver : Bronze;

  const Char = userChar % 4 === 0 ? Bird1 :
              userChar % 4 === 1 ? Bird2 :
              userChar % 4 === 2 ? Bird3 : Bird4;

  return (
    <div 
      ref={ref} 
      className={`relative flex items-center bg-white px-[4%] py-[2%] font-normal rounded-lg my-[2%] animate-scale-in`}  
      style={{ border: `2px solid ${borderColor}` }}
    >
      <span className="font-bold text-gray-600">{userorder}</span>
      <Image
        src={Char}
        alt="bird"
        width={200}
        height={100}
        className="w-[auto] h-[80%] left-[12%] absolute"
      />
      <span className="left-[25%] absolute text-purple-500 font-medium">{userName}</span>
      <Image
        src={tierIcon}
        alt="diamond"
        className="w-[auto] h-[80%] left-[65%] absolute"
      />
      <span className="left-[80%] absolute text-blue-600 font-semibold">{userXP}</span>
    </div>
  );
});