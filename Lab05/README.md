# Lab05 - Kết nối Frontend ReactJS với Backend Movie Reviews

## 1. Thông tin sinh viên

| Họ tên | MSSV | Lớp |
| :--- | :--- | :--- |
| **Hồ Vương Tường Vy** | **23521827** | **IE213.Q21** |

## 2. Thông tin môn học

- Môn học: **IE213.Q21 - Kỹ thuật phát triển hệ thống web**

## 3. Nội dung bài thực hành

Lab05 kế thừa source code Movie Reviews từ Lab04 và hoàn thiện phần frontend theo yêu cầu trong hai file PDF `BT5.1.2.pdf` và `HDBT5.2.2.pdf`.

Nội dung chính:

- cài đặt và sử dụng `axios` để frontend gọi API backend
- tạo lớp dịch vụ `MovieDataService` trong `src/services/movies.js`
- xây dựng các lời gọi `getAll()`, `get(id)`, `find()`, `createReview()`, `updateReview()`, `deleteReview()`, `getRatings()`
- xây dựng `MoviesList` với `useState()` và `useEffect()` để lấy danh sách phim và danh sách rating
- tạo form tìm kiếm theo `title` và lọc theo `rated`
- hiển thị danh sách phim bằng `Card` của `react-bootstrap`
- xây dựng trang chi tiết phim khi nhấn vào nút xem chi tiết/review
- hiển thị danh sách review tương ứng với từng phim
- dùng `momentjs` để định dạng ngày review
- giữ chức năng đăng nhập giả lập, thêm review, sửa review và xóa review từ Lab04

## 4. Cấu trúc thư mục chính

```text
Lab05/
├── BT5.1.2.pdf
├── HDBT5.2.2.pdf
├── README.md
└── movie-reviews/
    ├── backend/
    │   ├── api/
    │   │   ├── movies.controller.js
    │   │   ├── movies.route.js
    │   │   └── reviews.controller.js
    │   ├── dao/
    │   │   ├── moviesDAO.js
    │   │   └── reviewsDAO.js
    │   ├── .env.example
    │   ├── index.js
    │   ├── package.json
    │   └── server.js
    └── frontend/
        ├── public/
        │   └── index.html
        ├── src/
        │   ├── components/
        │   │   ├── add-review.js
        │   │   ├── login.js
        │   │   ├── movie.js
        │   │   └── movies-list.js
        │   ├── services/
        │   │   └── movies.js
        │   ├── App.css
        │   ├── App.js
        │   ├── index.css
        │   └── index.js
        └── package.json
```

## 5. Cách chạy chương trình

### 5.1 Chạy backend

```bash
cd Lab05/movie-reviews/backend
npm install
cp .env.example .env
```

Cấu hình file `.env`:

```env
MOVIEREVIEWS_DB_URI=<mongodb-atlas-uri>
MOVIEREVIEWS_NS=sample_mflix
PORT=3000
```

Chạy backend:

```bash
npm run dev
```

Hoặc:

```bash
npm start
```

### 5.2 Chạy frontend

```bash
cd Lab05/movie-reviews/frontend
npm install
PORT=3001 npm start
```

Frontend dùng proxy trong `package.json` để gọi backend tại `http://localhost:3000`.

### 5.3 Kiểm tra nhanh

- Frontend: `http://localhost:3001`
- API movies: `http://localhost:3000/api/v1/movies`
- API ratings: `http://localhost:3000/api/v1/movies/ratings`
- API movie detail: `http://localhost:3000/api/v1/movies/id/<movie_id>`

## 6. Chi tiết thực hiện

## Bài 1: Kết nối tới Backend

### 1.1 Cài đặt package `axios`

Thực hiện:

```bash
cd Lab05/movie-reviews/frontend
npm install axios moment
```

Kết quả:

- frontend có `axios` để gọi API backend
- frontend có `moment` để định dạng ngày review theo yêu cầu Lab05

### 1.2 Tạo lớp dịch vụ `MovieDataService`

File thực hiện: `movie-reviews/frontend/src/services/movies.js`

Các phương thức đã xây dựng:

- `getAll(page, moviesPerPage)`: lấy danh sách phim
- `get(id)`: lấy chi tiết phim theo id
- `find(query, by, page, moviesPerPage)`: tìm phim theo `title` hoặc `rated`
- `createReview(data)`: thêm review mới
- `updateReview(data)`: cập nhật review
- `deleteReview(id, userId)`: xóa review theo `review_id` và `user_id`
- `getRatings()`: lấy danh sách rating

Kết quả:

- các component frontend không gọi API trực tiếp mà thông qua service riêng
- service dùng chung base path `/api/v1/movies` và tận dụng proxy của React khi chạy development

## Bài 2: Xây dựng `MoviesList` Component

### 2.1 Khai báo state bằng `useState()`

File thực hiện: `movie-reviews/frontend/src/components/movies-list.js`

Các state chính:

- `movies`: danh sách phim đang hiển thị
- `ratings`: danh sách rating lấy từ backend
- `title`: giá trị ô tìm kiếm theo tên phim
- `rated`: rating đang chọn
- `activeFilters`: bộ lọc đang áp dụng
- `page` và `totalResults`: phục vụ phân trang
- `loading` và `error`: quản lý trạng thái giao diện

### 2.2 Lấy dữ liệu bằng `useEffect()`

Thực hiện:

- gọi `MovieDataService.getRatings()` khi component được render lần đầu
- gọi `MovieDataService.getAll()` hoặc `MovieDataService.find()` khi trang hoặc bộ lọc thay đổi

Kết quả:

- danh sách phim được tải tự động khi mở trang
- danh sách rating được lấy từ collection `movies` thông qua endpoint `/ratings`

### 2.3 Tạo search form

Thực hiện:

- tạo input tìm kiếm theo `title`
- tạo select lọc theo `rated`
- nút `Tìm title` áp dụng tìm kiếm theo tiêu đề
- nút `Tìm rating` áp dụng lọc theo rating
- nút `Xóa lọc` đưa giao diện về danh sách mặc định

Kết quả:

- người dùng có thể tìm phim theo tên
- người dùng có thể lọc phim theo rating như `G`, `PG`, `PG-13`, `R`, ...

### 2.4 Hiển thị danh sách phim bằng `Card`

Thực hiện:

- mỗi phim hiển thị poster, title, rating, runtime, year, plot ngắn và IMDb rating
- dùng `Card`, `Row`, `Col`, `Button` của `react-bootstrap`
- nút `Xem chi tiết` điều hướng đến `/movies/:id`

Kết quả:

- danh sách phim được trình bày dạng card responsive
- giao diện hoạt động tốt trên desktop và mobile

### 2.5 Hiện thực tìm theo Title và Rating

Thực hiện:

- nếu có `title`, gọi `MovieDataService.find(title, "title")`
- nếu chọn rating khác `All Ratings`, gọi `MovieDataService.find(rated, "rated")`
- nếu không có bộ lọc, gọi `MovieDataService.getAll()`

Kết quả:

- frontend gọi đúng endpoint backend đã xây dựng ở các lab trước
- dữ liệu trả về được cập nhật trực tiếp vào state `movies`

## Bài 3: Hiển thị trang chi tiết Movie

### 3.1 Xây dựng component `Movie`

File thực hiện: `movie-reviews/frontend/src/components/movie.js`

State chính:

- `movie`: lưu thông tin chi tiết phim gồm `_id`, `title`, `rated`, `poster`, `plot`, `reviews`, ...
- `loading`: trạng thái đang tải dữ liệu
- `error`: lỗi khi gọi API
- `busyReviewId`: review đang được xử lý khi xóa

### 3.2 Gọi service lấy chi tiết phim

Thực hiện:

- lấy `id` từ route `/movies/:id` bằng `useParams()`
- gọi `MovieDataService.get(id)`
- lưu dữ liệu trả về vào state `movie`

Kết quả:

- khi nhấn `Xem chi tiết`, frontend hiển thị đúng thông tin phim được lấy từ backend

### 3.3 Trang trí giao diện chi tiết phim

Thực hiện:

- hiển thị poster, title, plot, year, runtime, rated, IMDb rating
- hiển thị thông tin thể loại, quốc gia, ngày phát hành và diễn viên
- có nút quay lại danh sách phim
- nếu đã đăng nhập, hiển thị nút thêm review
- nếu chưa đăng nhập, hiển thị nút đăng nhập để review

Kết quả:

- trang chi tiết phim rõ ràng và có đầy đủ đường dẫn thao tác review

## Bài 4: Hiển thị danh sách review cho từng phim

### 4.1 Hiển thị review bên dưới phần nội dung phim

Thực hiện:

- đọc mảng `movie.reviews` từ API chi tiết phim
- dùng `Card` để hiển thị từng review
- mỗi review gồm tên người viết, user id, ngày viết và nội dung review

Kết quả:

- các review liên quan đến phim được hiển thị ngay trong trang chi tiết

### 4.2 Thêm, sửa và xóa review

Thực hiện:

- component `add-review.js` gọi `MovieDataService.createReview()` để thêm review
- khi sửa review, component gọi `MovieDataService.updateReview()`
- khi xóa review, component `movie.js` gọi `MovieDataService.deleteReview()`
- chỉ user có `id` trùng với `review.user_id` mới thấy nút sửa/xóa review của mình

Kết quả:

- thao tác CRUD review được kết nối từ frontend đến backend
- backend kiểm tra `user_id` khi cập nhật hoặc xóa review

### 4.3 Định dạng ngày review bằng `momentjs`

Thực hiện:

- import `moment` trong `movie.js`
- thiết lập locale tiếng Việt
- format ngày bằng `moment(review.date).format("Do MMMM YYYY")`

Kết quả:

- ngày review được hiển thị dễ đọc theo yêu cầu Lab05

## 7. Kết luận

Lab05 đã được hoàn thiện trong thư mục riêng `Lab05`, tách biệt với `Lab04`. Source code kế thừa backend/frontend từ Lab04 nhưng đã chỉnh lại frontend đúng trọng tâm Lab05: gọi backend bằng `axios`, dùng service `MovieDataService`, xây dựng danh sách phim, tìm kiếm/lọc phim, trang chi tiết phim, hiển thị review và định dạng ngày bằng `momentjs`.
