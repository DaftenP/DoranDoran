"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";

export default function AuthWrapper({ children, locale }) {
  const router = useRouter();
  const pathname = usePathname();
  // Redux 스토어에서 로그인 상태와 토큰을 가져옵니다.
  const { isLoggedIn, accessToken } = useSelector((state) => state.auth);

  useEffect(() => {
    // 보호된 경로 목록을 정의합니다.
    const protectedPaths = ["/main", "/ai-tutor", "/profile", "/ranking", "/room", "/store", "/study"];

    // 현재 경로가 보호된 경로인지 확인합니다.
    const isProtectedPath = protectedPaths.some((path) => 
      pathname.startsWith(`/${locale}${path}`)
    );

    // 보호된 경로이면서 로그인하지 않은 경우, 홈페이지로 리다이렉트합니다.
    if (isProtectedPath && !isLoggedIn) {
      router.replace(`/${locale}/`);
    }
  }, [pathname, router, isLoggedIn, locale]);

  // 자식 컴포넌트를 렌더링합니다.
  return <>{children}</>;
}