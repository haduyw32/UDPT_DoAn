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

function DeleteRegister (data, callback) {
	var varOut = 1;
	var insertReg = function(db, callback) {
		for (var i=0; i<data.length; i++) {
			db.collection('register').remove({'_id.typeVacxin':data[i].typeVacxin,'_id.user':data[i].user})
			}, function(err, result) {
				if (err) {
					varOut = 0;
					callback();
				}				
				else
					callback();				
			});
		}
		
	};

	var deleteInject = function(db, callback) {
		for (var i=0; i<data.length; i++) {
			db.collection('injectInfo').remove({'_id.typeVacxin':data[i].typeVacxin,'_id.user':data[i].user})
			}, function(err, result) {
				if (err) {
					varOut = 0;
					callback();
					return;
				}
				console.log("Deleted a document from the register and injectInfo collection.");
				callback();
			});
		}
		
	};
 

function insertRegister (data, callback) {
	var varOut = 1;
	var insertReg = function(db, callback) {
		for (var i=0; i<data.length; i++) {
			db.collection('register').insertOne( {
				_id: { place: data[i]._id.place, typeVacxin: data[i]._id.typeVacxin, user: data[i]._id.user },
				date: data[i].date
			}, function(err, result) {
				if (err) {
					varOut = 0;
					callback();
				}				
				if (result.insertedId.place == data[data.length-1]._id.place && result.insertedId.typeVacxin == data[data.length-1]._id.typeVacxin && result.insertedId.user == data[data.length-1]._id.user) {
					callback();
				}				
			});
		}
		
	};

	var insertInject = function(db, callback) {
		for (var i=0; i<data.length; i++) {
			db.collection('injectInfo').insertOne( {
				_id:{user: data[i]._id.user, typeVacxin: data[i]._id.typeVacxin}, lichTiem:[{ordinalNum: 0, date: data[i].date, state: 0}]
			}, function(err, result) {
				if (err) {
					varOut = 0;
					callback();
					return;
				}
				console.log("Inserted a document into the register and injectInfo collection.");
				if (result.insertedId.typeVacxin == data[data.length-1]._id.typeVacxin && result.insertedId.user == data[data.length-1]._id.user) {
					callback();
				}
			});
		}
		
	};

	MongoClient.connect(url, function(err, db) {
 		assert.equal(null, err);
 		insertReg(db, function() {
 			insertInject(db, function() {
 				db.close();
 				callback(varOut);
 			});
 		});
	});
}

function loadRegister(user, callback) {//Lấy thông tin đã đang ký -- trả về các loại vacxin mà người dùng đã đăng ký
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
		console.log("test docout");
		console.log(docOut);
		findReg(db, function() {
			db.close();
			callback(docOut);
		});
	});
}

d

function loadInfo2nd(user, callback) { //vacxin là mảng _id các loại vacxin
	
	var docOut = [];
	var findSchedule = function(db, callback) {
		var cursor =db.collection('register').aggregate([
		{
			$lookup:
        	{
	          from: "vacxin",
	          localField: "_id.typeVacxin",
	          foreignField: "_id",
	          as: "vacxin_docs"
        	}
		}
		]);
		cursor.each(function(err, doc) {
			assert.equal(err, null);				
			try {
				if(doc._id.user == user)
					docOut.push(doc.vacxin_docs[0]);				
			} catch (e)  {
				db.close();
				callback(docOut);
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
exports.loadInfo1st = loadInfo1st;
exports.loadInfo2nd = loadInfo2nd;
