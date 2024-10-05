export default function Background() {
  return (
    <div className="w-full h-full grid grid-cols-3 grid-rows-5">
      {[...Array(15)].map((_, index) => {
        const backgroundNumber = index + 1;
        return (
          <div
            key={index}
            className="rounded-md border border-[#5c3d21]/60 flex items-center justify-center"
          >
            <div className="text-[#5c3d21] font-bold text-lg md:text-4xl">
              {backgroundNumber}
            </div>
          </div>
        );
      })}
    </div>
  );
}