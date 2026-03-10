# 23521827-HoVuongTuongVy-IE213.Q21.2

## Danh sách lab
- **Lab 1** – CRUD với MongoDB (Atlas, Compass, Mongosh)

## Mô tả Lab 1
- Bài thực hành tập trung vào các thao tác CRUD (Create, Read, Update, Delete) trên MongoDB.
- Mục tiêu: thiết lập môi trường DB trên đám mây, kết nối công cụ quản lý, luyện tập thêm/tìm/cập nhật/xóa và thống kê đơn giản (tổng, trung bình) trên document.

## Cách chạy
1) **Chuẩn bị môi trường**
   - Tạo cluster miễn phí trên MongoDB Atlas.
   - Nạp sample data và cài MongoDB Compass.
   - Dùng connection string để kết nối Compass với cluster Atlas.

2) **Dùng dòng lệnh**
   - Mở `mongosh` trong Compass (hoặc Mongo Shell) để nhập lệnh.
   - Lưu ý: không dùng UI để thêm dữ liệu; thao tác qua dòng lệnh.

3) **Thực thi lệnh**
   - Tạo database tên `MSSV-IE213` và collection `employees`.
   - Thao tác dữ liệu: `insertMany`, `find`, `updateMany`, `deleteMany`, và các phép thống kê cần thiết.

## Kết quả
![Kết quả Lab 1](image.png)
