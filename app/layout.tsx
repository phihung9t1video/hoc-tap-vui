import type { Metadata, Viewport } from "next";
import { Baloo_2 } from "next/font/google";
import "./globals.css";

const baloo = Baloo_2({ subsets: ["latin", "vietnamese"], weight: ["400", "600", "700", "800"], variable: "--font-baloo" });

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: "Học Tập Vui",
  description: "Luyện Toán, Tiếng Anh và phối đồ cho nhân vật của con",
  // Bản web: thêm vào màn hình chính iPhone/iPad, mở toàn màn hình như app
  manifest: `${base}/manifest.webmanifest`,
  appleWebApp: { capable: true, title: "Học Tập Vui", statusBarStyle: "default" },
  icons: { icon: `${base}/icons/icon-192.png`, apple: `${base}/icons/icon-180.png` },
  // iPhone, iPad đời cũ cần thẻ này để mở toàn màn hình từ biểu tượng ngoài màn hình chính
  other: { "apple-mobile-web-app-capable": "yes" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#ff7a59" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={baloo.variable}>
      <body>{children}</body>
    </html>
  );
}
