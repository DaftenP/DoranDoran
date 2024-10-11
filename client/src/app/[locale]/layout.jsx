'use client'

import "./globals.css";
import { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocale } from "next-intl";
import AuthWrapper from "./AuthWrapper";
import { ReduxProvider } from "./providers";
import { usePathname } from "next/navigation";
import LoadingComponent from "@/components/loading/loading";
import { playMainBgm, playNightBgm, stopBgm } from '@/store/sound'

const MainContent = ({ children, modal }) => {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const locale = useLocale()

  const audioMainRef = useRef(null);
  const audioNightRef = useRef(null);

  const isMainPlaying = useSelector((state) => state.sound.isMainPlaying);
  const isNightPlaying = useSelector((state) => state.sound.isNightPlaying);
  const volume = useSelector((state) => state.sound.volume)

  useEffect(() => {
    audioMainRef.current = new Audio('/bgm/a-little-taller.mp3');
    audioNightRef.current = new Audio('/bgm/explore_at_night.mp3');
    
    audioMainRef.current.loop = true;
    audioNightRef.current.loop = true;

    // 전역에서 접근 가능하도록 설정
    window.audioMain = audioMainRef.current;
    window.audioNight = audioNightRef.current;

    return () => {
      window.audioMain = null;
      window.audioNight = null;
    };
  }, []);

  useEffect(() => {
  // 새로고침 시 로컬스토리지에서 BGM 상태를 복원
  const storedBgmState = JSON.parse(localStorage.getItem('bgmState'));

  if (storedBgmState) {
    if (storedBgmState.isMainPlaying) {
      audioMainRef.current.volume = volume;
      audioMainRef.current.currentTime = 0;
      audioMainRef.current.play();
      dispatch(playMainBgm());
    } else if (storedBgmState.isNightPlaying) {
      audioNightRef.current.volume = volume;
      audioNightRef.current.currentTime = 0;
      audioNightRef.current.play();
      dispatch(playNightBgm());
    }
  }

    return () => {
      // 컴포넌트가 언마운트되거나 locale이 변경될 때 기존 오디오 정리
      if (audioMainRef.current) {
        audioMainRef.current.pause();
        audioMainRef.current.currentTime = 0;
      }
      if (audioNightRef.current) {
        audioNightRef.current.pause();
        audioNightRef.current.currentTime = 0;
      }
    };
  }, [dispatch]);

  useEffect(() => {
    // 볼륨만 조절하고, 재생 상태에는 영향 주지 않음
    if (audioMainRef.current && isMainPlaying) {
      audioMainRef.current.volume = volume;  // 볼륨만 조정
    }
    if (audioNightRef.current && isNightPlaying) {
      audioNightRef.current.volume = volume;  // 볼륨만 조정
    }
  }, [volume, isMainPlaying, isNightPlaying]);


  // 백그라운드로 넘기면 BGM 재생 안되도록 하는 코드
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // 백그라운드로 전환될 때 BGM 일시정지
        if (audioMainRef.current && isMainPlaying) {
          audioMainRef.current.pause();
        }
        if (audioNightRef.current && isNightPlaying) {
          audioNightRef.current.pause();
        }
      } else if (document.visibilityState === 'visible') {
        // 포그라운드로 돌아왔을 때 BGM 재생
        if (audioMainRef.current && isMainPlaying) {
          audioMainRef.current.play();
        }
        if (audioNightRef.current && isNightPlaying) {
          audioNightRef.current.play();
        }
      }
    };
  
    document.addEventListener('visibilitychange', handleVisibilityChange);
  
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isMainPlaying, isNightPlaying]);

  useEffect(() => {
    if ([`/${locale}/main`, `/${locale}/profile`, `/${locale}/profile/setting`, `/${locale}/ranking`, `/${locale}/study`, `/${locale}/ai-tutor`].includes(pathname) ||
      (pathname.startsWith(`/${locale}/ai-tutor`) && pathname.split('/').length === 4)) {
        if (!isMainPlaying) {
          if (audioNightRef.current) audioNightRef.current.pause();
          audioMainRef.current.currentTime = 0;
          audioMainRef.current.play();
          dispatch(playMainBgm());

          // 로컬 스토리지에 BGM 상태 저장
          localStorage.setItem('bgmState', JSON.stringify({ isMainPlaying: true, isNightPlaying: false }));
        }
    } else if ([`/${locale}/store`, `/${locale}/room`].includes(pathname)) {
      if (!isNightPlaying) {
        if (audioMainRef.current) audioMainRef.current.pause();
        audioNightRef.current.currentTime = 0;
        audioNightRef.current.play();
        dispatch(playNightBgm());

        // 로컬 스토리지에 BGM 상태 저장
        localStorage.setItem('bgmState', JSON.stringify({ isMainPlaying: false, isNightPlaying: true }));
      }
    } else {
      if (audioMainRef.current) audioMainRef.current.pause();
      if (audioNightRef.current) audioNightRef.current.pause();
      dispatch(stopBgm())

      // 로컬 스토리지에 BGM 상태 초기화
      localStorage.setItem('bgmState', JSON.stringify({ isMainPlaying: false, isNightPlaying: false }));
    }
  }, [dispatch, pathname, isMainPlaying, isNightPlaying, locale]);

  useEffect(() => {
    setLoading(true);
    const randomLoadingTime = Math.random() * 250 + 600;
    const timer = setTimeout(() => {
      setLoading(false);
    }, randomLoadingTime);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      {loading && <LoadingComponent />}
      {!loading && children}
      {modal}
    </>
  );
};

export default function RootLayout({ children, modal, params }) {
  const locale = useLocale();

  return (
    <html lang={locale}>
      <head />
      <body>
        <ReduxProvider>
          <AuthWrapper locale={locale}>
            <MainContent modal={modal}>
              {children}
            </MainContent>
          </AuthWrapper>
        </ReduxProvider>
        <div id="modal-root" />
      </body>
    </html>
  );
}