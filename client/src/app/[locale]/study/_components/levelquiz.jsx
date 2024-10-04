'use-client';

export default function LevelQuiz({ level, style, className }) {
  return (
    <div
     className={`rounded-full ${className}`}
     style={{ 
      width: 'calc((15vw + 10vh) / 2)',  
      height: 'calc((15vw + 10vh) / 2)',  
      boxShadow: '0 3px 3px rgba(0, 0, 0, 0.3)',
      border: '1vh solid #ffffff', 
      ...style
     }} 
    >
    </div>
  );
}