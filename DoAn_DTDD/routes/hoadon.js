var express = require('express');
var router = express.Router();
var conn = require('../connect');
var path = require('path');
var fs = require("fs");
var { check, validationResult } = require('express-validator');
var multer = require('multer');
var storageConfig = multer.diskStorage({
	destination: function(req, file, callback){
		callback(null, 'uploads/');
	},
	filename: function(req, file, callback){
		var timestamp = Date.now();
		callback(null, timestamp + path.extname(file.originalname));
	}
});
var upload = multer({storage: storageConfig});
// GET: Danh sách điện thoại
router.get('/', function(req, res){
	var sql = 'SELECT a.*,b.HoVaTen,b.SoDienThoai,b.Email,b.DiaChi from tblhoadon a,tbltaikhoan b where a.CodeHD = b.MaTaiKhoan order by NgayBan DESC';
	conn.query(sql, function(error, results){
		if(error) {
			req.session.error = error;
			res.redirect('/error');
		}
		else if(req.session.QuyenHan != 'admin'){
			req.session.error = 'Trang không tồn tại.';
			res.redirect('/error');
		} else {
			res.render('hoadon', {
				title: 'Danh sách hóa đơn',
				hoadon: results
			});
			//console.log(results);
		}
	});
});
// GET: Duyệt bài viết
router.get('/duyet/:id', function(req, res){
	var id = req.params.id;// duyệt hóa đơn rồi xóa điện thoại bên giỏ hàng
	var sql = 'UPDATE tblhoadon SET Duyet = 1 - Duyet WHERE MaHD = ?;\
	insert INTO tblchitiethoadon(MaDT, SoLuong,TongTien,CodeHD) Select b.MaDT, b.SoLuong,b.TongTien,b.CodeHD from tblhoadon a, tblgiohang b where a.CodeHD = b.CodeHD and a.MaHD=?; \
	DELETE from tblgiohang WHERE CodeHD = (Select b.CodeHD from tblhoadon a, tblgiohang b where a.CodeHD = b.CodeHD and a.MaHD=? GROUP BY CodeHD)';
	conn.query(sql, [id,id,id], function(error, results){
		if(error) {
			req.session.error = error;
			res.redirect('/error');
		} else {
			res.redirect('back');
		}
	});
});
router.get('/chitiet/:id', function(req, res){
	var id = req.params.id;// mã hóa đơn
	var sql = 'SELECT a.*, b.Anh,b.TenDT,b.GiaBan from tblgiohang a,tbldienthoai b WHERE CodeHD = (Select b.CodeHD from tblhoadon a, tblgiohang b\
		where a.CodeHD = b.CodeHD and a.MaHD=? GROUP BY CodeHD) and a.MaDT = b.MaDT;\
		 SELECT ThanhTien from tblhoadon where MaHD = ?';
	conn.query(sql, [id,id], function(error, results){
		if(error) {
			req.session.error = error;
			res.redirect('/error');
		} else {
			res.render('hoadon_chitiet', {
				title: 'Chi tiết hóa đơn',
				cthd: results[0],
				hd:results[1].shift()
			});
		}
	});
});
// GET: Xóa bài viết
router.get('/xoa/:id', function(req, res){
	var id = req.params.id;
	var nd = req.session.MaNguoiDung;
	var sql = 'DELETE FROM tblhoadon WHERE MaHD = ?;\
	DELETE FROM tblgiohang WHERE CodeHD=?';
	conn.query(sql, [id,nd], function(error, results){
		if(error) {
			req.session.error = error;
			res.redirect('/error');
		} else {
			res.redirect('back');
		}
	});
});
router.get('/lichsu/:id', function(req, res){
	var id = req.session.MaNguoiDung;
	var sql = 'SELECT b.MaDT,b.TenDT,b.MaHSX,b.GiaBan,b.Anh,b.MoTa,b.TinhTrang,a.TongTien,a.SoLuong,a.ChiTietMaHD from tblchitiethoadon a , tbldienthoai b where CodeHD = ? and a.MaDT = b.MaDT order by ChiTietMaHD DESC';
	conn.query(sql, [id], function(error, results){
		if(error) {
			req.session.error = error;
			res.redirect('/error');
		} else {
			res.render('hoadon_lichsu', {
				title: 'Lịch sử',
				lichsu:results
			});
		}
	});
});
module.exports = router;