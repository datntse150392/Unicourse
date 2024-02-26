export interface Blog {
  _id: String;
  title: String;
  description: String;
  min_read: Number;
  images: Array<String>;
  date_modified: Date;
  thumbnail_url: String;
  comment_obj: Array<any>;
  content: String;
  tags: Array<Tag>;
  status: String;
  flag: Boolean;
  date_published: Date;
  userId: UserBlog;
  created_at: Date;
  updated_at: Date;
}

export interface UserBlog {
  _id: String,
  email: String,
  fullName: String,
  profileName: String,
  profile_image: String
}

export interface Tag {
  name: String;
  code: String;
  color: String;
}

export const Tags = [
  { name: "Front-end", code: "frontend", color: "#ff4032" },
  { name: "Back-end", code: "backend", color: "#32a852" },
  { name: "JavaScript", code: "javascript", color: "#f0db4f" },
  { name: "UI/UX", code: "ui_ux", color: "#007acc" },
  { name: "AI", code: "ai", color: "#ff9900" },
  { name: "Thủ thuật", code: "thu_thuat", color: "#888888" },
  { name: "Tâm sự", code: "tam_su", color: "#ff69b4" },
  { name: "Kinh nghiệm", code: "kinh_nghiem", color: "#008080" },
  { name: "Hỏi đáp", code: "hoi_dap", color: "#cc7a00" },
  { name: "Cơ bản", code: "co_ban", color: "#336699" },
  { name: "Mobile", code: "mobile", color: "#3c3c3c" },
  { name: "Game", code: "game", color: "#9900cc" },
  { name: "Web", code: "web", color: "#4CAF50" },
  { name: "Thông tin", code: "thong_tin", color: "#607d8b" },
  { name: "Thuật toán", code: "thuat_toan", color: "#CCCCCC" },
  { name: "Chọn nhãn dán", code: "none", color: "#CCCCCC" }
];
