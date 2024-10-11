'use-client';

import Image from "next/image";
import React, { forwardRef } from 'react';
import RankUp from "@/public/icon2/rank-up.webp";
import RankPlat from "@/public/icon2/rank-plat.webp";
import RankDown from "@/public/icon2/rank-down.webp";
import Bird1 from "@/public/shop-bird/bird (1).webp";
import Bird2 from "@/public/shop-bird/bird (2).webp";
import Bird3 from "@/public/shop-bird/bird (3).webp";
import Bird4 from "@/public/shop-bird/bird (4).webp";

export default forwardRef(function RankListGroup({userOrder, userChar, userName, myRank, userXP}, ref) {

  const borderColor = userOrder === 1 ? '#FFE500' :
                      userOrder === 2 ? '#A5A5A5' :
                      userOrder === 3 ? '#A97F00' :
                      userOrder === myRank ? '#1cbfff' : '#BDBDBD';

  const textColor = userOrder === 1 ? '#B8860B' :
                    userOrder === 2 ? '#4B4B4B' :
                    userOrder === 3 ? '#A0522D' :'#808080';

  const borderWidth = userOrder <= 3 || userOrder === myRank ? '3px' : '1px';

  const rankdif = userOrder <= 3 ? RankUp :
                  userOrder >= 18 ? RankDown : RankPlat;

  const rankIconSize = rankdif === RankPlat ? 'h-[60%]' : 'h-[25%]';

  const Char = userChar % 4 === 0 ? Bird1 :
              userChar % 4 === 1 ? Bird2 :
              userChar % 4 === 2 ? Bird3 : Bird4;

  return (
    <div 
      ref={ref} 
      className="h-[8vh] relative flex items-center bg-white px-[4%] py-[2%] font-normal rounded-lg my-[2%] animate-scale-in" 
      style={{ border: `${borderWidth} solid ${borderColor}` }}
    >
      <span className="font-bold" style={{ color: `${textColor}`, fontSize: '4vh' }}>{userOrder}</span>
      <Image
        src={Char}
        alt="bird"
        width={200}
        height={100}
        className="w-auto h-[80%] left-[20%] absolute"
      />
      <div className="absolute left-[45%] flex flex-col text-[2vh]" >
        <span className="text-black font-medium">{userName}</span>
        <span className="text-black font-semibold">{userXP}</span>
      </div>
      <Image
        src={rankdif}
        alt="rankdif"
        className={`w-auto ${rankIconSize} left-[85%] absolute`}
      />
    </div>
  );
});