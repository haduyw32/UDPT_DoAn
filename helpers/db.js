var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
//var url = 'mongodb://udpt:ABab1234@ds021711.mlab.com:21711/udpt';
var url = 'mongodb://127.0.0.1:27017/udpt_doan';


function insertUser (data, callback) {
	var varOut = 1;
	var insertDocument = function(db, callback) {
		db.collection('userInfo').insertOne( {
			"name": data.name,
			"_id": data._id,
			"pass": data.pass,
			"cmnd": data.cmnd,
			"age" : data.age
		}, function(err, result) {
			if (err) {
				varOut = 0;
				callback();
				return;
			}
			console.log("Inserted a document into the userInfo collection.");
			callback();
		});
	};

	MongoClient.connect(url, function(err, db) {
 		assert.equal(null, err);
  		insertDocument(db, function() {
      		db.close();
      		callback(varOut);
  		});
	});
}

function loginUser (data, callback) {
	var docOut;
	var findUser = function(db, callback) {
	var cursor =db.collection('userInfo').find( { _id: data._id, pass: data.pass } );
	cursor.each(function(err, doc) {
		assert.equal(err, null);
		if (doc != null) {
			docOut = doc;
		} else {
			callback();
		}
	});
	};
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		findUser(db, function() {
			db.close();
			callback(docOut);
		});
	});
}


function loadSchedule(vacxin, callback) { //vacxin là mảng _id các loại vacxin
	var docOut = [];
	var findSchedule = function(db, callback) {
		var cursor =db.collection('schedule').aggregate([
		{
			$lookup:
			{
				from: "vacxin",
				localField: "vacxin",
				foreignField: "_id",
				as: "vacxin_docs"
			}
		}
		]);
		cursor.each(function(err, doc) {
			assert.equal(err, null);
			if (doc != null) {
				for (var i=0; i<vacxin.length; i++) {
					for (var j=0; j<doc.vacxin_docs.length;j++) {
						if (doc.vacxin_docs[j]._id == vacxin[i]) {
							doc.vacxin_docs.splice(j, 1);
							j = j - 1;
						}
					}
				}
				if (doc.vacxin_docs.length != 0){
					docOut.push(doc);
				}
			} else {
				callback();
			}
		});
	};
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		findSchedule(db, function() {
			db.close();
			callback(docOut);
		});
	});
}

function insertRegister (data, callback) {
	var varOut = 1;
	
	var insertReg = function(db, callback) {
		//for (var i=0; i<data.length; i++) {
			db.collection('register').insertOne( {
				_id: { place: data._id.place, typeVacxin: data._id.typeVacxin, user: data._id.user },
				date: data.date
			}, function(err, result) {
				if (err) {
					varOut = 0;
					callback();
					return;
				}
				console.log("Inserted a document into the register collection.");
				callback();
			});
		//}
		
	};

	MongoClient.connect(url, function(err, db) {
 		assert.equal(null, err);
 		//insertbeginM(db);
  		insertReg(db, function() {
      		db.close();
      		callback(varOut);
  		});
	});
}

function loadRegister(user, callback) {
	var docOut = [];
	var findReg = function(db, callback) {
		var cursor =db.collection('register').find( { "_id.user":  user} );
		cursor.each(function(err, doc) {
			assert.equal(err, null);
			if (doc != null) {
				docOut.push(doc._id.typeVacxin);
			} else {
				callback();
			}
		});
	};
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		findReg(db, function() {
			db.close();
			callback(docOut);
		});
	});
}



/*
function findFriend (data, callback) { //hoan thanh: 1, loi: 0|| email: username, txt: elm.value
	var Out = 1;
	var findUser = function(db, callback) {
	var cursor =db.collection('userInfo').find( { name: data.txt } );
	cursor.each(function(err, doc) {
		assert.equal(err, null);
		if (doc != null) {
			data.txt = doc._id;
			var temp = {email: data.email, uf: doc._id, name: doc.name};
			insertFriend(temp);
			callback();
		} else {
			Out = 0;
			callback();
		}
	});
	};
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		findUser(db, function() {
			db.close();
			callback(Out);
		});
	});
}


function insertFriend (data) {
  	var insertDocument = function(db, callback) {
		db.collection('listFriend').update(
			{"_id": data.email}, {$addToSet: {"friend": {_id:data.uf, name: data.name}}}
		, function(err, result) {
			if (err) { console.log(err);
				return;
			}
    		callback();
  		});
	};

	var insertBeginM = function(db, callback) {
		db.collection('listMes').update(
			{"_id": data.email}, {$addToSet: {"friend": {_id:data.uf, mes: []}}}
		, function(err, result) {
			if (err) { console.log(err);
				callback();
				return;
			}
  		});
	};

	MongoClient.connect(url, function(err, db) {
 		assert.equal(null, err);
 		insertBeginM(db);
  		insertDocument(db, function() {
  			insertBeginM(db, function() {
      			db.close();
      		});
  		});
	});
}

//----------------------------------------------------------------------


function getList (data, callback) {
	var docOut;
	var findUser = function(db, callback) {
	var cursor =db.collection('listFriend').find( { _id: data.email } );
	cursor.each(function(err, doc) {
		assert.equal(err, null);
		if (doc != null) {
			docOut = doc;
		} else {
			callback();
		}
	});
	};

	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		findUser(db, function() {
			db.close();
			callback(docOut);
		});
	});
}


function getMes (data, callback) { //email || userf
	var docOut;
	var findUser = function(db, callback) {
	var cursor =db.collection('listMes').find( { _id: data.email}, {friend: {$elemMatch: {_id: data.userf}}} );
	cursor.each(function(err, doc) {
		assert.equal(err, null);
		if (doc != null) {
			docOut = doc; 
		} else {
			callback();
		}
	});
	};

	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		findUser(db, function() {
			db.close();
			callback(docOut);
		});
	});
}

function sendMes (data) { //email: username, userf: fcus, value: elm.value}
	var insertm = function(db, callback) {
		db.collection('listMes').update(
			{ _id: data.email, friend: {$elemMatch: {_id: data.userf}}}, {$push: {"friend.$.mes": {type: 1, conten: data.value}}}
		, function(err, result) {
			if (err) { console.log(err);
				callback();
				return;
			}
  		});
	};

	var insertf = function(db, callback) {
		db.collection('listMes').update(
			{ _id: data.userf, friend: {$elemMatch: {_id: data.email}}}, {$push: {"friend.$.mes": {type: 0, conten: data.value}}}
		, function(err, result) {console.log (data);
			if (err) { console.log(err);
				return;
			}
    		callback();
  		});
	};
	MongoClient.connect(url, function(err, db) {
 		assert.equal(null, err);
  		insertf(db, function() {
  			db.close();
  		});
	});

	MongoClient.connect(url, function(err, db) {
 		assert.equal(null, err);
  		insertm(db, function() {
  			insertf(db, function() {
  				db.close();
  			});
      	});
	});
}

exports.findFriend = findFriend;
exports.getList = getList;
exports.getMes = getMes;
exports.sendMes = sendMes;
*/
exports.insertUser = insertUser;
exports.loginUser = loginUser;
exports.loadSchedule = loadSchedule;
exports.insertRegister = insertRegister;
exports.loadRegister = loadRegister;
