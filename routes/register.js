var bodyParser = require('body-parser');
var db = require('../helpers/db');

module.exports = function (app) {
	app.use(bodyParser.urlencoded({ extended: true }));

	app.post('/register', function (req, res, next) {
		if (req.body.submit == "Đăng kí tiêm") {
			console.log(req.body);
			db.loadRegister(req.body.user, function(vacxin) {
				db.loadSchedule(vacxin, function(docOut) {
					res.render('register.ect', {listTable: docOut});
				});
			});
		}
	});


	app.post('/saveReg', function (req, res, next) {//nhận thông tin đăng kí
		db.insertRegister(req.body.reg, function (varOut) {
			if (varOut == 0) {
				res.send(false);
			}
			else {
				res.send(true);
			}
/*
+ vacxin {_id, use, age[]}
+ register {_id: {place, typeVacxin, user}, date} --địa điểm và vacxin đăng kí ở địa điểm đó

---------------------------------------------------------------------
+injectInfo {_id:{user, typeVacxin}, lichTiem[{ordinalNum, date, state}]}
*/
		});
	});

	
}