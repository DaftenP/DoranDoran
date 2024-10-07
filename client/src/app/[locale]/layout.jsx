'use client'

import "./globals.css";
import { useState, useEffect, useRef } from "react";
import { useLocale } from "next-intl";
import AuthWrapper from "./AuthWrapper";
import { ReduxProvider } from "./providers";
import { usePathname } from "next/navigation";
import LoadingComponent from "@/components/loading/loading"

export default function RootLayout({ children, modal, params }) {
  const locale = useLocale()
  const pathname = usePathname()
  const audioMain = useRef(null)
  const audioNight = useRef(null)
  const [loading, setLoading] = useState(false); // 로딩 상태

  useEffect(() => {
    if (!audioMain.current) {
      audioMain.current = new Audio('/bgm/a-little-taller.mp3')
      audioMain.current.loop = true
    }
    if (!audioNight.current) {
      audioNight.current = new Audio('/bgm/explore_at_night.mp3')
      audioNight.current.loop = true
    }

    // 로딩 시작 (페이지가 바뀔 때마다 로딩 활성화)
    setLoading(true);
    
    // main, profile, ranking, study, ai-tutor 대화 진입 직전 페이지 그룹에 있을 때 Main BGM 시작
    if (
      [`/${locale}/main`, `/${locale}/profile`, `/${locale}/profile/setting`, `/${locale}/ranking/all`, `/${locale}/ranking/group`, `/${locale}/study`, `/${locale}/ai-tutor`].includes(pathname) ||
      (pathname.startsWith(`/${locale}/ai-tutor`) && pathname.split('/').length === 4)
    ) {
      if (audioNight.current) audioNight.current.pause();
      if (audioMain.current.paused) audioMain.current.play();
    // store, room 페이지 그룹에 있을 때 Night BGM 시작
    } else if (
      [`/${locale}/store`, `/${locale}/room`].includes(pathname)
    ) {
      if (audioMain.current) audioMain.current.pause();
      if (audioNight.current.paused) audioNight.current.play();
    // 그 외 경로에 있다면 BGM 제거
    } else {
      if (audioMain.current) {
        audioMain.current.pause();
        audioMain.current.currentTime = 0; // 초기화
      }
      if (audioNight.current) {
        audioNight.current.pause();
        audioNight.current.currentTime = 0; // 초기화
      }
    }

    const timer = setTimeout(() => {
      setLoading(false); // 로딩 상태를 1.5초 후에 false로 변경
    }, 1500);

    // 페이지가 바뀔 때 기존의 BGM이 재생 중이면 그대로 유지
    return () => {
      clearTimeout(timer); // 페이지가 바뀔 때 타이머를 정리
      // Main BGM 그룹에 있을 때 (BGM이 이미 재생 중이면 그대로 유지)
      if (
        !([`/${locale}/main`, `/${locale}/profile`, `/${locale}/profile/setting`, `/${locale}/ranking/all`, `/${locale}/ranking/group`, `/${locale}/study`, `/${locale}/ai-tutor`].includes(pathname) ||
        (pathname.startsWith(`/${locale}/ai-tutor`) && pathname.split('/').length === 4))  // ai-tutor/[people]까지
      ) {
        if (audioMain.current) {
          audioMain.current.pause();
          audioMain.current.currentTime = 0; // 초기화
        }
      }

      // Night BGM 그룹에 있을 때 (BGM이 이미 재생 중이면 그대로 유지)
      if (
        !([`/${locale}/store`, `/${locale}/room`].includes(pathname))
      ) {
        if (audioNight.current) {
          audioNight.current.pause();
          audioNight.current.currentTime = 0; // 초기화
        }
      }
    };
  }, [pathname]);

  return (
    <html lang={locale}>
      <head />
      <body>
        <ReduxProvider>
          <AuthWrapper locale={locale}>
            {loading && <LoadingComponent />} {/* 로딩 중일 때 표시 */}
            {!loading && children} {/* 로딩이 끝나면 실제 페이지 컨텐츠 표시 */}
            {modal}
          </AuthWrapper>
        </ReduxProvider>
        <div id="modal-root" />
      </body>
    </html>
  );
}
