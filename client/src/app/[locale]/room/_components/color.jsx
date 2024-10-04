// import Image from 'next/image';
// import bird1 from "@/public/shop-bird/bird (1).webp";
// import bird2 from "@/public/shop-bird/bird (2).webp";
// import bird3 from "@/public/shop-bird/bird (3).webp";
// import bird4 from "@/public/shop-bird/bird (4).webp";
// import bird5 from "@/public/shop-bird/bird (5).webp";
// import bird6 from "@/public/shop-bird/bird (6).webp";
// import bird7 from "@/public/shop-bird/bird (7).webp";
// import bird8 from "@/public/shop-bird/bird (8).webp";
// import bird9 from "@/public/shop-bird/bird (9).webp";
// import bird10 from "@/public/shop-bird/bird (10).webp";
// import bird11 from "@/public/shop-bird/bird (11).webp";

// export default function bird() {
//   const birds = [
//     bird1, bird2, bird3, bird4, bird5,
//     bird6, bird7, bird8, bird9, bird10, bird11
//   ];

//   return (
//     <div className="relative w-[90%] h-[88%] z-10">
//       <div className="h-full grid grid-cols-3 grid-rows-5">
//         {birds.map((bird, index) => (
//           <div key={index} className="flex items-center justify-center">
//             <Image src={bird} alt='bird' className='w-[90%] h-[80%]' />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

import Image from 'next/image';
import bird1 from "@/public/shop-bird/bird (1).webp";
import bird2 from "@/public/shop-bird/bird (2).webp";
import bird3 from "@/public/shop-bird/bird (3).webp";
import bird4 from "@/public/shop-bird/bird (4).webp";
import bird5 from "@/public/shop-bird/bird (5).webp";
import bird6 from "@/public/shop-bird/bird (6).webp";
import bird7 from "@/public/shop-bird/bird (7).webp";
import bird8 from "@/public/shop-bird/bird (8).webp";
import bird9 from "@/public/shop-bird/bird (9).webp";
import bird10 from "@/public/shop-bird/bird (10).webp";
import bird11 from "@/public/shop-bird/bird (11).webp";

export default function Bird({ onSelectCharacter }) {
  const birds = [
    bird1, bird2, bird3, bird4, bird5,
    bird6, bird7, bird8, bird9, bird10, bird11
  ];

  return (
    <div className="relative w-[90%] h-[87.5%] z-10">
      <div className="h-full grid grid-cols-3 grid-rows-5">
        {birds.map((bird, index) => (
          <div key={index} className="flex items-center justify-center">
            <Image 
              src={bird} 
              alt='bird' 
              className='w-auto h-[80%] cursor-pointer' 
              onClick={() => onSelectCharacter(bird)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}