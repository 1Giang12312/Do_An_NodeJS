var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require("fs");
var conn = require('../connect');
var { check, validationResult } = require('express-validator');
var bcrypt = require('bcrypt');
var saltRounds = 10;
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
/*var upload = multer({ storage: storageConfig });

var multer = require('multer');
var storageConfig = multer.diskStorage({
	destination:function(req, file, callback) {
		callback(null,'../uploads/');
	},
	filename: function(req, file, callback){
		const timestamp = Date.now();
		callback(null,file.filename + '_' + timestamp);
	}

});*/
var upload = multer({storage: storageConfig});
// GET: Thêm tài khoản
/*router.get('/them', function(req, res){
	res.render('taikhoan_them', { title: 'Thêm tài khoản' });
});

// POST: Thêm tài khoản
var validateForm = [
	check('HoVaTen')
		.notEmpty().withMessage('Họ và tên không được bỏ trống.'),
	check('TenDangNhap')
		.notEmpty().withMessage('Tên đăng nhập không được bỏ trống.')
		.isLength({ min: 6 }).withMessage('Tên đăng nhập phải lớn hơn 6 ký tự.'),
	check('MatKhau')
		.notEmpty().withMessage('Mật khẩu không được bỏ trống.')
		.custom((value, { req }) => value === req.body.XacNhanMatKhau).withMessage('Xác nhận mật khẩu không đúng.'),
	check('SoDienThoai')
		.notEmpty().withMessage('Tên đăng nhập không được bỏ trống.')
		.isLength({ max: 10 }).withMessage('Số điện thoại có 10 số.'),
];
router.post('/them', upload.single('HinhAnh'), validateForm, function(req, res){
	var errors = validationResult(req);
	if(!errors.isEmpty()) {
		if(req.file) fs.unlink(req.file.path, function(err){});
		res.render('taikhoan_them', {
			title: 'Đăng ký tài khoản',
			errors: errors.array()
		});
	} else {
		var fileName = '';
		if(req.file) fileName = req.file.filename;
		var data = {
			HoVaTen: req.body.HoVaTen,
			SoDienThoai: req.body.SoDienThoai,
			DiaChi:req.body.DiaChi,
			Email: req.body.Email,
			HinhAnh: fileName,
			TenDangNhap: req.body.TenDangNhap,
			MatKhau: bcrypt.hashSync(req.body.MatKhau, saltRounds)
		};
		var sql = 'INSERT INTO tbltaikhoan SET ?';
		conn.query(sql, data, function(error, results){
			if(error) {
				req.session.error = error;
				res.redirect('/error');
			} else {
				req.session.success = 'Đã đăng ký tài khoản thành công.';
				res.redirect('/');
				//nếu đăng ký thành công tạo 1 hóa đơn có tổng tiền là 0
				//console.log(data);
			}
		});
	}
});

/*router.post('/them', upload.single('HinhAnh'), validateForm, function(req, res){
	var errors = validationResult(req);
	if(!errors.isEmpty()) {
		if(req.file) fs.unlink(req.file.path, function(err){});
		res.render('taikhoan_them', {
			title: 'Thêm tài khoản',
			errors: errors.array()
		});
	} else {
		var fileName = '';
		if(req.file) fileName = req.file.filename;
		var data = {
			HoVaTen: req.body.HoVaTen,
			Email: req.body.Email,
			HinhAnh: fileName,
			TenDangNhap: req.body.TenDangNhap,
			MatKhau: bcrypt.hashSync(req.body.MatKhau, saltRounds),
			//QuyenHan: "user"
		};
		var sql = 'INSERT INTO tbltaikhoan SET ?';
		conn.query(sql, data, function(error, results){
			if(error) {
				req.session.error = error;
				res.redirect('/error');
			} else {
				res.redirect('/taikhoan');
			}
		});
	}
});
*/
// GET: Danh sách tài khoản
router.get('/', function(req, res){
	var sql = "SELECT * FROM tbltaikhoan";
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
			res.render('taikhoan', {
				title: 'Danh sách tài khoản',
				taikhoan: results
			});
		}
	});
});

// GET: Sửa tài khoản
router.get('/sua/:id', function(req, res){
	var id = req.params.id;
	var sql = 'SELECT * FROM tbltaikhoan WHERE MaTaiKhoan = ?';
	conn.query(sql, [id], function(error, results){
		if(error) {
			req.session.error = error;
			res.redirect('/error');
		} else {
			res.render('taikhoan_sua', {
				title: 'Sửa tài khoản',
				MaTaiKhoan: results[0].MaTaiKhoan,
				TenDangNhap: results[0].TenDangNhap,
				MatKhau: results[0].MatKhau,
				HoVaTen: results[0].HoVaTen,
				SDT: results[0].SoDienThoai,
				Email: results[0].Email,
				HinhAnh: results[0].HinhAnh,
				KichHoat: results[0].KichHoat,
				QuyenHan: results[0].QuyenHan
			});
		}
	});
});
//sửa tài khoản khogn6 dùng validateformedit được vì khi trả về lỗi và sua/:id sẽ ko lấy dc mã người dùng
// POST: Sửa tài khoản
//sửa tài khoản cho quyền admin
router.post('/sua/:id', upload.single('HinhAnh'), function(req, res){
	var errors = validationResult(req);
	if(!errors.isEmpty()) {
		if(req.file) fs.unlink(req.file.path, function(err){});
		res.render('taikhoan_sua', {
			title: 'Sửa tài khoản',
			ID: req.params.id,
			HoVaTen: req.body.HoVaTen,
			Email: req.body.Email,
			SoDienThoai:req.body.SDT,
			HinhAnh: req.body.HinhAnh,
			TenDangNhap: req.body.TenDangNhap,
			MatKhau: req.body.MatKhau,
			QuyenHan: req.body.QuyenHan,
			KichHoat: req.body.KichHoat,
			errors: errors.array()
		});
	} else {
		var taikhoan = {
			HoVaTen: req.body.HoVaTen,
			Email: req.body.Email,
			SoDienThoai:req.body.SDT,
			TenDangNhap: req.body.TenDangNhap,
			QuyenHan: req.body.QuyenHan,
			KichHoat: req.body.KichHoat
		};
		if(req.body.MatKhau)
			taikhoan['MatKhau'] = bcrypt.hashSync(req.body.MatKhau, saltRounds);
		if(req.file){
			taikhoan['HinhAnh'] = req.file.filename;
		}
		var id = req.params.id;
		var sql = 'UPDATE tbltaikhoan SET ? WHERE MaTaiKhoan = ?';
		conn.query(sql, [taikhoan, id], function(error, results){
			if(error) {
				req.session.error = error;
				res.redirect('/error');
			}
			else {
				res.redirect('/taikhoan');
			}
		});
	}
});
//sửa tài khoản cho quyền user
router.post('/suathongtin/:id', upload.single('HinhAnh'), function(req, res){
	var errors = validationResult(req);
	if(!errors.isEmpty()) {
		if(req.file) fs.unlink(req.file.path, function(err){});
		res.render('taikhoan_thongtincanhan', {
			title: 'Sửa tài khoản',
			ID: req.params.id,
			HoVaTen: req.body.HoVaTen,
			SoDienThoai:req.body.SDT,
			Email: req.body.Email,
			HinhAnh: req.body.HinhAnh,
			TenDangNhap: req.body.TenDangNhap,
			MatKhau: req.body.MatKhau,
			errors: errors.array()
		});
	} else {
		var taikhoan = {
			HoVaTen: req.body.HoVaTen,
			Email: req.body.Email,
			SoDienThoai:req.body.SDT,
			TenDangNhap: req.body.TenDangNhap,
		};
		if(req.body.MatKhau)
			taikhoan['MatKhau'] = bcrypt.hashSync(req.body.MatKhau, saltRounds);
		if(req.file){
			taikhoan['HinhAnh'] = req.file.filename;
		}
		var id = req.params.id;
		var sql = 'UPDATE tbltaikhoan SET ? WHERE MaTaiKhoan = ?';
		conn.query(sql, [taikhoan, id], function(error, results){
			if(error) {
				req.session.error = error;
				res.redirect('/error');
			}
			else {
				res.redirect('/');
			}
		});
	}
});
//
router.get('/thongtincanhan/:id', function(req, res){
	var id = req.params.id;
	var sql = 'SELECT * FROM tbltaikhoan WHERE MaTaiKhoan = ?';
	conn.query(sql, [id], function(error, results){
		if(error) {
			req.session.error = error;
			res.redirect('/error');
		} else {
			res.render('taikhoan_thongtincanhan', {
				title: 'Sửa tài khoản',
				MaTaiKhoan: results[0].MaTaiKhoan,
				TenDangNhap: results[0].TenDangNhap,
				MatKhau: results[0].MatKhau,
				HoVaTen: results[0].HoVaTen,
				SoDienThoai:results[0].SoDienThoai,
				Email: results[0].Email,
				HinhAnh: results[0].HinhAnh,
				KichHoat: results[0].KichHoat,
				QuyenHan: results[0].QuyenHan
			});
		}
	});
});
// GET: Xóa tài khoản
router.get('/xoa/:id', function(req, res){
	var id = req.params.id;
	var sql = 'DELETE FROM tbltaikhoan WHERE MaTaiKhoan = ?';
	conn.query(sql, [id], function(error, results){
		if(error) {
			req.session.error = error;
			res.redirect('/error');
		} else {
			res.redirect('/taikhoan');
		}
	});
});
router.get('/trangthai/:id', function(req, res){
	var id = req.params.id;
	var sql = 'UPDATE tbltaikhoan SET KichHoat = 1 - KichHoat WHERE MaTaiKhoan = ?';
	conn.query(sql, [id], function(error, results){
		if(error) {
			req.session.error = error;
			res.redirect('/error');
		} else {
			res.redirect('back');
		}
	});
});
module.exports = router;