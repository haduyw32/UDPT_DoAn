var express = require('express');
var router = express.Router();
var login = require('./login');
var HandlerClient = require('./HandlerClient');

router.get('/login', function(req, res) {
	res.render('login.ect', { title: 'Login' });
});

router.get('/signup', function(req, res) {
	res.render('signup.ect', { title: 'signup' });
});

router.get('/', function(req, res) {
		res.render('index.ect', {  });
});

login(router);
//HandlerClient(router);

module.exports = router;