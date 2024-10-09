'use client';

export default function QuizContentImageBox({ image, index, isSelected }) {
  return (
    <div className={`flex-col flex justify-center items-center relative`}> {/* 부모에 relative 추가 */}
      <div className="p-[3%]">
        <img
          src={image}
          alt="image"
          className={`w-[40vw] h-auto rounded-[20%] shadow-2xl border border-4 ${isSelected ? 'border-blue-400' : 'border-transparent'}`} // 원하는 크기 및 비율 설정
        />
      </div>
    </div>
  );
}
