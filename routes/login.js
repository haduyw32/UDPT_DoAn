
//var mongoose = require('mongoose');
//var User = mongoose.model('User');
var url = require("url");
var db = require('../helpers/db');
var hash = require('../helpers/hash');
var bodyParser = require('body-parser')


module.exports = function (app) {
	app.use(bodyParser.urlencoded({ extended: true }));
	app.post('/', function (req, res, next) {

	});

	

	app.post('/signup', function (req, res, next) {
		var data = req.body;
		if (data.submit == "Login") {
      			res.render('login.ect', { });
      			return;
      	}
      	if (data._id == '' || data.pass == '' || data.name == '' || data.cmnd == '' || data.age =='') {
      			console.log('Thieu thong tin dang ki');
      			res.render('signup.ect', { ShowCaution1: true }); //thieu thong tin
				return;
		}
      	db.insertUser(data, function (varOut) {
      		if (varOut == 1) {
      			console.log("signup: " + data);
      			//res.redirect('/login');
      		}
      		else {
      			invalid ();
      		}
      	});
		//db.demo(req.body.name);
		/*req.on('data', function(chunk) {
      		var data = hash(chunk);
      		
      		
			console.log(data);
			db.insertUser(data, function(doc) {
				if (doc == 0) {
					invalid ();
				}
				else {
					res.redirect('/login');
				}
			});
      	})*/

		function invalid () {
			return res.render('signup.ect', { ShowCaution: true }); //ten dang nhap da ton tai
		}
	});
//-----------------------------------------------------------
	app.post('/login', function (req, res, next) {
		var data = req.body;
      	if (data.submit == "Register") {
      		res.render('signup.ect', { });
      			return;
      	}
      	if (data._id == '' || data.pass == '') {
      		console.log('Thieu thong tin');
			return invalid();
		}
		db.loginUser(data, function(doc) {
			if (doc == null) {
				invalid ();
			}
			else {console.log(doc);
				res.render('index.ect', { wuser: doc._id, wpass: doc.pass, wname: doc.name });
			}
		});
      	function invalid () {
			return res.render('login.ect', { ShowCaution: true });
		}
	});
}

