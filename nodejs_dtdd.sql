-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th5 29, 2022 lúc 04:53 PM
-- Phiên bản máy phục vụ: 10.4.22-MariaDB
-- Phiên bản PHP: 8.1.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `nodejs_dtdd`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tblchitiethoadon`
--

CREATE TABLE `tblchitiethoadon` (
  `ChiTietMaHD` int(11) NOT NULL,
  `MaDT` int(11) NOT NULL,
  `SoLuong` int(11) NOT NULL,
  `TongTien` float NOT NULL,
  `CodeHD` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `tblchitiethoadon`
--

INSERT INTO `tblchitiethoadon` (`ChiTietMaHD`, `MaDT`, `SoLuong`, `TongTien`, `CodeHD`) VALUES
(18, 26, 1, 25, 10),
(19, 27, 1, 15, 10),
(21, 25, 1, 14, 51),
(22, 25, 11, 154, 25),
(23, 26, 11, 275, 25),
(24, 24, 11, 264, 25),
(25, 27, 11, 165, 25),
(26, 28, 11, 33, 25),
(27, 29, 11, 44, 25),
(28, 30, 11, 49.5, 25),
(29, 24, 2, 48, 10),
(30, 25, 1, 14, 25),
(31, 26, 6, 150, 25),
(32, 26, 1, 24, 10),
(33, 27, 1, 15, 10),
(35, 27, 1, 15, 10),
(36, 24, 1, 24, 10),
(37, 31, 1, 24, 25),
(38, 24, 1, 24, 25),
(40, 24, 9, 216, 10),
(41, 34, 2, 48, 10),
(42, 34, 1, 10.5, 10),
(43, 34, 1, 10.5, 54),
(44, 32, 1, 38.6, 54),
(46, 32, 1, 38.6, 54),
(47, 33, 1, 30, 54),
(48, 34, 1, 10.5, 54),
(49, 31, 1, 17, 54),
(50, 25, 2, 28, 54),
(51, 26, 2, 50, 54),
(52, 27, 1, 15, 54),
(53, 28, 1, 3, 54),
(54, 29, 1, 4, 54),
(55, 30, 1, 4.5, 54),
(61, 33, 1, 30, 10),
(62, 34, 1, 10.5, 10),
(64, 25, 8, 112, 10);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tbldienthoai`
--

CREATE TABLE `tbldienthoai` (
  `MaDT` int(11) NOT NULL,
  `TenDT` varchar(100) NOT NULL,
  `MaHSX` int(11) NOT NULL,
  `SoLuong` int(11) NOT NULL,
  `GiaBan` float NOT NULL,
  `Anh` varchar(100) DEFAULT NULL,
  `NgayDang` date NOT NULL DEFAULT current_timestamp(),
  `KiemDuyet` tinyint(4) NOT NULL,
  `MoTa` text NOT NULL,
  `TinhTrang` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `tbldienthoai`
--

INSERT INTO `tbldienthoai` (`MaDT`, `TenDT`, `MaHSX`, `SoLuong`, `GiaBan`, `Anh`, `NgayDang`, `KiemDuyet`, `MoTa`, `TinhTrang`) VALUES
(24, 'Iphone 13 Promax màu xanh', 4, 1000, 24, '1652364555003.png', '2022-05-12', 1, '6.7 inch, OLED, Super Retina XDR, 2778 x 1284 Pixels\r\n12.0 MP + 12.0 MP + 12.0 MP\r\n\r\n12.0 MP\r\n\r\nApple A15 Bionic\r\n\r\n128 GB', 'Điện thoại new 100% full box'),
(25, 'Oppo Reno 5 ', 5, 8, 14, '1652364600568.jpg', '2022-05-12', 1, 'AMOLED6.43\"Full HD+', 'Điện thoại new 100% fullbox có seal bảo hành 24 tháng'),
(26, 'Samsung galaxy ultra 21s Màu đen', 1, 977, 25, '1652364704184.jpg', '2022-05-12', 1, 'Dynamic AMOLED 2X6.8\"Quad HD+ (2K+)', 'full box mới 100% bảo hành 24 tháng'),
(27, 'Oppo reno 6 Đen 128gb', 5, 981, 15, '1652364840085.png', '2022-05-12', 1, 'AMOLED6.43\"Full HD+', 'đã qua sử dụng 99% còn bảo hành 14 tháng'),
(28, 'Iphone 6 cũ 32gb', 4, 988, 3, '1652365325897.jpg', '2022-05-12', 1, 'LED-backlit IPS LCD4.7\"Retina HD', 'Cũ fullbox bảo hành 3 tháng'),
(29, 'Iphone 7 64gb cũ', 4, 986, 4, '1652365474742.jpg', '2022-05-12', 1, ' màn hình Full HD tích hợp tấm nền IPS LCD', 'Cũ pin 89% bảo hành 3 tháng'),
(30, 'Iphone 8 64gb trắng quốc tế', 4, 988, 4.5, '1652369517149.jpg', '2022-05-12', 1, '0', 'Cũ fullbox bảo hàng 3 tháng pin 89%'),
(31, 'Iphone 12', 4, 998, 17, '1653669132962.png', '2022-05-27', 1, 'màng hình tràng viền và chip mạnh', 'New full box 100%'),
(32, 'Samsung Z Fold 3 256gb', 1, 998, 38.6, '1653831580584.webp', '2022-05-29', 1, 'Kích thước màn hình\r\nMàn hình chính : 7.6\" Dynamic AMOLED 2X\r\n(2208 x 1768)\r\nMàn hình ngoài : 6.2\" Dynamic AMOLED 2X\r\n(832 x 2268)', 'New full box full shield 100%'),
(33, 'Samsung Z Flip 256gb', 1, 998, 30, '1653831854709.png', '2022-05-29', 1, 'Camera góc siêu rộng: 12MP, f/2.2, Dual Pixel AF, OIS\r\nCamera góc rộng: 12MP, f/1.8', 'Mới có bảo hành chính hãng 36 tháng'),
(34, 'Oppo Reno7z 128gb', 5, 994, 10.5, '1653831998445.png', '2022-05-29', 1, 'Công nghệ màn hình:: AMOLED\r\nĐộ phân giải:: 2400 x 1080 FHD+, 60Hz\r\nMàn hình rộng:: 6.43\'\'\r\nHệ điều hành: ColorOS 12', 'Mới 100% bảo hành hãng 36 tháng');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tblgiohang`
--

CREATE TABLE `tblgiohang` (
  `ChiTietMaHD` int(11) NOT NULL,
  `MaDT` int(11) NOT NULL,
  `SoLuong` int(11) NOT NULL,
  `TongTien` float NOT NULL,
  `CodeHD` int(11) NOT NULL,
  `TrangThai` smallint(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tblhoadon`
--

CREATE TABLE `tblhoadon` (
  `MaHD` int(11) NOT NULL,
  `MaTaiKhoan` int(11) NOT NULL,
  `ThanhTien` float NOT NULL,
  `NgayBan` date NOT NULL DEFAULT current_timestamp(),
  `Duyet` tinyint(4) NOT NULL,
  `CodeHD` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `tblhoadon`
--

INSERT INTO `tblhoadon` (`MaHD`, `MaTaiKhoan`, `ThanhTien`, `NgayBan`, `Duyet`, `CodeHD`) VALUES
(96, 51, 14, '2022-05-14', 0, 51),
(97, 25, 240, '2022-05-14', 0, 25),
(98, 10, 0, '2022-05-16', 0, 10),
(99, 25, 240, '2022-05-27', 0, 25),
(107, 10, 0, '2022-05-27', 0, 10),
(108, 10, 0, '2022-05-28', 0, 10),
(109, 10, 0, '2022-05-28', 0, 10),
(110, 10, 0, '2022-05-28', 0, 10),
(111, 25, 240, '2022-05-28', 0, 25),
(112, 10, 0, '2022-05-28', 0, 10),
(118, 10, 0, '2022-05-29', 0, 10),
(119, 10, 0, '2022-05-29', 0, 10),
(120, 54, 200.6, '2022-05-29', 0, 54),
(121, 54, 200.6, '2022-05-29', 0, 54),
(122, 10, 0, '2022-05-29', 0, 10),
(123, 10, 0, '2022-05-29', 0, 10);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tblhsx`
--

CREATE TABLE `tblhsx` (
  `MaHSX` int(10) NOT NULL,
  `TenHSX` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `tblhsx`
--

INSERT INTO `tblhsx` (`MaHSX`, `TenHSX`) VALUES
(1, 'Samsung'),
(4, 'Iphone'),
(5, 'Oppo');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tbltaikhoan`
--

CREATE TABLE `tbltaikhoan` (
  `MaTaiKhoan` int(11) NOT NULL,
  `TenDangNhap` varchar(100) NOT NULL,
  `MatKhau` varchar(100) NOT NULL,
  `HoVaTen` varchar(100) NOT NULL,
  `SoDienThoai` int(10) NOT NULL,
  `DiaChi` text NOT NULL,
  `Email` varchar(100) NOT NULL,
  `HinhAnh` varchar(100) NOT NULL,
  `KichHoat` tinyint(4) NOT NULL DEFAULT 1,
  `MaHD` int(11) NOT NULL,
  `QuyenHan` varchar(5) NOT NULL DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `tbltaikhoan`
--

INSERT INTO `tbltaikhoan` (`MaTaiKhoan`, `TenDangNhap`, `MatKhau`, `HoVaTen`, `SoDienThoai`, `DiaChi`, `Email`, `HinhAnh`, `KichHoat`, `MaHD`, `QuyenHan`) VALUES
(10, 'admin1', '$2b$10$ZxXO3Khim2b7Xb0UAMHGw.Yivv1joFpkolK0y.PQLlo91LrmH4TGe', 'Vuong Truong Giang', 123456789, '123', 'vtgiang_20pm@student.agu.edu.vn', '1653830814926.JPG', 1, 0, 'admin'),
(54, 'test321', '$2b$10$AZ59tp5CeMIJpD66uUsfaeYTmQ.K9DhPoZ.k.IdXhZsghVFtVylG2', 'taikhoan user', 123456789, 'my phuong', '1@1', '1653835607412.jpg', 1, 0, 'user');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `tblchitiethoadon`
--
ALTER TABLE `tblchitiethoadon`
  ADD PRIMARY KEY (`ChiTietMaHD`);

--
-- Chỉ mục cho bảng `tbldienthoai`
--
ALTER TABLE `tbldienthoai`
  ADD PRIMARY KEY (`MaDT`);

--
-- Chỉ mục cho bảng `tblgiohang`
--
ALTER TABLE `tblgiohang`
  ADD PRIMARY KEY (`ChiTietMaHD`);

--
-- Chỉ mục cho bảng `tblhoadon`
--
ALTER TABLE `tblhoadon`
  ADD PRIMARY KEY (`MaHD`);

--
-- Chỉ mục cho bảng `tblhsx`
--
ALTER TABLE `tblhsx`
  ADD PRIMARY KEY (`MaHSX`);

--
-- Chỉ mục cho bảng `tbltaikhoan`
--
ALTER TABLE `tbltaikhoan`
  ADD PRIMARY KEY (`MaTaiKhoan`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `tblchitiethoadon`
--
ALTER TABLE `tblchitiethoadon`
  MODIFY `ChiTietMaHD` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT cho bảng `tbldienthoai`
--
ALTER TABLE `tbldienthoai`
  MODIFY `MaDT` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT cho bảng `tblgiohang`
--
ALTER TABLE `tblgiohang`
  MODIFY `ChiTietMaHD` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=186;

--
-- AUTO_INCREMENT cho bảng `tblhoadon`
--
ALTER TABLE `tblhoadon`
  MODIFY `MaHD` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=124;

--
-- AUTO_INCREMENT cho bảng `tblhsx`
--
ALTER TABLE `tblhsx`
  MODIFY `MaHSX` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT cho bảng `tbltaikhoan`
--
ALTER TABLE `tbltaikhoan`
  MODIFY `MaTaiKhoan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
