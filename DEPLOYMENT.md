# Hướng Dẫn Deploy Lên Cloudflare Pages

Dưới đây là các bước chi tiết để deploy dự án Next.js (App Router) lên Cloudflare Pages.

## 1. Chuẩn Bị

Đảm bảo project của bạn đã có:
- File `package.json` có script `"pages:build": "npx @cloudflare/next-on-pages"`.
- Đã cài đặt dependency: `npm install -D @cloudflare/next-on-pages` (Đã tương thích hoàn toàn).
- Đã push code mới nhất lên GitHub.

## 2. Cấu Hình Trên Cloudflare Pages

1.  Truy cập [Cloudflare Dashboard](https://dash.cloudflare.com/) > **Workers & Pages** > **Create Application** > **Pages** > **Connect to Git**.
2.  Chọn repository của bạn (`tan-dai-phat`).
3.  Tại phần **Build settings**, cấu hình như sau:
    *   **Framework preset**: chọn **Next.js**.
    *   **Build command**: nhập `npm run pages:build` (hoặc `npx @cloudflare/next-on-pages`).
    *   **Build output directory**: nhập `.vercel/output/static` (QUAN TRỌNG: Mặc định có thể là `.next`, hãy đổi thành `.vercel/output/static`).

## 3. Cấu Hình Biến Môi Trường (Environment Variables)

Trong phần **Environment variables** (tại bước setup hoặc vào Settings > Environment variables sau khi tạo):

Thêm các biến sau (lấy từ `.env.local` của bạn):

| Tên | Giá Trị (Ví dụ) |
| :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `your-anon-key` |
| `NODE_VERSION` | `20` (Khuyên dùng để tránh lỗi version cũ) |

## 4. Lưu Ý Quan Trọng

*   **Edge Runtime**: Các trang sử dụng Dynamic Rendering (như `/san-pham/[slug]`) bắt buộc phải chạy trên Edge Runtime. Tôi đã thêm cấu hình `export const runtime = 'edge';` cho trang này. Nếu bạn tạo thêm trang dynamic mới, hãy nhớ thêm dòng này.
*   **Database Access**: Vì chạy trên Edge, kết nối database trực tiếp (ví dụ: TCP Postgres) có thể gặp khó khăn hoặc độ trễ. Dự án này sử dụng Supabase qua HTTP (REST API) nên hoàn toàn tương thích và hoạt động tốt.

## 5. Khắc Phục Lỗi Common

*   **Lỗi "Failed to produce a Cloudflare Pages build"**: Thường do chưa cấu hình `runtime = 'edge'` cho dynamic routes hoặc sai Output Directory.
*   **Lỗi hình ảnh không hiện**: Đảm bảo domain chứa ảnh (Supabase Storage) được cấu hình trong `next.config.js` (đã làm) và biến môi trường chính xác.

Sau khi cấu hình, nhấn **Save and Deploy**. Quá trình build sẽ mất khoảng 1-2 phút.
