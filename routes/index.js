var express = require('express');
var router = express.Router();
var multer = require('multer');
var auth = require('../middleware/auth');
var Album = require('../models/Album');
var User = require('../models/User');
var _ = require('underscore');

/* GET home page. */
router.get('/', auth({ required : false }), function(req, res, next) {
	res.render('index', {
		title: 'Swumo',
		user: req.user
	});
});

/**
 * All albums with user's ownership code
 */
router.get('/a', auth({ required : false }), function(req, res, next) {
	var ownershipCode = req.query.ownershipCode || req.cookies.ownershipCode;
	var user = req.user;
	if (!user && ownershipCode) {
		console.log('Looking for albums with ownershipCode', ownershipCode);
		Album.findByOwnershipCode(ownershipCode, function(err, albums) {
			var albumViewModels = _.map(albums, function(album) {
				return album.viewModel();
			});
			res.render('albums', { title : 'My Albums', albums : albumViewModels, user: req.user });
		});
	} else if (user) {
		console.log('Looking for albums with user', user.email);
		Album.findByOwner(user, function(err, albums) {
			console.log('Found', albums.length, 'albums owned by user', user.username);
			var albumViewModels = _.map(albums, function(album) {
				return album.viewModel();
			});
			res.render('albums', { albums : albumViewModels, user: req.user });
		});
	} else {
		res.render('albums', []);
	}
});

router.get('/a/:shortName', auth({ required : false }), function(req, res, next) {
	var album; // This will be a new albumdd
	album = Album.findByShortName(req.params.shortName, function(err, album) {
		res.render('album', { title : 'Album', album : album.viewModel(), user: req.user });
	});
});

router.get('/sign-out', auth({ required : false }), function(req, res, next) {
	req.logout();
	res.redirect('/');
});

module.exports = router;