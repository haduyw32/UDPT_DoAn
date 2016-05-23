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
}