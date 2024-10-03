import "./globals.css";
import AuthWrapper from "./AuthWrapper";
import { ReduxProvider } from "./providers";

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
      </body>
    </html>
  );
}
