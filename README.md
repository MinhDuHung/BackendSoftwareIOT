
# BackendSoftwareIOT

Đây là Repo Backend bằng nodejs express kết nối với mysql DB, Backend này có chức năng insert, select data từ bảng action và sensor trong DB

## Cài Đặt

1. **Clone Repository:**

   
    git clone https://github.com/MinhDuHung/BackendSoftwareIOT.git



2. **Cấu Hình Environment:**

    Tạo một tệp `.env` trong thư mục gốc của dự án và cung cấp các biến môi trường cần thiết (ví dụ: PORT, DATABASE_URL, SECRET_KEY, ...).

3. **Chạy Ứng Dụng:**


    npm start


## Cấu Trúc Thư Mục

![image](https://github.com/MinhDuHung/BackendSoftwareIOT/assets/117105080/4ff3fd39-7126-44d4-a5a7-fb75caf885fa)


## Các Dependencies Chính

- **Express:** Framework web cho Node.js.
- **Mongoose:** Thư viện để tương tác với MongoDB.
- **Body-parser:** Middleware để xử lý dữ liệu đầu vào từ request.

## Routes

    - sensorRoutes: đây là route dành cho sensor api bao gồm các phương thức getAllSensors, insertSensor, handleSortingAscDesc
    - actionRoutes: đây là route dành cho sensor api bao gồm các phương thức getAllActions, insertAction,handleSortingAscDesc, handleSortingChosenOne

## Các Api ví dụ

![alt text](image.png)


![alt text](image-1.png)


![alt text](image-2.png)


![alt text](image-3.png)


![alt text](image-4.png)


![alt text](image-5.png)


![alt text](image-6.png)

## Dữ liệu mẫu
   - action table: ![alt text](image-7.png)
   - sensor table: ![alt text](image-8.png)