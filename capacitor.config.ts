import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "io.github.phihung9t1video.hoctapvui",
  appName: "Học Tập Vui",
  webDir: "out",
  android: {
    backgroundColor: "#fff8ef",
  },
  plugins: {
    // Gọi mạng bằng phần lõi Android: tránh lỗi CORS khi tải file từ GitHub, Gemini
    CapacitorHttp: { enabled: true },
    CapacitorUpdater: {
      // Tự quản lý cập nhật qua GitHub Releases (lib/updater.ts), không dùng máy chủ Capgo
      autoUpdate: false,
      statsUrl: "",
      updateUrl: "",
      channelUrl: "",
      appReadyTimeout: 15000,
    },
  },
};

export default config;
