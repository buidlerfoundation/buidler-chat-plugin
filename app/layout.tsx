import "./globals.scss";
import "pages/plugin/index.scss";
import "components/AppToastNotification/index.scss";
import { Inter } from "next/font/google";
import Providers from "providers";
import { ReduxProvider } from "store/ReduxProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Buidler chat plugin",
  description: "Buidler chat plugin",
};

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          <Providers>{children}</Providers>
        </ReduxProvider>
      </body>
    </html>
  );
}

export default RootLayout;
