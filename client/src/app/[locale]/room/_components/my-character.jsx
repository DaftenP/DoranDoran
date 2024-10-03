import Image from "next/image";
import bird from "@/public/shop-bird/bird (7).webp";

export default function Character() {
  return (
    <div className="w-full h-[30%] flex justify-center items-end">
      <Image src={bird} alt="bird" className="w-[50%] md:w-[35%]" />
    </div>
  );
}
