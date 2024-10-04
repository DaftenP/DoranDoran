'use client';

import Image from "next/image";

export default function QuizContentImageBox({ image, index, isSelected }) {
  return (
    <div className={`flex-col flex justify-center items-center relative`}> {/* 부모에 relative 추가 */}
      {/* <Image
        src={image}
        alt="image"
        width={300} // 픽셀 단위로 너비를 지정
        height={300} // 픽셀 단위로 높이를 지정
        className="w-[30%] h-auto" // CSS에서 비율을 맞추기 위해 w와 h를 설정
      /> */}
      <div className="p-[10%]">
        <img
          src={image}
          alt="image"
          className={`w-[40vw] h-auto rounded-[20%] shadow-2xl border border-4 ${isSelected ? 'border-blue-400' : 'border-transparent'}`} // 원하는 크기 및 비율 설정
        />
      </div>
    </div>
  );
}
