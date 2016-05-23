var bodyParser = require('body-parser');
var db = require('../helpers/db');

module.exports = function (app) {
	app.use(bodyParser.urlencoded({ extended: true }));

	app.get('/register', function(req, res) {
		db.loadSchedule(function(docOut) {
			res.render('register.ect', {listTable: docOut});
		});
	});
	app.post('/confirm_but', function (req, res, next) {
		if (req.body.submit == "Đăng kí tiêm") {
			res.redirect('/register');
		}
	});

	app.post('/register', function (req, res, next) {//nhận thông tin đăng kí
		var len = req.body.reg.length;
		for (var i=0; i<len; i++) {
			db.insertRegister(req.body.reg[i], function (varOut) {
				
				/*if (varOut == 0) {
					res.send(false);
					return;
				}
				res.send(true);*/
			});
		};
		res.send(true);
	});
}