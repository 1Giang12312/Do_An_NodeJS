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
// GET: Danh sách
router.get('/:id', function(req, res){
	// Mã người dùng hiện tại
	var id = req.session.MaNguoiDung;
	var sql = 'SELECT b.*,c.Anh,c.TenDT,c.GiaBan FROM tblgiohang b,tbldienthoai c WHERE b.CodeHD = ? and TrangThai =0 and b.MaDT = c.MaDT group by MaDT;\
	SELECT  Round(Sum(TongTien),2) as TongTien from tblgiohang where CodeHD=? and TrangThai = 0';
	conn.query(sql, [id,id], function(error, results){
		if(error) {
			req.session.error = error;
			res.redirect('/error');
		}
		else if(req.session.MaNguoiDung == null){
			req.session.error = 'Trang không tồn tại.';
			res.redirect('/error');
		} else {
			var string=JSON.stringify(results[0]);
			var json =  JSON.parse(string);
			if(json[0])//tồn tại sản phẩm trong giỏ hàng
			{
				res.render('giohang', {
					title: 'Giỏ hàng',
					giohang: results[0],
					hoadon:results[1].shift()
					
				});
				//console.log(results);
			}
			else{
				res.render('giohang_rong', {
					title: 'Giỏ hàng',
				});
				//console.log(json[0]);
			}
			//console.log(results[1].shift());
		}
	});
});
//mua
router.get('/mua/:id', function(req, res){
	// Mã người dùng hiện tại
	var id = req.session.MaNguoiDung;
	// xóa dt trong giỏ hàng 	DELETE * from tblgiohang WHERE CodeHD = ?';
	//thêm hóa đơn
	//kiểm tra số lượng
	// xóa trong giỏ hàng
	//update lại số lượng
	var sql = 'select a.SoLuong, b.SoLuong from tbldienthoai a, tblgiohang b where a.MaDT = b.MaDT and a.SoLuong >= b.SoLuong and CodeHD = ?';
	conn.query(sql,[id], function(error, results){
		if(error) {
			req.session.error = error;
			res.redirect('/error');
		} else {
			var string=JSON.stringify(results);
			var json = JSON.parse(string);
			if(json[0])//nếu tồn tại số lượng
			{
				var sql = 'UPDATE tbldienthoai SET SoLuong = SoLuong - ? Where MaDT in (SELECT MaDT from tblgiohang where CodeHD = ?);\
							UPDATE tblgiohang set TrangThai = 1 Where CodeHD = ?';
				conn.query(sql, [json[0].SoLuong,id,id], function(error, results){
				if(error) {
					req.session.error = error;
						res.redirect('/error');
						//console.log(json[0].SoLuong);
					} else {//cập nhật lại số lượng
							var sql = 'SELECT Sum(TongTien) as TongTien from tblgiohang where CodeHD=?';
							conn.query(sql, [id], function(error, results){
								var string=JSON.stringify(results);
								var json2 = JSON.parse(string);// sum của tổng tiền
								if(error) {
									req.session.error = error;
									res.redirect('/error');
								} else {
									var sql = 'INSERT INTO tblhoadon SET MaTaiKhoan = ? , ThanhTien = ?, Duyet= 1 , CodeHD = ?';
										conn.query(sql, [id,json2[0].TongTien,id], function(error, results){
											if(error) {
												req.session.error = error;
												res.redirect('/error');
												
											} else {//cập nhật lại số lượng
									
										}});
									}});
							req.session.success = 'Mua thành thành công chờ xác nhận từ số điện thoại hoặc Email.';
							res.redirect('/success');
												
							}});
				
			}
			else{
				req.session.error = "Số lượng không đủ";
				res.redirect('/error');
			}
				
		}});
			//console.log(results[1].shift());
});
// GET: Danh sách
// GET: Sửa 

router.get('/sua/:id', function(req, res){
	var id = req.params.id;
	var sql = 'select a.SoLuong,a.TongTien ,b.GiaBan,b.TenDT,b.MaDT from tblgiohang a, tbldienthoai b where b.MaDT=? group by TenDT';
	conn.query(sql, [id], function(error, results){
		if(error) {
			req.session.error = error;
			res.redirect('/error');
		}else if(req.session.MaNguoiDung == null){
			req.session.error = 'Trang không tồn tại.';
			res.redirect('/error');
		}
		 else {
			res.render('giohang_sua', {
				title: 'Sửa',
				giohang: results.shift()
			});
		}
	});
});
// POST: Sửa bài viết
router.post('/sua/:id', function(req, res){
	var errors = validationResult(req);
	if(!errors.isEmpty()) {
		var sql = 'select a.SoLuong,a.TongTien ,b.GiaBan,b.TenDT,b.MaDT from tblgiohang a, tbldienthoai b where b.MaDT=? group by TenDT';
		conn.query(sql, function(error, results){
			if(error) {
				req.session.error = error;
				res.redirect('/error');
			} else {
				res.render('giohang_sua', {
					title: 'Sửa',
					giohang: results.shift(),
					errors: errors.array()
				});
			}
		});
	} else {
		var dt = {
			SoLuong:req.body.SoLuong,
			TongTien:req.body.TongTien
		};
		var id = req.params.id;
		var id1 = req.session.MaNguoiDung;
		//var SoLuong = req.body.SoLuong;
		var sql = 'UPDATE tblgiohang SET ? WHERE MaDT = ? and CodeHD =?';
		conn.query(sql, [dt,id,id1], function(error, results){
			if(error) {
				req.session.error = error;
				res.redirect('/error');
			} else { // sum tổng tiền
				//console.log(req.params.id);
				var sql = 'SELECT sum(TongTien) as TT FROM tblgiohang where CodeHD=?;';
				conn.query(sql, [id1], function(error, results){
					if(error) {
						req.session.error = error;
						res.redirect('/error');
					} else { //update hóa đơn
						//console.log(results);
						var string=JSON.stringify(results);
						var json =  JSON.parse(string);
						var sql = 'UPDATE tblhoadon SET ThanhTien = ? Where CodeHD =?;';
						conn.query(sql, [json[0].TT,id1], function(error, results){
							if(error) {
								req.session.error = error;
								res.redirect('/error');
							} else {
								//console.log(results);
								req.session.success = 'Sửa thành công.';
								res.redirect('/success');
							}
						});
					}
				});
				
			}
		});
	}
});
// GET: Xóa
router.get('/xoa/:id', function(req, res){
	var id1 = req.session.MaNguoiDung;
	var id = req.params.id;
	var sql = 'DELETE FROM tblgiohang WHERE MaDT = ? and CodeHD =?';
	conn.query(sql, [id,id1], function(error, results){
		if(error) {
			req.session.error = error;
			res.redirect('/error');
		}
		else if(req.session.MaNguoiDung == null){
			req.session.error = 'Trang không tồn tại.';
			res.redirect('/error');
		} else {
			var sql = 'SELECT sum(TongTien) as TT FROM tblgiohang where CodeHD=?;';
				conn.query(sql, [id1], function(error, results){
					if(error) {
						req.session.error = error;
						res.redirect('/error');
					} else { //update hóa đơn
						var string=JSON.stringify(results);
						var json =  JSON.parse(string);
						var sql = 'UPDATE tblhoadon SET ThanhTien = ? Where CodeHD =?;';
						conn.query(sql, [json[0].TT,id1], function(error, results){
							if(error) {
								req.session.error = error;
								res.redirect('/error');
							} else {
								req.session.success = 'Xóa thành công.';
								res.redirect('back');
							}
						});
					}
				});
		}
	});
});

module.exports = router;