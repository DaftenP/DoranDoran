'use-client';

import { isStageCompleted } from '@/store/quiz';

export default function LevelQuiz({ level, style, className, index }) {
  return (
    <div
     className={`rounded-full ${className}`}
     style={{ 
      width: 'calc((15vw + 10vh) / 2)',  
      height: 'calc((15vw + 10vh) / 2)',  
      boxShadow: '0 3px 3px rgba(0, 0, 0, 0.3)',
      // border: '1vh solid #ffffff', 
      border: isStageCompleted(index+1) ? '1vh solid #64FE2E' : '1vh solid #ffffff',
      ...style
     }} 
    >
    </div>
  );
}