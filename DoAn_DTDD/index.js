var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');

var indexRouter = require('./routes/index');
var taikhoanRouter = require('./routes/taikhoan');
var hangsanxuatRouter = require('./routes/hsx');
var authRouter = require('./routes/auth');
var dienthoaiRouter = require('./routes/dienthoai');
var hoadonRouter = require('./routes/hoadon');
var giohangRouter = require('./routes/giohang');
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.static('uploads'));
app.use(session({
	name: 'randomname',						// Tên session
	secret: 'back back back back',// Khóa bảo vệ
	resave: true,
	saveUninitialized: true,
	cookie: {
		maxAge: 30 * 86400000			// 30 * (24 * 60 * 60 * 1000) - Hết hạn sau 30 ngày
	}
}));
app.use(function(req, res, next){
	res.locals.session = req.session;
	
	// Lấy thông báo của trang trước đó (nếu có)
	var error = req.session.error;
	var success = req.session.success;
	
	delete req.session.error;
	delete req.session.success;
	
	res.locals.errorMsg = '';
	res.locals.successMsg = '';
	
	if (error) res.locals.errorMsg = error;
	if (success) res.locals.successMsg = success;
	
	next();
});

app.use('/', indexRouter);
app.use('/', authRouter);
app.use('/taikhoan', taikhoanRouter);
app.use('/hsx', hangsanxuatRouter);
app.use('/dienthoai', dienthoaiRouter);
app.use('/hoadon',hoadonRouter);
app.use('/giohang',giohangRouter);
app.listen(3000, function(){
	console.log('Server is running!');
});