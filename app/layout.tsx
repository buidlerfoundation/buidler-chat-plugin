import "./globals.scss";
import "pages/plugin/index.scss";
import "components/AppToastNotification/index.scss";
import { Inter } from "next/font/google";
import AppToastNotification from "components/AppToastNotification";
import Providers from "providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Buidler chat plugin",
  description: "Buidler chat plugin",
};

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
        <AppToastNotification />
      </body>
    </html>
  );
}

export default RootLayout;
