# Học Tập Vui

App Android giúp các con luyện Toán và Tiếng Anh (lớp 3, lớp 7). Đề do AI Gemini soạn theo từng chương của sách Kết nối tri thức (Toán) và Global Success (Tiếng Anh). Làm bài được thưởng xu để mua đồ cho nhân vật chibi và thú cưng.

## Cài app

Trên điện thoại Android, mở link sau rồi cài file APK. Lần đầu, Android sẽ hỏi có cho phép cài app từ trình duyệt không; bấm **Cho phép**.

https://github.com/phihung9t1video/hoc-tap-vui/releases/latest/download/hoc-tap-vui.apk

Mở app lần đầu, bố mẹ dán **khóa Gemini**. Khóa chỉ lưu trên máy đó. Lấy khóa miễn phí tại https://aistudio.google.com/apikey. **Không bật thanh toán** cho dự án chứa khóa để luôn miễn phí.

## Tự cập nhật

- **Giao diện, câu hỏi, đồ mới:** khi có mạng, app tự tải bản mới. Bản mới được áp dụng khi mở lại app, hoặc khi bấm "Cập nhật ngay".
- **Phần lõi Android** (hiếm khi thay đổi): app hiện nút "Tải về". Android bắt buộc người dùng bấm "Cài đặt" một lần.

## Kho câu hỏi chung (Supabase)

Câu AI đã soạn được lưu lên kho chung theo lớp, môn và chương. Máy khác học cùng chương sẽ dùng lại ngay, không phải soạn lại. Câu bị báo sai đề 2 lần sẽ bị ẩn.

Cài đặt một lần:
1. Tạo dự án miễn phí tại https://supabase.com (có thể đăng nhập bằng GitHub).
2. Vào **SQL Editor**, dán toàn bộ file `supabase/schema.sql`, rồi bấm **Run**.
3. Vào **Project Settings → API**, lấy **Project URL** và khóa **anon public**.
4. Trên GitHub, vào repo → **Settings → Secrets and variables → Actions → Variables** và thêm `SUPABASE_URL`, `SUPABASE_ANON_KEY`. Hai giá trị này được phép công khai: khóa anon chỉ đọc và thêm được câu hỏi, không sửa hay xóa được.

Chưa cài Supabase thì app vẫn chạy; câu hỏi chỉ lưu trên từng máy.

## Phát hành bản mới (dành cho người phát triển)

1. Sửa code, rồi đổi `notes` trong `release.json`.
2. Gắn tag phiên bản rồi đẩy lên GitHub: `git tag v1.0.1 && git push --tags`.
3. GitHub Actions tự build APK có ký và bản cập nhật giao diện, rồi tạo Release. Các máy đã cài sẽ tự cập nhật.
4. Nếu bản mới có thêm plugin Android hoặc sửa thư mục `android/`, tăng `minNativeCode` trong `release.json` lên bằng mã của phiên bản đó. Mã được tính là major×10000 + minor×100 + patch; ví dụ 1.2.0 thành 10200. Khi đó app sẽ yêu cầu cài APK mới.

**Khóa ký APK** nằm ở `android-keys/` và không được đưa lên GitHub. Hãy sao lưu thư mục này. Nếu mất khóa, các máy đã cài sẽ không cập nhật APK được nữa. GitHub dùng bản sao của khóa lưu trong Secrets (`KEYSTORE_BASE64`, `KEYSTORE_PASSWORD`).

## Cấu trúc code

- `lib/curriculum.ts`: mục lục các chương.
- `lib/gemini.ts`: gọi Gemini để soạn đề và tự kiểm tra lại đáp án.
- `lib/cloud.ts`, `supabase/schema.sql`: kho câu hỏi chung.
- `lib/updater.ts`, `.github/workflows/release.yml`: tự cập nhật qua GitHub Releases.
- `lib/items.tsx`, `lib/pets.tsx`, `lib/draw.tsx`: đồ cho nhân vật và thú cưng (hình vẽ SVG).
- `lib/rewards.ts`, `lib/achievements.ts`: xu, rương quà, thành tích.
- `components/`: các màn hình.

Chạy thử trên máy tính: `npm run dev`. Build và đồng bộ sang Android: `npm run android`.
