export default function Character() {
  return (
    <div className="relative w-[90%] h-full z-10">
      <div className="h-full grid grid-cols-3 grid-rows-5">
        {[...Array(15)].map((_, index) => (
          <div key={index}>
            <div className="h-full border-2 border-blue-500 flex items-center justify-center text-white font-bold text-lg md:text-4xl">
              {index + 1}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
