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


export const jsonData = {
  "_id": "65af6ebdf5cdb60fc506c590",
  "userId": {
      "_id": "65b646dade16088a25a41d68",
      "email": "khainhse161766@fpt.edu.vn",
      "fullName": "Nguyễn Huy Khải",
      "profileName": "",
      "profile_image": "https://firebasestorage.googleapis.com/v0/b/nha-trang-ntne.appspot.com/o/Unicourse%20Project%2Fuser5.jpg?alt=media&token=cfaa77cb-0586-4271-84ad-3ecd9a4f4dd4"
  },
  "title": "Các nguồn tài nguyên hữu ích cho 1 front-end developer",
  "description": "Bài viết này sẽ chia sẽ cho các bạn về vài nguồn tài nguyên mình biết, giúp các bạn code Front-end xịn xò hơn",
  "min_read": 10,
  "images": [
      "https://firebasestorage.googleapis.com/v0/b/nha-trang-ntne.appspot.com/o/Unicourse%20Project%2Fblog1.jpg?alt=media&token=b51fb488-5c45-45f5-bb91-28556378c25d"
  ],
  "date_published": "2024-01-23T00:00:00.000Z",
  "date_modified": "2024-01-23T00:00:00.000Z",
  "comment_obj": [],
  "thumbnail_url": "https://firebasestorage.googleapis.com/v0/b/nha-trang-ntne.appspot.com/o/Unicourse%20Project%2Fblog1.jpg?alt=media&token=b51fb488-5c45-45f5-bb91-28556378c25d",
  "content": "<p style='text-align: justify;'><span style='font-size: 12pt;'><strong>Các nguồn tài nguyên hữu ích cho 1 front-end developer</strong></span></p><h3 style='box-sizing: inherit; font-weight: 600; color: rgb(41, 41, 41); font-family: system-ui, &quot;Segoe UI&quot;, Roboto, Helvetica, Arial, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;; text-align: justify;'><span style='font-size: 10pt;'>1. Trình soạn thảo code</span></h3><p style='text-align: justify;'><span style='font-size: 10pt;'>Visual studio code: là 1 trình soạn thảo code được nhiều người sử dụng nhất hiện nay với khả năng code được nhiều ngôn ngữ và rất nhiều extension hổ trợ cho việc code</span></p><h3 style='box-sizing: inherit; font-weight: 600; color: rgb(41, 41, 41); font-family: system-ui, &quot;Segoe UI&quot;, Roboto, Helvetica, Arial, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;; text-align: justify;'><span style='font-size: 10pt;'>2. Nguồn học HTML, CSS, JS,...</span></h3><ul><li style='box-sizing: inherit; font-weight: 600; color: rgb(41, 41, 41); font-family: system-ui, &quot;segoe ui&quot;, roboto, helvetica, arial, sans-serif, &quot;apple color emoji&quot;, &quot;segoe ui emoji&quot;, &quot;segoe ui symbol&quot;; text-align: justify;'><span style='font-size: 10pt;'>W3School</span><span style='font-size: 10pt;'><br></span></li></ul><p style='text-align: justify;'><span style='font-size: 10pt;'>W3School: là 1 trang web học code miễn phí đang tin cậy với nhiều bài giảng chất lượng có đầy đủ cả lý thuyết lận thực hành với nhiều bài code mẫu ngay sau những kiến thức lý thuyết cực kỳ trực quan.</span></p><p style='text-align: justify;'><span style='font-size: 13.3333px;'><strong>Và 1 số trang web khác như:</strong></span></p><ul><li style='box-sizing: inherit; font-weight: 600; color: rgb(41, 41, 41); font-family: system-ui, &quot;segoe ui&quot;, roboto, helvetica, arial, sans-serif, &quot;apple color emoji&quot;, &quot;segoe ui emoji&quot;, &quot;segoe ui symbol&quot;; text-align: justify;'><span style='font-size: 10pt;'>CSS-Trick</span></li><li style='box-sizing: inherit; font-weight: 600; color: rgb(41, 41, 41); font-family: system-ui, &quot;segoe ui&quot;, roboto, helvetica, arial, sans-serif, &quot;apple color emoji&quot;, &quot;segoe ui emoji&quot;, &quot;segoe ui symbol&quot;; text-align: justify;'><span style='font-size: 10pt;'>Stack Overflow</span></li><li style='box-sizing: inherit; font-weight: 600; color: rgb(41, 41, 41); font-family: system-ui, &quot;segoe ui&quot;, roboto, helvetica, arial, sans-serif, &quot;apple color emoji&quot;, &quot;segoe ui emoji&quot;, &quot;segoe ui symbol&quot;; text-align: justify;'><span style='font-size: 10pt;'>F8</span></li></ul><h3 style='box-sizing: inherit; font-weight: 600; color: rgb(41, 41, 41); font-family: system-ui, &quot;Segoe UI&quot;, Roboto, Helvetica, Arial, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;; text-align: justify;'><span style='font-size: 10pt;'>3. Nguồn chứa các font chữ thường hay được sử dụng:</span></h3><ul><li style='box-sizing: inherit; font-weight: 600; color: rgb(41, 41, 41); font-family: system-ui, &quot;segoe ui&quot;, roboto, helvetica, arial, sans-serif, &quot;apple color emoji&quot;, &quot;segoe ui emoji&quot;, &quot;segoe ui symbol&quot;; text-align: justify;'><span style='font-size: 10pt;'>Google Font</span></li><li style='box-sizing: inherit; font-weight: 600; color: rgb(41, 41, 41); font-family: system-ui, &quot;segoe ui&quot;, roboto, helvetica, arial, sans-serif, &quot;apple color emoji&quot;, &quot;segoe ui emoji&quot;, &quot;segoe ui symbol&quot;; text-align: justify;'><span style='font-size: 10pt;'>Fontsquirrel</span></li><li style='box-sizing: inherit; font-weight: 600; color: rgb(41, 41, 41); font-family: system-ui, &quot;segoe ui&quot;, roboto, helvetica, arial, sans-serif, &quot;apple color emoji&quot;, &quot;segoe ui emoji&quot;, &quot;segoe ui symbol&quot;; text-align: justify;'><span style='font-size: 10pt;'>Myfont</span></li></ul>",
  "tags": [
      { "name": 'Front-end', "code": 'frontend', "color": '#ff4032' },
      { "name": 'UI/UX', "code": 'ui_ux', "color": '#007acc' }
  ],
  "status": "approved",
  "flag": true,
  "like": [
      "65b646dade16088a25a41d68",
      "65b741610a8fcd311bd6ea5a",
      "65b7458443a8e89d020860b6",
      "65bb71d34b2f3bdc08f30bca",
      "65bbb507ddd6b4ce31c7f940",
      "65bded46ccbed6413a0b128f",
      "65c87e4c3224a6e73cfcb36d",
      "65d300e7a70c4584733da448"
  ],
  "created_at": "2024-01-23T00:00:00.000Z",
  "updated_at": "2024-01-23T00:00:00.000Z"
};
