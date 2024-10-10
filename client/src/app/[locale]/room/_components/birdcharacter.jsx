import Image from "next/image";

const birdImages = {
  1: "https://ssafy-tailored.b-cdn.net/shop/bird/1.webp",
  2: "https://ssafy-tailored.b-cdn.net/shop/bird/2.webp",
  3: "https://ssafy-tailored.b-cdn.net/shop/bird/3.webp",
  4: "https://ssafy-tailored.b-cdn.net/shop/bird/4.webp",
  5: "https://ssafy-tailored.b-cdn.net/shop/bird/5.webp",
  6: "https://ssafy-tailored.b-cdn.net/shop/bird/6.webp",
  7: "https://ssafy-tailored.b-cdn.net/shop/bird/7.webp",
  8: "https://ssafy-tailored.b-cdn.net/shop/bird/8.webp",
  9: "https://ssafy-tailored.b-cdn.net/shop/bird/9.webp",
  10: "https://ssafy-tailored.b-cdn.net/shop/bird/10.webp",
  11: "https://ssafy-tailored.b-cdn.net/shop/bird/11.webp",
};

const hatImages = {
  0: "",
  1: "https://ssafy-tailored.b-cdn.net/shop/hat/1.webp",
  2: "https://ssafy-tailored.b-cdn.net/shop/hat/2.webp",
  3: "https://ssafy-tailored.b-cdn.net/shop/hat/3.webp",
  4: "https://ssafy-tailored.b-cdn.net/shop/hat/4.webp",
  5: "https://ssafy-tailored.b-cdn.net/shop/hat/5.webp",
  6: "https://ssafy-tailored.b-cdn.net/shop/hat/6.webp",
  7: "https://ssafy-tailored.b-cdn.net/shop/hat/7.webp",
  8: "https://ssafy-tailored.b-cdn.net/shop/hat/8.webp",
  9: "https://ssafy-tailored.b-cdn.net/shop/hat/9.webp",
  10: "https://ssafy-tailored.b-cdn.net/shop/hat/10.webp",
  11: "https://ssafy-tailored.b-cdn.net/shop/hat/11.webp",
  12: "https://ssafy-tailored.b-cdn.net/shop/hat/12.webp",
  13: "https://ssafy-tailored.b-cdn.net/shop/hat/13.webp",
  14: "https://ssafy-tailored.b-cdn.net/shop/hat/14.webp",
  15: "https://ssafy-tailored.b-cdn.net/shop/hat/15.webp",
};

const hatStyles = {
  0: "",
  1: { top: '-8%', left: '45%', width: '20%' },
  2: { top: '-8%', left: '45%', width: '20%' },
  3: { top: '-38%', left: '45%', width: '25%' },
  4: { top: '-8%', left: '45%', width: '25%', transform: 'scaleX(-1)' },
  5: { top: '-8%', left: '40%', width: '35%', transform: 'scaleX(-1)' },
  6: { top: '-15%', left: '46%', width: '20%', transform: 'scaleX(-1)' },
  7: { top: '-8%', left: '44%', width: '25%' },
  8: { top: '-10%', left: '42%', width: '30%' },
  9: { top: '-8%', left: '45%', width: '25%' },
  10: { top: '-8%', left: '50%', width: '20%' },
  11: { top: '-16%', left: '45%', width: '25%' },
  12: { top: '-8%', left: '45%', width: '25%' },
  13: { top: '-15%', left: '42%', width: '30%', transform: 'scaleX(-1)' },
  14: { top: '-35%', left: '45%', width: '25%' },
  15: { top: '-15%', left: '45%', width: '25%' },
};

export default function BirdCharacter({ color, hatId }) {
  return (
    <div className="relative w-full pb-[40%] md:pb-[35%]">
      <div className="absolute inset-0">
        <Image src={birdImages[color]}  alt="color"  layout="fill"  objectFit="contain" />
        {hatId && (
          <div className="absolute" style={{ ...hatStyles[hatId], height: 'auto' }}>
            <Image
              src={hatImages[hatId]}
              alt="Hat"
              layout="responsive"
              width={100}
              height={100}
              objectFit="contain"
            />
          </div>
        )}
      </div>
    </div>
  );
}