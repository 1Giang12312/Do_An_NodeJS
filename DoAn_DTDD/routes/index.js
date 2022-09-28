var express = require('express');
const app = express(); // Add This Also
var router = express.Router();
var conn = require('../connect');
var firstImage = require('../firstimage');
const path = require('path')

// GET: Trang chủ
router.get('/', function(req, res){
	//var id = req.session.MaNguoiDung;
	var sql = 'SELECT * FROM tblHSX order by TenHSX;\
	SELECT b.*, c.TenHSX from tbldienthoai b, tblHSX c \
	 where b.MaHSX = c.MaHSX and b.KiemDuyet = 1 and b.SoLuong>0 GROUP BY TenDT order by NgayDang desc';
	 conn.query(sql, function(error, results){
		 if(error){
			 req.session.error = error;
			 res.redirect('/error');
		 }
		 else{
			 res.render('index',{
				 title: 'Trang chủ',
				 hsx: results[0],
				 dienthoaimoinhat: results[1].shift(),
				 dienthoai: results[1],
				 firstImage: firstImage
			 });
			 
		 }
		 //console.log(results[0]);
		// console.log(results[1]);
		 // console.log(results[1].shift());
		 //console.log(results[0]);
	 });
		 
});

router.get('/hsx/index_hsx/:id', function(req, res){
	var id = req.params.id;
	var sql = 'SELECT * FROM tblHSX order by TenHSX;\
	SELECT b.*, c.TenHSX from tbldienthoai b, tblHSX c \
	 where b.MaHSX = c.MaHSX and c.MaHSX =? and b.KiemDuyet = 1 GROUP BY TenDT order by NgayDang desc';
	 conn.query(sql,id, function(error, results){
		 if(error){
			 req.session.error = error;
			 res.redirect('/error');
		 }
		 else{
			 res.render('index_hsx',{
				 title: 'Trang chủ',
				 hsx: results[0],
				 dienthoai: results[1],
				 firstImage: firstImage
			 });
			 //console.log(id);
			// console.log(results[0]);
			// console.log(results[1]);
			 // console.log(results[1].shift());
		 }
	 });
});
router.get('/dienthoai/chitiet/:id', function(req, res){
	var id = req.params.id;
	var sql = 'SELECT b.*, c.TenHSX from tbldienthoai b,\
	tblHSX c where b.MaHSX = c.MaHSX \
	 and b.kiemduyet = 1 and b.MaDT=?;\
	 SELECT c.TenHSX,b.* FROM tblhsx c, tbldienthoai b WHERE b.MaHSX=c.MaHSX and b.MaHSX IN (SELECT  c.MaHSX FROM tbldienthoai b,\
		tblHSX c WHERE b.MaHSX = c.MaHSX and b.kiemduyet = 1 and b.MaDT=?)';
	conn.query(sql, [id,id], function(error, results){
		if(error){
			req.session.error = error;
			res.redirect('/error');
			//console.log(results[1]);
		}
		else{
			res.render('dienthoai_chitiet',{
				dienthoai: results[0].shift(),
				dttt:results[1]
			});
			//console.log(results[1]);
		}
		
	})
	
});
// GET: Tin mới nhất
router.get('/tinmoinhat', function(req, res){
	res.render('tinmoinhat', { title: 'Tin mới nhất' });
});

// POST: Kết quả tìm kiếm
router.post('/timkiem', function(req, res){
	var sql = 'SELECT b.*, c.* from tbldienthoai b, tblHSX c where b.MaHSX = c.MaHSX and b.KiemDuyet = 1 and ( b.TenDT like ? or c.TenHSX like ? );\
	SELECT * from tblHSX';
	var tukhoa = "%"+req.body.tukhoa+"%";
	conn.query(sql, [tukhoa, tukhoa], function(error, results){
		if(error){
			req.session.error = error;
			res.redirect('/error');
			//console.log(tukhoa);
		}
		else{
			res.render('index_timkiem',{
				title: 'Trang chủ',
				hsx: results[1],
				dienthoai: results[0],
				firstImage: firstImage
			});
		}
	});
});

// GET: Lỗi
router.get('/error', function(req, res){
	res.render('error', { title: 'Lỗi' });
});

// GET: Thành công
router.get('/success', function(req, res){
	res.render('success', { title: 'Hoàn thành' });
});

module.exports = router;