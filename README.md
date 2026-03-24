# 23521827-HoVuongTuongVy-IE213.Q21

## Thông tin sinh viên

| Họ tên | MSSV | Lớp |
| :-- | :-- | :-- |
| **Hồ Vương Tường Vy** | **23521827** | **IE213.Q21** |

## Thông tin môn học

- Môn học: **IE213 - Kỹ thuật phát triển hệ thống web**

## Giới thiệu

Repository này lưu trữ các bài thực hành môn **IE213**. Hiện tại repo đã bao gồm:

- **Lab01**: Thực hành CRUD với MongoDB Atlas, MongoDB Compass và mongosh
- **Lab02**: Thiết lập backend cho ứng dụng Movie Reviews bằng NodeJS, ExpressJS và MongoDB Atlas

## Danh sách lab

### 1. Lab01 - MongoDB CRUD Operation

Nội dung chính:

- tạo và kết nối MongoDB Atlas với MongoDB Compass
- thao tác CRUD trên collection `employees`
- tạo index unique
- truy vấn dữ liệu với các điều kiện cơ bản
- cập nhật dữ liệu bằng `$set`, `$unset`
- thống kê tổng tuổi và tuổi trung bình bằng aggregation

Thư mục:

- `Lab01/`

README chi tiết:

- `Lab01/README.md`

### 2. Lab02 - Thiết lập Backend với NodeJS/ExpressJS

Nội dung chính:

- cài đặt môi trường NodeJS cho backend
- khởi tạo project với `npm`
- cài đặt các thư viện `express`, `mongodb`, `cors`, `dotenv`, `nodemon`
- xây dựng backend theo mô hình `route / controller / dao`
- kết nối MongoDB Atlas
- triển khai API:
  - `GET /api/v1/movies`
  - phân trang với `page`, `moviesPerPage`
  - lọc theo `rated`
  - tìm kiếm theo `title`

Thư mục:

- `Lab02/`

README chi tiết:

- `Lab02/README.md`

## Cấu trúc thư mục

```text
23521827-HoVuongTuongVy-IE213.Q21/
├── README.md
├── Lab01/
│   └── README.md
└── Lab02/
    ├── README.md
    └── movie-reviews/
        └── backend/
```

## Cách sử dụng

### Lab01

Thực hiện trực tiếp trên MongoDB Atlas, Compass và mongosh theo hướng dẫn trong:

- `Lab01/README.md`

### Lab02

Di chuyển vào thư mục backend:

```bash
cd Lab02/movie-reviews/backend
```

Cài dependency:

```bash
npm install
```

Chạy server:

```bash
node index.js
```

Hoặc:

```bash
npx nodemon index.js
```

Endpoint kiểm tra:

- `http://localhost:3000/api/v1/movies`

## Ghi chú

- Lab01 tập trung vào thao tác dữ liệu trực tiếp trên MongoDB
- Lab02 tập trung vào xây dựng backend NodeJS/ExpressJS để cung cấp API cho ứng dụng Movie Reviews
- Mỗi lab đều có README riêng mô tả chi tiết các bước thực hiện và kết quả
