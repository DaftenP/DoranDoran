'use client'

import { useTranslations } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';
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
  const dispatch = useDispatch()
  const [cloud1Position, setCloud1Position] = useState(-30);
  const [cloud2Position, setCloud2Position] = useState(-30);

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
      <Image src={Cloud1} alt="cloud"
        className="absolute w-auto h-[10vh] md:w-10 md:h-10 lg:w-16 lg:h-16 z-0"
        style={{ transform: `translateX(${cloud1Position}vw) translateY(10vh)` }}
       />
      <Image src={Cloud2} alt="cloud"
        className="absolute w-auto h-[13vh] md:w-10 md:h-10 lg:w-16 lg:h-16 z-0"
        style={{ transform: `translateX(${-cloud2Position}vw) translateY(25vh)` }}
      />
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
