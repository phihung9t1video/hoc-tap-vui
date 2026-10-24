import { Capacitor } from "@capacitor/core";

/** Phiên bản của bộ giao diện đang chạy (gắn lúc build) */
export const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION ?? "0.0.0";
const REPO = process.env.NEXT_PUBLIC_GITHUB_REPO ?? "phihung9t1video/hoc-tap-vui";
/** Bản build thử trên PC tắt tự cập nhật, để bản trên GitHub không đè lên code đang thử */
export const UPDATES_DISABLED = process.env.NEXT_PUBLIC_DISABLE_UPDATES === "1";

type Release = { draft?: boolean; assets?: { name: string; browser_download_url: string }[] };

/** File version.json đính kèm mỗi bản phát hành trên GitHub */
interface Manifest {
  version: string;
  /** versionCode của APK trong bản phát hành này */
  versionCode: number;
  /** Bộ giao diện mới cần APK tối thiểu bản này (khi có thay đổi phần lõi Android) */
  minNativeCode: number;
  web: string;
  apk: string;
}

export type UpdateState =
  | { kind: "none" }
  /** Đã tải xong bản giao diện mới, sẽ tự áp dụng lần mở app sau (hoặc bấm cập nhật ngay) */
  | { kind: "ready"; version: string; bundleId: string }
  /** Cần cài APK mới (Android bắt buộc người dùng bấm cài) */
  | { kind: "apk"; version: string; url: string };

function newer(a: string, b: string) {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < 3; i++) {
    if ((pa[i] ?? 0) !== (pb[i] ?? 0)) return (pa[i] ?? 0) > (pb[i] ?? 0);
  }
  return false;
}

/**
 * beta = true (máy của bố mẹ): nhận cả bản thử nghiệm (pre-release) để kiểm tra trước.
 * beta = false (máy các con): chỉ nhận bản đã được duyệt phát hành.
 */
export async function checkForUpdate(beta = false): Promise<UpdateState> {
  if (!Capacitor.isNativePlatform() || UPDATES_DISABLED) return { kind: "none" };
  const { CapacitorUpdater } = await import("@capgo/capacitor-updater");
  const { App } = await import("@capacitor/app");
  // Báo cho plugin biết bản đang chạy hoạt động tốt, nếu không plugin sẽ quay về bản trước
  await CapacitorUpdater.notifyAppReady();

  try {
    const rel = await fetch(`https://api.github.com/repos/${REPO}/releases${beta ? "?per_page=5" : "/latest"}`, {
      headers: { Accept: "application/vnd.github+json" },
      signal: AbortSignal.timeout(15000),
    });
    if (!rel.ok) return { kind: "none" };
    const body = (await rel.json()) as Release | Release[];
    const release = Array.isArray(body) ? body.find((r) => !r.draft) : body;
    if (!release) return { kind: "none" };
    const asset = (name: string) => release.assets?.find((a) => a.name === name)?.browser_download_url;
    const manifestUrl = asset("version.json");
    if (!manifestUrl) return { kind: "none" };
    const m = (await (await fetch(manifestUrl, { signal: AbortSignal.timeout(15000) })).json()) as Manifest;
    if (!newer(m.version, APP_VERSION)) return { kind: "none" };

    const nativeCode = Number((await App.getInfo()).build) || 0;
    if (nativeCode < m.minNativeCode) {
      const url = asset(m.apk);
      return url ? { kind: "apk", version: m.version, url } : { kind: "none" };
    }

    const { bundles } = await CapacitorUpdater.list();
    let bundle = bundles.find((b) => b.version === m.version && b.status !== "error");
    if (!bundle) {
      const url = asset(m.web);
      if (!url) return { kind: "none" };
      bundle = await CapacitorUpdater.download({ url, version: m.version });
    }
    // Tự áp dụng khi app được đóng hoặc chuyển sang nền
    await CapacitorUpdater.next({ id: bundle.id });
    return { kind: "ready", version: m.version, bundleId: bundle.id };
  } catch (e) {
    console.warn("[update]", e);
    return { kind: "none" };
  }
}

/** Áp dụng ngay bản giao diện mới đã tải (app tải lại trong 1–2 giây). */
export async function applyUpdateNow(bundleId: string) {
  const { CapacitorUpdater } = await import("@capgo/capacitor-updater");
  await CapacitorUpdater.set({ id: bundleId });
}

export async function openApkDownload(url: string) {
  const { Browser } = await import("@capacitor/browser");
  await Browser.open({ url });
}
