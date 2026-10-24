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
4. Thêm 2 dòng vào file `.env.local`: `NEXT_PUBLIC_SUPABASE_URL=...` và `NEXT_PUBLIC_SUPABASE_ANON_KEY=...`, rồi phát hành bản mới. Khóa anon được phép công khai: nó chỉ đọc và thêm được câu hỏi, không sửa hay xóa được.

Chưa cài Supabase thì app vẫn chạy; câu hỏi chỉ lưu trên từng máy.

## Thử trước rồi mới phát hành (dành cho người phát triển)

Nhấp đúp các file trong thư mục gốc, theo thứ tự:

| File | Việc làm | Ai thấy |
|---|---|---|
| `1-THU-NHANH.bat` | Mở app trên trình duyệt (http://localhost:3000). Sửa code đến đâu thấy đến đó. | Chỉ PC này |
| `2-THU-ANDROID.bat` | Build APK thật, tự bật máy ảo Android (hoặc dùng điện thoại cắm cáp có bật USB debugging), cài và mở app. Bản thử **tắt tự cập nhật** để không bị bản trên GitHub đè lên. | Chỉ PC này |
| `3-PHAT-HANH-BAN-THU.bat` | Nhập số phiên bản mới (ví dụ 1.0.1) và ghi chú. Script tự kiểm tra code, build APK trên PC rồi tải lên GitHub Releases (2–3 phút). Bản này là **bản thử nghiệm**. | Chỉ máy bật "Nhận bản thử nghiệm" |
| `4-DUYET-PHAT-HANH.bat` | Thử trên điện thoại bố mẹ thấy ổn thì duyệt (gõ `CO` để xác nhận). | Tất cả máy các con |

**Điện thoại của bố mẹ:** vào ⚙️ Cài đặt → bật **Nhận bản thử nghiệm**. Máy các con để tắt (mặc định).

**Khi có thay đổi phần lõi Android** (thêm plugin, sửa thư mục `android/`): trước bước 3, tăng `minNativeCode` trong `release.json` lên bằng mã của phiên bản mới. Mã tính theo công thức major×10000 + minor×100 + patch; ví dụ 1.2.0 thành 10200. Khi đó app sẽ yêu cầu cài APK mới.

**Khóa ký APK** nằm ở `android-keys/` và không được đưa lên GitHub. Hãy sao lưu thư mục này. Nếu mất khóa, các máy đã cài sẽ không cập nhật APK được nữa. GitHub dùng bản sao của khóa lưu trong Secrets (`KEYSTORE_BASE64`, `KEYSTORE_PASSWORD`).

## Cấu trúc code

- `lib/curriculum.ts`: mục lục các chương.
- `lib/gemini.ts`: gọi Gemini để soạn đề và tự kiểm tra lại đáp án.
- `lib/cloud.ts`, `supabase/schema.sql`: kho câu hỏi chung.
- `lib/updater.ts`, `tools/release-beta.ps1`: tự cập nhật qua GitHub Releases (APK được build trên PC rồi tải lên).
- `lib/items.tsx`, `lib/pets.tsx`, `lib/draw.tsx`: đồ cho nhân vật và thú cưng (hình vẽ SVG).
- `lib/rewards.ts`, `lib/achievements.ts`: xu, rương quà, thành tích.
- `components/`: các màn hình.

Chạy thử trên máy tính: `npm run dev`. Build và đồng bộ sang Android: `npm run android`.
