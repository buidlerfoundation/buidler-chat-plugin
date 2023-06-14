import "./globals.scss";
import "page/plugin/index.scss";
import "components/AppToastNotification/index.scss";
import { Inter } from "next/font/google";
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
      </body>
    </html>
  );
}

export default RootLayout;
