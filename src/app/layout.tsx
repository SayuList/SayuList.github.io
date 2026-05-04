import type { Metadata, Viewport } from "next";
import "./../styles/globals.css";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import LayoutWrapper from "@/components/LayoutWrapper";

export const metadata: Metadata = {
  title: {
    default: 'SayuList',
    template: '%s | SayuList',
  },
  description: "伊達さゆりさんの活動を記録する非公式ファンサイトです。",
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <LayoutWrapper>
          <main className="main-content">
            {children}
            <Footer />
          </main>
        </LayoutWrapper>
      </body>
    </html>
  );
}
