'use client';

import Image from "next/image";

export default function QuizContentImageBox({ image, index }) {
  return (
    <div className='flex-col flex justify-center items-center relative'> {/* 부모에 relative 추가 */}
      {/* <Image
        src={image}
        alt="image"
        width={300} // 픽셀 단위로 너비를 지정
        height={300} // 픽셀 단위로 높이를 지정
        className="w-[30%] h-auto" // CSS에서 비율을 맞추기 위해 w와 h를 설정
      /> */}
      <img
        src={`https://ssafy-tailored.b-cdn.net/caa93901-937f-4e84-b03f-2120455321f9_1727941016.jpg`}
        alt="image"
        className="w-[30%] h-auto" // 원하는 크기 및 비율 설정
      />
    </div>
  );
}
