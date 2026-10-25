/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Xuất thành file tĩnh (thư mục out/) để đóng gói vào app Android
  output: "export",
  images: { unoptimized: true },
  // Bản thử nhanh trên PC dùng thư mục riêng, để chạy song song với build APK không bị xung đột
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // Bản web trên GitHub Pages chạy dưới đường dẫn con, ví dụ /hoc-tap-vui
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
};
export default nextConfig;
