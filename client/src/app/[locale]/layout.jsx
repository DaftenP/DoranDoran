'use client'

import "./globals.css";
import { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocale } from "next-intl";
import AuthWrapper from "./AuthWrapper";
import { ReduxProvider } from "./providers";
import { usePathname } from "next/navigation";
import LoadingComponent from "@/components/loading/loading";
import { playMainBgm, playNightBgm, stopBgm, setVolume } from '@/store/sound'

// Redux 관련 코드는 ReduxProvider로 감싼 후에만 동작해야 함
const MainContent = ({ children, modal }) => {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false); // 로딩 상태
  const dispatch = useDispatch();
  const locale = useLocale()

  const audioMainRef = useRef(null);
  const audioNightRef = useRef(null);

  const isMainPlaying = useSelector((state) => state.sound.isMainPlaying);
  const isNightPlaying = useSelector((state) => state.sound.isNightPlaying);
  const volume = useSelector((state) => state.sound.volume)

  useEffect(() => {
    // 오디오 객체 초기화
    audioMainRef.current = new Audio('/bgm/a-little-taller.mp3');
    audioNightRef.current = new Audio('/bgm/explore_at_night.mp3');
    
    audioMainRef.current.loop = true;
    audioNightRef.current.loop = true;
  }, []);

  useEffect(() => {
    if ([`/${locale}/main`, `/${locale}/profile`, `/${locale}/profile/setting`, `/${locale}/ranking/all`, `/${locale}/ranking/group`, `/${locale}/study`, `/${locale}/ai-tutor`].includes(pathname) ||
      (pathname.startsWith(`/${locale}/ai-tutor`) && pathname.split('/').length === 4)) {
        if (!isMainPlaying) {
          if (audioNightRef.current) audioNightRef.current.pause();

          audioMainRef.current.volume = volume;
          audioMainRef.current.currentTime = 0;
          audioMainRef.current.play();
          dispatch(playMainBgm());
        }
    } else if ([`/${locale}/store`, `/${locale}/room`].includes(pathname)) {
      if (!isNightPlaying) {
        if (audioMainRef.current) audioMainRef.current.pause();
        
        audioNightRef.current.volume = volume
        audioNightRef.current.currentTime = 0;
        audioNightRef.current.play();
        dispatch(playNightBgm());
      }
    } else {
      if (audioMainRef.current) audioMainRef.current.pause();
      if (audioNightRef.current) audioNightRef.current.pause();
      dispatch(stopBgm())
    }
  }, [dispatch, pathname, isMainPlaying, isNightPlaying, locale, volume]);

  useEffect(() => {
    // 로딩 시작 (페이지가 바뀔 때마다 로딩 활성화)
    setLoading(true);

    const randomLoadingTime = Math.random() * 250 + 600;

    const timer = setTimeout(() => {
      setLoading(false);
    }, randomLoadingTime);

    return () => {
      clearTimeout(timer); // 페이지가 바뀔 때 타이머를 정리
    };
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
          {/* ReduxProvider로 감싼 후에 Redux 관련 훅 사용 */}
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
