var express = require('express');
const session = require('express-session');
var router = express.Router();
var conn = require('../connect');
var firstImage = require('../firstimage');
// GET: Danh sách 
router.get('/', function(req, res){
	var sql = 'SELECT * FROM tblHSX ORDER BY MaHSX';
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
			res.render('hsx', {
				title: 'Danh sách chủ đề',
				hsx: results
			});
		}
	});
});

// GET: Thêm 
router.get('/them', function(req, res){
	if(req.session.QuyenHan != 'admin'){
		req.session.error = 'Trang không tồn tại.';
		res.redirect('/error');
	}	
	else
		res.render('hsx_them', { title: 'Thêm' });
});

// POST: Thêm 
router.post('/them', function(req, res){
	var hsx = {
		TenHSX: req.body.TenHSX
	};
	var sql = "INSERT INTO tblHSX SET ?";
	conn.query(sql, hsx, function(error, results){
		if(error) {
			req.session.error = error;
			res.redirect('/error');
		} else {
			res.redirect('/hsx');
		}
	});
});

// GET: Sửa 
router.get('/sua/:id', function(req, res){	
	var id = req.params.id;
	var sql = 'SELECT * FROM tblHSX WHERE MaHSX = ?';
	conn.query(sql, [id], function(error, results){
		if(error) {
			req.session.error = error;
			res.redirect('/error');
		}
		if(req.session.QuyenHan != 'admin'){
			req.session.error = 'Trang không tồn tại.';
			res.redirect('/error');
		}
		 else {
			res.render('hsx_sua', {
				title: 'Sửa',
				MaHSX: results[0].MaHSX,
				TenHSX: results[0].TenHSX
			});
		}
	});
});

// POST: Sửa 
router.post('/sua/:id', function(req, res){	
	var hsx = {
		TenHSX: req.body.TenHSX
	};
	//loi id
	var id = req.params.id;
	var sql = 'UPDATE tblhsx SET ? WHERE MaHSX = ?';
	conn.query(sql, [hsx, id], function(error, results){
		if(error) {
			req.session.error = error;
			res.redirect('/error');
		}
		 else {
			res.redirect('/hsx');
		}
	});
});

// GET: Xóa 
router.get('/xoa/:id', function(req, res){	
	var id = req.params.id;
	var sql = 'DELETE FROM tblhsx WHERE MaHSX = ?';
	conn.query(sql, [id], function(error, results){
		if(error) {
			req.session.error = error;
			res.redirect('/error');
			//console.log(id);
		}
		if(req.session.QuyenHan != 'admin'){
			req.session.error = 'Trang không tồn tại.';
			res.redirect('/error');
		} else {
			res.redirect('/hsx');
		}
	});
});
module.exports = router;