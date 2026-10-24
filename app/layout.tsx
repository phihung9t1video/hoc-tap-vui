import type { Metadata, Viewport } from "next";
import { Baloo_2 } from "next/font/google";
import "./globals.css";

const baloo = Baloo_2({ subsets: ["latin", "vietnamese"], weight: ["400", "600", "700", "800"], variable: "--font-baloo" });

export const metadata: Metadata = {
  title: "Học Tập Vui",
  description: "Luyện Toán, Tiếng Anh và phối đồ cho nhân vật của con",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#ff7a59" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={baloo.variable}>
      <body>{children}</body>
    </html>
  );
}
