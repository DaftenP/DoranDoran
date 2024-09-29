'use-client';

import Image from "next/image";
import React, { forwardRef } from 'react';
import Bird3 from "@/public/shop-bird/bird (3).webp";
import RankUp from "@/public/icon2/rank-up.webp";
import RankPlat from "@/public/icon2/rank-plat.webp";
import RankDown from "@/public/icon2/rank-down.webp";

export default forwardRef(function RankListGroup({userRank, userChar, userId, userXP}, ref) {

  const borderColor = userRank === 1 ? '#FFE500' :
                      userRank === 2 ? '#A5A5A5' :
                      userRank === 3 ? '#A97F00' : '#808080';

  const textColor = userRank === 1 ? '#B8860B' :
                    userRank === 2 ? '#4B4B4B' :
                    userRank === 3 ? '#A0522D' : '#808080';

  const borderWidth = userRank <= 3 ? '4px' : '1px';

  const rankdif = userRank <= 3 ? RankUp :
                  userRank >= 18 ? RankDown : RankPlat;

  const rankIconSize = rankdif === RankPlat ? 'h-[60%]' : 'h-[25%]';

  return (
    <div 
      ref={ref} 
      className="h-[8vh] relative flex items-center bg-white px-[4%] py-[2%] font-normal rounded-lg my-[2%]" 
      style={{ border: `${borderWidth} solid ${borderColor}` }}
    >
      <span className="font-bold" style={{ color: `${textColor}`, fontSize: '4vh' }}>{userRank}</span>
      <Image
        src={Bird3}
        alt="bird3"
        className="w-auto h-[80%] left-[20%] absolute"
      />
      <div className="absolute left-[45%] flex flex-col text-[2vh]" >
        <span className="text-black font-medium">{userId}</span>
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