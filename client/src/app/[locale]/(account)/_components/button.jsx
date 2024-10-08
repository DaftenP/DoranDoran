import Link from "next/link";

export default function GradientButton({ text, href, onClick }) {
  const ButtonContent = () => (
    <p className="bg-gradient-to-r from-[#DBB4F3] to-[#FFC0B1]"
      style={{WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"}}
    >
      {text}
    </p>
  );

  return (
    <button className="m-4 w-20 md:w-32 h-10 md:h-16 md:text-3xl rounded-full bg-white/60 shadow-md">
      {href ? (<Link href={href}><ButtonContent /></Link>) : (<div onClick={onClick}><ButtonContent /></div>)}
    </button>
  );
}