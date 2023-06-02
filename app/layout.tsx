import "./globals.scss";
import "pages/home/index.scss";
import "components/AppToastNotification/index.scss";
import { Inter } from "next/font/google";
import AppToastNotification from "components/AppToastNotification";
import AuthProvider from "components/AuthProvider";
import { Providers } from "store/Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Buidler chat plugin",
  description: "Buidler chat plugin",
};

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <AuthProvider>{children}</AuthProvider>
        </Providers>
        <AppToastNotification />
      </body>
    </html>
  );
}

export default RootLayout;
