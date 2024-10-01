import Link from "next/link";
import Image from "next/image";
import { useLocale } from "next-intl";
import bird from "@/public/shop-bird/bird (7).webp";

export default function Character() {
  const locale = useLocale();
  return (
    <Link href={`/${locale}/room`} className="w-full flex justify-center items-end">
      <Image src={bird} alt="bird" className="w-[50%] my-5" />
    </Link>
  );
}
