// Site-wide configuration. Edit these values freely.
export const SITE = {
  // Đổi thành domain thật khi bạn có. Tạm dùng *.pages.dev của Cloudflare.
  url: 'https://self-observatory.pages.dev',
  title: 'Self Observatory',
  // Mô tả ngắn theo từng ngôn ngữ
  description: {
    vi: 'Một khu vườn tri thức cá nhân — quan sát quan hệ với thế giới và với chính mình.',
    en: 'A personal knowledge garden — observing our relationship with the world and with ourselves.',
  },
  author: 'Huu Huy',
  // Disqus shortname (tên site trên Disqus). Để trống '' thì phần bình luận tự ẩn.
  disqusShortname: 'self-observatory',
  // Link mạng xã hội hiện ở footer + dùng cho nút "Thảo luận".
  // Để trống ('') nếu chưa có; nút sẽ tự ẩn.
  social: {
    facebook: '',
    threads: '',
    x: '',
    email: 'huyhoanghohuu92@gmail.com',
  },
};

export const LOCALES = ['vi', 'en'];
export const DEFAULT_LOCALE = 'vi';
