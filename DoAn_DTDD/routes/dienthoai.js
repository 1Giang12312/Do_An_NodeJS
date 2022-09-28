var express = require('express');
var router = express.Router();
var conn = require('../connect');
var path = require('path');
var fs = require("fs");
var { check, validationResult } = require('express-validator');
var multer = require('multer');
const { NULL } = require('mysql/lib/protocol/constants/types');
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
// GET: Đăng
router.get('/them', function(req, res){
	var sql = 'SELECT * FROM tblhsx ORDER BY TenHSX';
	conn.query(sql, function(error, results){
		if(error) {
			req.session.error = error;
			res.redirect('/error');
		}
		else if(req.session.QuyenHan != 'admin'){
			req.session.error = 'Trang không tồn tại.';
			res.redirect('/error');
		}
		 else {
			res.render('dienthoai_them', {
				title: 'đăng điện thoại',
				hsx: results
			});
		}
	});
});
// POST: Đăng
var validateForm = [
	check('MaHSX').notEmpty().withMessage('Hãng sản xuất không được bỏ trống'),
	check('SoLuong').notEmpty().withMessage('Số lượng không được bỏ trống.'),
	check('GiaBan').notEmpty().withMessage('Giá bán không được bỏ trống.')
];
router.post('/them',upload.single('Anh'), validateForm, function(req, res){
	var errors = validationResult(req);
	if(!errors.isEmpty()) {
		if(req.file) fs.unlink(req.file.path, function(err){});
		// Lấy lấy hsx hiển thị vào form thêm
		var sql = 'SELECT * FROM tblhsx ORDER BY TenHSX';
		conn.query(sql, function(error, results){
			if(error) {
				req.session.error = error;
				res.redirect('/error');
			} 
			else {
				res.render('dienthoai_them', {
					title: 'Đăng điện thoại',
					hsx: results,
					errors: errors.array()
				});
			}
		});
	} else {
		if(req.session.MaNguoiDung) {
			var fileName = '';
			if(req.file) fileName = req.file.filename;
			var data = {
				MaHSX: req.body.MaHSX,
				TenDT: req.body.TenDT,
				SoLuong: req.body.SoLuong,
				GiaBan: req.body.GiaBan,
				Anh: fileName,
				TinhTrang:req.body.TinhTrang,
				MoTa: req.body.MoTa
			};
			//console.log(fileName);
			var sql = 'INSERT INTO tbldienthoai SET ?';
			conn.query(sql, data, function(error, results){
				if(error) {
					req.session.error = error;
					res.redirect('/error');
					console.log(error);
				} else {
					req.session.success = 'Đã đăng thành công.';
					res.redirect('/dienthoai');
				}
			});
		} else {
			res.redirect('/dangnhap');
		}
	}
});
// GET: mua
router.get('/mua/:id', function(req, res){
	var id = req.params.id;
	var maid = req.session.MaNguoiDung;
	var sql = 'SELECT * FROM tbltaikhoan WHERE MaTaiKhoan = ?;\
				SELECT * FROM tbldienthoai WHERE MaDT =?';
	conn.query(sql,[maid,id], function(error, results){
		if(error) {
			req.session.error = error;
			res.redirect('/error');
		}
		else if(req.session.MaNguoiDung == null){
			res.render('dangnhap',{title:'Đăng nhập'});
		} else {
			if(req.session.MaNguoiDung) {
				res.render('dienthoai_mua', {
					title: 'mua',
					mua: results[0].shift(),
					dienthoai: results[1].shift()
				});
			} else {
				res.redirect('/dangnhap');
			}
		}
		
	});
});
// POST: mua

var vali = [
	check('SoLuong').notEmpty().withMessage('Số lượng không được bỏ trống.'),
	check('SoLuong').isLength({ max:1 }).withMessage('Số lượng không hợp lệ.'),
];
router.post('/mua/:id', vali, function(req, res){
	var errors = validationResult(req);
	var id = req.params.id;
	if(!errors.isEmpty()) {
	var maid = req.session.MaNguoiDung; // mã người dùng
	var sql = 'SELECT * FROM tbltaikhoan WHERE MaTaiKhoan = ?;\
				SELECT * FROM tbldienthoai WHERE MaDT =?';
	conn.query(sql,[maid,id,maid], function(error, results){
		if(error) {
			req.session.error = error;
			res.redirect('/error');
		} else {
			if(req.session.MaNguoiDung) {
				res.render('dienthoai_mua', {
					title: 'mua',
					mua: results[0].shift(),
					dienthoai: results[1].shift(),
					dttgh:results[2]
				});
			}
		}	
	});
	} else {
		//var mnd =req.session.MaNguoiDung;
		//trước khi thêm vào giỏ hàng xem đã có sản phẩm đó chưa
		var maid = req.session.MaNguoiDung;
		var sql ='SELECT MaDT from tbldienthoai where MaDT = ? and MaDT in\
		(SELECT MaDT from tblgiohang where CodeHD = ?)';
		conn.query(sql,[id,maid], function(error, results){
			if(error) {
				req.session.error = error;
				res.redirect('/error');
			} else {
				if(req.session.MaNguoiDung) {
					var string=JSON.stringify(results);
					var json =  JSON.parse(string);
					if(json[0])//nếu có kết quả
					{
						req.session.error = 'Sản phẩm đã tồn tại trong giỏ hàng.';
						res.redirect('/error');
						//console.log(results);
						//console.log(id);
						//console.log(maid);
						//console.log(json[0]);
					}
					else{
						if(req.session.MaNguoiDung) {
							var data1={
								MaDT:id,
								SoLuong: req.body.SoLuong,
								TongTien: req.body.ThanhTien,
								CodeHD:req.session.MaNguoiDung
							}
							//var thanhtien =data1['TongTien'];
							var sql = 'INSERT INTO tblgiohang SET ?;\
							UPDATE tblhoadon SET ThanhTien = ? + ThanhTien WHERE CodeHD = ?';
							conn.query(sql,[data1,data1['TongTien'],maid], function(error, results){
								if(error) {
									req.session.error = error;
									res.redirect('/error');
									console.log(error);
								}
								else {
										req.session.success = 'Đã thêm vào giỏ hàng.';
										res.redirect('/');
										//console.log(results[1]);
									}
							});
						}
					}
				}
				else {
					res.redirect('/dangnhap');
				}
			}	
		});
		
	}
});
// GET: Danh sách điện thoại
router.get('/', function(req, res){
	var sql = 'SELECT b.*, c.TenHSX, t.HoVaTen \
			   FROM tbldienthoai b, tblhsx c, tbltaikhoan t \
			   WHERE b.MaHSX = c.MaHSX GROUP BY TenDT \
			   ORDER BY NgayDang DESC';
	conn.query(sql, function(error, results){
		if(error) {
			req.session.error = error;
			res.redirect('/error');
		}
		else if(req.session.QuyenHan != 'admin'){
			req.session.error = 'Trang không tồn tại.';
			res.redirect('/error');
		} else {
			res.render('dienthoai', {
				title: 'Danh sách điện thoại',
				dienthoai: results
			});
		}
	});
});

// GET: Danh sách
// GET: Sửa 
router.get('/sua/:id', function(req, res){
	var id = req.params.id;
	var sql = 'SELECT * FROM tbldienthoai WHERE MaDT = ?;\
			   SELECT * FROM tblhsx ORDER BY TenHSX';
	conn.query(sql, [id], function(error, results){
		if(error) {
			req.session.error = error;
			res.redirect('/error');
		}
		else if(req.session.QuyenHan != 'admin'){
			req.session.error = 'Trang không tồn tại.';
			res.redirect('/error');
		} else {
			res.render('dienthoai_sua', {
				title: 'Sửa',
				dienthoai: results[0].shift(),
				hsx: results[1]
			});
		}
	});
});

// POST: Sửa bài viết
router.post('/sua/:id',upload.single('Anh'), validateForm, function(req, res){
	var errors = validationResult(req);
	if(!errors.isEmpty()) {
		if(req.file) fs.unlink(req.file.path, function(err){});
		// Lấy chủ đề và bài viết đang sửa hiển thị vào form
		var sql = 'SELECT * FROM tbldienthoai WHERE MaDT = ?;\
				   SELECT * FROM tblhsx ORDER BY MaHSX';
		conn.query(sql, function(error, results){
			if(error) {
				req.session.error = error;
				res.redirect('/error');
			} else {
				res.render('dienthoai_sua', {
					title: 'Sửa',
					dienthoai: results[0].shift(),
					hsx: results[1],
					errors: errors.array()
				});
			}
		});
	} else {
		//var fileName = '';
		//if(req.file) fileName = req.file.filename;
		var dt = {
			TenDT: req.body.TenDT,
			MaHSX: req.body.MaHSX,
			SoLuong: req.body.SoLuong,
			GiaBan: req.body.GiaBan,
			//Anh:fileName,
			MoTa: req.body.MoTa,
			TinhTrang:req.body.TinhTrang
		};
		if(req.file){
			dt['Anh'] = req.file.filename;
		}
		var id = req.params.id;
		var sql = 'UPDATE tbldienthoai SET ? WHERE MaDT = ?';
		conn.query(sql, [dt, id], function(error, results){
			if(error) {
				req.session.error = error;
				res.redirect('/error');
			} else {
				req.session.success = 'Sửa thành công.';
				res.redirect('/success');
			}
		});
	}
});

// GET: Duyệt bài viết
router.get('/duyet/:id', function(req, res){
	var id = req.params.id;
	var sql = 'UPDATE tbldienthoai SET KiemDuyet = 1 - KiemDuyet WHERE MaDT = ?';
	conn.query(sql, [id], function(error, results){
		if(error) {
			req.session.error = error;
			res.redirect('/error');
		}
		else if(req.session.QuyenHan != 'admin'){
			req.session.error = 'Trang không tồn tại.';
			res.redirect('/error');
		} else {
			res.redirect('back');
		}
	});
});

// GET: Xóa bài viết
router.get('/xoa/:id', function(req, res){
	var id = req.params.id;
	var sql = 'DELETE FROM tbldienthoai WHERE MaDT = ?';
	conn.query(sql, [id], function(error, results){
		if(error) {
			req.session.error = error;
			res.redirect('/error');
		}
		else if(req.session.QuyenHan != 'admin'){
			req.session.error = 'Trang không tồn tại.';
			res.redirect('/error');
		} else {
			res.redirect('back');
		}
	});
});

module.exports = router;