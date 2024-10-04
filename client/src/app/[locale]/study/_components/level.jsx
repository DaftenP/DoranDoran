'use-client';

import Image from "next/image";
import FieldLevel from "@/public/icon2/field-level.webp";

export default function Level({ level, className }) {
  const per = 'calc((1vw + 1vh) / 2)';

  const width = `calc(20 * ${per})`;
  const height = `calc(12 * ${per})`;
  return (
    <div className={`grid place-items-center z-10 ${className}`} >
      <Image
        src={FieldLevel}
        alt="fieldlevel"
        className=""
        style={{
          width: width,  
          height: height   
        }}
      />
      <span className="absolute inset-0 flex items-center justify-center text-white text-4xl md:text-5xl lg:text-6xl" >
        {level}
      </span>
    </div>
  );
}