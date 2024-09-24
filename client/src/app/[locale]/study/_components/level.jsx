'use-client';

import Image from "next/image";
import FieldLevel from "@/public/icon2/field-level.webp";

export default function Level({ level, className }) {
  return (
    <div className={`grid place-items-center z-1 ${className}`} >
      <Image
        src={FieldLevel}
        alt="fieldlevel"
        className="w-[32vw] h-[12vh]"
      />

      <span className="absolute inset-0 flex items-center justify-center text-white text-4xl md:text-5xl lg:text-6xl" >
        {level}
      </span>
    </div>
  );
}