/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Xuất thành file tĩnh (thư mục out/) để đóng gói vào app Android
  output: "export",
  images: { unoptimized: true },
};
export default nextConfig;
