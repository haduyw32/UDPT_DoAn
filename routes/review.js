var bodyParser = require('body-parser');
var db = require('../helpers/db');

module.exports = function (app) {
	app.use(bodyParser.urlencoded({ extended: true }));

	app.get('/review', function (req, res, next) {
			db.loadInfo2nd(req.query.user, function(vacxin) {
				
					res.render('review.ect', {listTable: docOut});
				});
			});
	});

	
/*
+ vacxin {_id, use, age[]}
+ register {_id: {place, typeVacxin, user}, date} --địa điểm và vacxin đăng kí ở địa điểm đó

---------------------------------------------------------------------
+injectInfo {_id:{user, typeVacxin}, lichTiem[{ordinalNum, date, state}]}
*/
	

	
}