# Self Observatory

Một *personal knowledge garden* song ngữ Việt–Anh, dựng bằng **Astro**.
Field Notes quan sát quan hệ với thế giới, Insight Notes quan sát quan hệ với chính mình,
và Constellation Map cho thấy chúng gặp nhau ở đâu.

Ngôn ngữ chính: **Tiếng Việt** (ở gốc `/`). Tiếng Anh ở tiền tố `/en/`.

---

## 1. Chạy thử trên máy

Cần cài [Node.js](https://nodejs.org) (bản 18 trở lên; project test trên Node 22).

```bash
npm install       # cài lần đầu
npm run dev       # mở http://localhost:4321
```

Xây bản production (kèm tạo chỉ mục tìm kiếm Pagefind):

```bash
npm run build     # kết quả nằm trong thư mục dist/
npm run preview   # xem thử bản build tại http://localhost:4321
```

> ⚠️ **Tìm kiếm** (trang /search) chỉ hoạt động sau `npm run build` hoặc `npm run preview`,
> **không** chạy trong `npm run dev` (vì chỉ mục Pagefind được tạo lúc build).

---

## 2. Cấu trúc thư mục

```
src/
├── consts.js            ← Cấu hình chung: tên miền, tiêu đề, link mạng xã hội
├── content.config.ts    ← Schema (kiểm tra) cho mỗi bài viết
├── content/             ← ★ TOÀN BỘ BÀI VIẾT nằm ở đây
│   ├── field/vi/ , field/en/
│   └── insight/vi/ , insight/en/
├── i18n/ui.ts           ← Chuỗi giao diện tiếng Việt / tiếng Anh
├── lib/                 ← Logic (đọc bài, dựng graph, URL) — thường không cần đụng
├── components/          ← Các khối giao diện
├── layouts/             ← Khung trang & khung bài viết
├── styles/global.css    ← ★ Toàn bộ giao diện (màu, font, nền tối)
└── pages/               ← Các đường dẫn của website
public/favicon.svg       ← Icon
```

Đa số thời gian bạn chỉ chạm vào **`src/content/`** (viết bài) và đôi khi **`src/consts.js`**.

---

## 3. Viết một bài mới

Tạo một file `.md` trong đúng thư mục theo **loại** và **ngôn ngữ**:

- Field Note tiếng Việt → `src/content/field/vi/ten-bai.md`
- Field Note tiếng Anh  → `src/content/field/en/ten-bai.md`
- Insight Note tiếng Việt → `src/content/insight/vi/ten-bai.md`
- Insight Note tiếng Anh  → `src/content/insight/en/ten-bai.md`

**Tên file = slug = URL.** Bản Việt và bản Anh của cùng một bài phải **đặt trùng tên file**
để hệ thống tự ghép và hiện nút chuyển VI/EN.

Đầu mỗi file là phần "frontmatter" (metadata) giữa hai dấu `---`:

```markdown
---
title: "Tiêu đề bài viết"
date: 2026-08-14
summary: "Một câu tóm tắt ngắn (nếu có dấu hai chấm : thì để trong ngoặc kép)."
topics: [community, city]          # vùng tư duy lớn — nên dùng lại các topic có sẵn
tags: [conversation, care, danang] # hashtag cụ thể — tối đa 3–5 cái
connections: [ten-slug-bai-lien-quan]  # nối tới bài CÙNG LOẠI, 1–3 cái
discuss: https://facebook.com/...  # (tuỳ chọn) link bài đăng MXH để thảo luận
draft: false                       # true = bản nháp, không xuất hiện khi build
---

Nội dung viết bằng **Markdown**. Có thể *in nghiêng*, **in đậm**,

> trích dẫn,

- danh sách,
- tiêu đề (## Tiêu đề phụ), v.v.
```

`lang` và `type` **không cần khai báo** — hệ thống tự suy ra từ vị trí file.

Topic/tag/trang tìm kiếm/graph **tự cập nhật** sau khi bạn build lại. Không cần sửa gì thêm.

---

## 4. Chèn ảnh & video (tối ưu dung lượng)

**Ảnh** — để nhẹ, đặt ảnh trong `src/assets/` và dùng cú pháp component ảnh của Astro
(tự nén AVIF/WebP, tự tạo nhiều kích thước). Ví dụ trong một file `.md`, cách đơn giản nhất:
để ảnh vào `public/images/` rồi chèn `![mô tả](/images/ten-anh.jpg)` — nhớ **nén ảnh trước**
(chiều rộng ≤ 1600px). Muốn tối ưu tự động mạnh hơn, đổi file bài thành `.mdx` và dùng
`<Image />` của `astro:assets` (mình có thể bật giúp bạn khi cần).

**Video** — **đừng** bỏ file video vào repo. Nhúng từ YouTube/Vimeo bằng khối:

```html
<div class="embed">
  <iframe src="https://www.youtube.com/embed/VIDEO_ID" title="..." loading="lazy"
    allowfullscreen></iframe>
</div>
```

(dùng được trong file `.mdx`). Khối `.embed` đã có sẵn CSS responsive.

---

## 5. Cấu hình link mạng xã hội & tên miền

Mở `src/consts.js`:

- `SITE.url` — đổi thành tên miền thật khi có (tạm để `*.pages.dev`).
- `SITE.social` — điền link Facebook / Threads / X / email. Để trống `''` thì nút/footer tự ẩn.
  Các link này dùng cho phần **Thảo luận** ở cuối mỗi bài và footer.

---

## 6. Đưa lên mạng (GitHub + Cloudflare Pages)

Website là **static** nên deploy rất nhẹ và miễn phí.

**Bước 1 — Đẩy code lên GitHub**
1. Tạo một repository mới (trống) trên GitHub.
2. Trong thư mục project:
   ```bash
   git init
   git add .
   git commit -m "Self Observatory - khởi tạo"
   git branch -M main
   git remote add origin https://github.com/<tên-bạn>/<tên-repo>.git
   git push -u origin main
   ```

**Bước 2 — Nối Cloudflare Pages**
1. Vào Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Chọn repo vừa tạo. Cấu hình build:
   - **Framework preset:** Astro
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
3. Bấm **Save and Deploy**. Sau ~1 phút bạn có website tại `https://<tên>.pages.dev`.

Từ đó, **mỗi lần bạn push lên GitHub** (kể cả sửa Markdown ngay trên GitHub web),
Cloudflare tự build lại và cập nhật website. Không cần làm gì thêm.

> Gói miễn phí của Cloudflare Pages: 500 lượt build/tháng, băng thông thoải mái — quá đủ.

---

## 7. Đã có gì / có thể làm tiếp

**Đã dựng sẵn:** cấu trúc Field/Insight, song ngữ VI–EN + nút chuyển, trang chủ, danh sách,
trang chủ đề & hashtag tự sinh, tìm kiếm (Pagefind), Constellation Map, nút thảo luận MXH,
RSS, sitemap, giao diện nền tối, 4 bài mẫu song ngữ.

**Có thể thêm sau:** font tiếng Việt tối ưu (subset), tối ưu ảnh `<Image>` tự động,
nút chia sẻ Zalo, chế độ sáng/tối, phân trang khi bài nhiều, mini-constellation ở trang chủ.

Cứ nhắn nếu bạn muốn bật thêm phần nào.
