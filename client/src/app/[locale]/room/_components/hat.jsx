// export default function Hat() {
//   return (
//     <div className="relative w-[90%] h-full z-10">
//       <div className="h-full grid grid-cols-3 grid-rows-5">
//         {[...Array(15)].map((_, index) => (
//           <div key={index}>
//             <div className="h-full flex items-center justify-center text-white font-bold text-lg md:text-4xl">
//               {index + 1}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

import Image from 'next/image';
import Hat1 from "@/public/shop-hat/hat (1).webp";
import Hat2 from "@/public/shop-hat/hat (2).webp";
import Hat3 from "@/public/shop-hat/hat (3).webp";
import Hat4 from "@/public/shop-hat/hat (4).webp";
import Hat5 from "@/public/shop-hat/hat (5).webp";
import Hat6 from "@/public/shop-hat/hat (6).webp";
import Hat7 from "@/public/shop-hat/hat (7).webp";
import Hat8 from "@/public/shop-hat/hat (8).webp";
import Hat9 from "@/public/shop-hat/hat (9).webp";
import Hat10 from "@/public/shop-hat/hat (10).webp";
import Hat11 from "@/public/shop-hat/hat (11).webp";
import Hat12 from "@/public/shop-hat/hat (12).webp";
import Hat13 from "@/public/shop-hat/hat (13).webp";
import Hat14 from "@/public/shop-hat/hat (14).webp";
import Hat15 from "@/public/shop-hat/hat (15).webp";

export default function Hat() {
  const hats = [
    Hat1, Hat2, Hat3, Hat4, Hat5,
    Hat6, Hat7, Hat8, Hat9, Hat10,
    Hat11, Hat12, Hat13, Hat14, Hat15
  ];

  return (
    <div className="relative w-[90%] h-[88%] z-10">
      <div className="h-full grid grid-cols-3 grid-rows-5">
        {hats.map((hat, index) => (
          <div key={index} className="flex items-center justify-center">
            <Image src={hat} alt='hat' className='w-[90%] h-[80%]' />
          </div>
        ))}
      </div>
    </div>
  );
}