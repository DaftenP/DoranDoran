"use client";

export default function QuizContentImageBox({ image, index, isSelected }) {
  return (
    <div className={`z-10 flex-col flex justify-center items-center relative`}>
      {" "}
      {/* 부모에 relative 추가 */}
      <div className="p-[3%]">
        <img
          src={image}
          alt="image"
          className={`w-[45vw] h-auto rounded-[20%] shadow-2xl border border-4 ${
            isSelected ? "border-[#FF0000]" : "border-transparent"
            }`} // 원하는 크기 및 비율 설정
          style={{
            transform: `scale(${isSelected ? 1.1 : 1})`, // 선택된 이미지 확대
            transition: "transform 0.3s", // 애니메이션 효과
          }}
        />
      </div>
    </div>
  );
}
