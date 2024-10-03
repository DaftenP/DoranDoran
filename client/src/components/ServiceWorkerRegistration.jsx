"use client";
import { useEffect } from "react";

export function ServiceWorkerRegistration() {
  useEffect(() => {
    // 현재 브라우저가 서비스 워커를 지원하고, 환경이 프로덕션일 경우 실행
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      // 윈도우가 로드된 후 서비스 워커 등록 시도
      window.addEventListener("load", function () {
        navigator.serviceWorker.register("./sw.js").then(
          function (registration) {
            // 서비스 워커가 성공적으로 등록된 경우, scope 정보 출력
            console.log(
              "Service Worker registration successful with scope: ",
              registration.scope
            );
          },
          function (err) {
            // 서비스 워커 등록이 실패한 경우, 에러 정보 출력
            console.log("Service Worker registration failed: ", err);
          }
        );
      });
    }
  }, []);

  // 렌더링할 UI가 없으므로 null 반환
  return null;
}
