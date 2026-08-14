# Hướng dẫn đăng bài & quản lý nội dung

Website của bạn dựng bằng Astro. Toàn bộ nội dung là các **file Markdown (.md)** — không có
trang quản trị phức tạp, không database. Hiểu đúng 1 quy tắc là bạn tự làm được mọi thứ:

> **Mỗi bài viết = một file `.md` đặt trong đúng thư mục theo loại và ngôn ngữ.**

---

## 1. Bài viết nằm ở đâu

```
src/content/
├── field/          ← Field Notes (quan sát thế giới)
│   ├── vi/         ← bản tiếng Việt
│   └── en/         ← bản tiếng Anh
└── insight/        ← Insight Notes (quan sát bên trong)
    ├── vi/
    └── en/
```

- Bài Field tiếng Việt → đặt file trong `src/content/field/vi/`
- Bài Insight tiếng Anh → đặt file trong `src/content/insight/en/`
- **Tên file chính là đường dẫn (URL).** Ví dụ `di-bo-buoi-sang.md` → `/field-notes/di-bo-buoi-sang`.
  Nên đặt tên không dấu, không khoảng trắng, nối bằng dấu gạch ngang.

---

## 2. Đăng một bài mới

Tạo một file `.md` mới trong thư mục phù hợp, bắt đầu bằng phần "frontmatter" (thông tin bài)
nằm giữa hai dấu `---`, rồi viết nội dung bên dưới:

```markdown
---
title: "Tiêu đề bài viết"
date: 2026-08-15
summary: "Một câu tóm tắt ngắn. Nếu có dấu hai chấm : thì để trong ngoặc kép."
topics: [community, city]
tags: [conversation, danang]
connections: [ten-file-bai-lien-quan]
draft: false
---

Nội dung viết bằng **Markdown**. Có thể *in nghiêng*, **in đậm**,

> câu trích dẫn,

- gạch đầu dòng,
- và ## Tiêu đề phụ.
```

Giải thích các trường:

| Trường | Ý nghĩa | Bắt buộc |
|---|---|---|
| `title` | Tiêu đề bài | ✅ |
| `date` | Ngày đăng (YYYY-MM-DD) | ✅ |
| `summary` | Tóm tắt hiện ở thẻ bài & thẻ chia sẻ | nên có |
| `topics` | Vùng tư duy lớn — nên **dùng lại** các topic đã có | tuỳ chọn |
| `tags` | Hashtag cụ thể — **tối đa 3–5** cái | tuỳ chọn |
| `connections` | Tên file (không .md) của bài **cùng loại** muốn nối | tuỳ chọn |
| `draft` | `true` = bản nháp, chưa hiện; `false` = đăng | tuỳ chọn |

> `type` (Field/Insight) và `lang` (vi/en) **không cần khai báo** — hệ thống tự hiểu từ vị trí file.

**Bản song ngữ:** muốn bài có cả tiếng Anh, tạo file **trùng tên** trong thư mục `en/`
tương ứng. Hai file cùng tên → website tự hiện nút chuyển VI/EN.

---

## 3. Sửa hoặc xoá bài

- **Sửa:** mở file `.md`, sửa nội dung hoặc frontmatter, lưu lại.
- **Xoá:** xoá file `.md` đó đi.
- **Tạm ẩn:** đặt `draft: true` trong frontmatter (bài biến mất khỏi trang khi đăng lại).

Các trang **Chủ đề, Hashtag, Tìm kiếm và Constellation Map tự cập nhật** sau mỗi lần đăng —
bạn không phải sửa tay ở đâu khác.

---

## 4. Chèn ảnh & video

- **Ảnh:** bỏ ảnh (đã nén nhỏ, rộng ≤ 1600px) vào `public/images/`, rồi trong bài viết:
  `![mô tả ảnh](/images/ten-anh.jpg)`
- **Video:** đừng bỏ file video vào repo. Đổi đuôi file bài thành `.mdx` rồi nhúng YouTube:
  ```html
  <div class="embed">
    <iframe src="https://www.youtube.com/embed/MA_VIDEO" loading="lazy" allowfullscreen></iframe>
  </div>
  ```

---

## 5. Làm sao để bài lên sóng?

Đây là bước cần hoàn tất **một lần**: nối kho code trên **GitHub** với **Cloudflare Pages**.
Sau khi nối xong, quy trình đăng bài của bạn sẽ là:

1. Vào kho GitHub của bạn.
2. Tạo/sửa file `.md` ngay trên GitHub (nút **Add file → Create new file**, hoặc bấm ✏️ để sửa).
3. Bấm **Commit**.
4. Cloudflare tự build lại, khoảng **1 phút sau** website cập nhật. Xong.

Không cần cài gì trên máy, không cần Terminal — tất cả làm trên trình duyệt.

> **Trạng thái hiện tại:** website đã chạy tại `self-observatory.pages.dev` (mình đang deploy thủ
> công hộ bạn). Để bạn tự đăng như trên, còn 2 việc: (1) đưa code lên GitHub một lần, (2) nối
> Cloudflare vào kho đó. Mình sẽ hỗ trợ bạn làm nốt.

---

## 6. Muốn quản lý bằng giao diện dễ hơn? (tuỳ chọn, làm sau)

Nếu ngại sửa Markdown thô, sau này có thể gắn một **CMS miễn phí** (ví dụ Sveltia CMS / Pages
CMS) — cho bạn một trang quản trị dạng biểu mẫu: điền tiêu đề, nội dung, bấm Lưu, nó tự tạo file
và đăng. Giống viết bài trên một trang admin nhẹ. Khi nào bạn muốn, mình gắn thêm.
