'use client'

import { useTranslations } from 'next-intl';
import { fetchUserData } from '@/store/user';
import { useEffect, useState } from 'react';
import Image from 'next/image'
import Cloud1 from '@/public/icon2/cloud1.webp'
import Cloud2 from '@/public/icon2/cloud2.webp'
import Top from '@/components/top/top';
import Bottom from '@/components/bottom/bottom';
import WeekTask from '@/app/[locale]/main/_components/week-task'
import Character from '@/app/[locale]/main/_components/character'

export default function Main() {
  const [cloud1Position, setCloud1Position] = useState(-10);
  const [cloud2Position, setCloud2Position] = useState(-10);

  useEffect(() => {
    const interval = setInterval(() => {
      setCloud1Position((prev) => (prev >= 130 ? -90 : prev + 0.5))
      setCloud2Position((prev) => (prev >= 130 ? -90 : prev + 0.3))
    }, 60)

    return () => clearInterval(interval)
  }, [])

  // useEffect(() => {
  //   dispatch(fetchUserData())
  // }, [])

  return (
    <div className='relative z-10'>
      <Top />
      <div className='absolute top-0 left-0 w-[98vw] h-[50vh] overflow-hidden'>
        <Image src={Cloud1} alt="cloud"
          className="absolute w-auto h-[10vh] md:w-auto md:h-10 lg:w-auto lg:h-16 z-0"
          style={{ transform: `translateX(${cloud1Position}vw) translateY(10vh)` }}
        />
        <Image src={Cloud2} alt="cloud"
          className="absolute w-auto h-[13vh] md:w-auto md:h-10 lg:w-auto lg:h-16 z-0"
          style={{ transform: `translateX(${-cloud2Position}vw) translateY(25vh)` }}
        />
      </div>
      <div className='relative mt-[10vh] mb-[12vh]'>
        <WeekTask />
        <Character />
      </div>
      <div className='relative z-30'>
        <Bottom />
      </div>
    </div>
  );
}
