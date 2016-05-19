var db = require('../helpers/db');
var hash = require('../helpers/hash');

module.exports = function (app) {
	app.post('/addfriend', function (req, res) {
		req.on('data', function(chunk) {
      		var data = hash(chunk);
      		db.findFriend(data, function(out) {
				if (out == 0) {
					res.end('none');
				}
				else {
					res.end('done');
				}
			});
      		
      	});
    });

    app.post('/getlist', function (req, res, next) {
		req.on('data', function(chunk) {
      		var data = hash(chunk);
      		db.getList(data, function(out) {
      			if (out == null) {
      				res.send(null);
      				return;      				
      			}
      			res.send(out.friend);
      			return;
			});
      		
      	});
    });


    //getmes", {email: username, userf: arrFriend[pos]._id}
    app.post('/getmes', function (req, res, next) {
    	req.on('data', function(chunk) {
      		var data = hash(chunk);
      		db.getMes(data, function(out) {
      			res.send(out.friend[0].mes);
      			return;
			});
      	});
    });

    //$.post("/sendMes", {email: username, userf: fcus, value: elm.value},  function(data) {
    app.post('/sendMes', function (req, res, next) {
    	req.on('data', function(chunk) {
      		var data = hash(chunk);
      		db.sendMes(data);
      	});
    });
}
