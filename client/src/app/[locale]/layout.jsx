import "./globals.css";
import AuthWrapper from "./AuthWrapper";
import { ReduxProvider } from "./providers";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";

export const metadata = {
  title: "Doran",
  description: "Generated by create next app",
  manifest: "/manifest.json",
};

export default function RootLayout({ children, modal, params }) {
  const { locale } = params;
  return (
    <html lang={locale}>
      <head />
      <body>
        <ReduxProvider>
          <AuthWrapper locale={locale}>
            {children}
            {modal}
          </AuthWrapper>
        </ReduxProvider>
        <div id="modal-root" />
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}