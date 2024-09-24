'use client';

import Image from "next/image";
import { useLocale, useTranslations, NextIntlClientProvider } from 'next-intl';
import Credit from "@/public/icon/credit.webp";


export default function Itemlist({ itemName, itemIcon, itemCost }) {
  const t = useTranslations('index');

  return (
    <div className="w-[35vw] h-[19vh] relative border border-[#D1D6DE] p-4  rounded-[10px] bg-[#8E9094] bg-opacity-80" >
      <div className="left-[50%] transform -translate-x-1/2 top-[5%] absolute text-white font-['Itim'] text-center">
        {itemName}
      </div>
      <div className="w-[75%] h-[1px] left-[50%] transform -translate-x-1/2 top-[25%] absolute border border-white"></div>
      
      <Image src={itemIcon} alt={itemName} className="w-[30%] h-[30%] left-[50%] top-[30%] absolute transform -translate-x-1/2" />

      <div className="w-[90%] h-[30%] left-[5%] bottom-[5%] absolute bg-[#b0b0b0] rounded-[10px] flex items-center justify-center">
        <div className="w-[90%] h-[40%] left-[5%] top-[10%] absolute bg-[#d1d6de] rounded-[10px] flex items-center justify-center" style={{ boxShadow: '0 1px 5px rgba(0, 0, 0, 0.5)'}}>
          <Image src={Credit} alt="credit" className="w-auto h-[110%] left-[0%] absolute" />
          <div className="text-white font-['Itim']" >{itemCost}</div>
        </div>
        <div className="absolute bottom-[0%] text-black font-['Itim']">Purchase</div>
      </div>
    </div>
  );
}