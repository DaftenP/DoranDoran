export default function Hat() {
  return (
    <div className="relative flex items-center justify-center z-10">
      <div className="w-full px-4">
        <div className="grid grid-cols-3">
          {[...Array(15)].map((_, index) => (
            <div key={index} className="relative pb-[73.5%]">
              <div className="border-2 border-blue-500 absolute inset-0 flex items-center justify-center text-white font-bold text-lg">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
