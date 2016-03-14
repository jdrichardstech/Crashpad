var express = require('express');
var router = express.Router();
var ProfileController = require('../controllers/ProfileController');
var PadController = require('../controllers/PadController');
var bcrypt = require('bcrypt');
var controllers = {
	'profile': ProfileController,
	'pad': PadController
}

//HELPER FUNCTION FOR ERROR
function createErrorObject(msg){
	var error = {
		confirmation: 'fail',
		message: msg
	}
	return error;
}

/* GET home page. */
router.get('/:resource', function(req, res, next) {
	var resource = req.params.resource;
	var controller = controllers[resource];

	if(resource == 'logout'){
		req.session.reset();
		res.json({
			confirmation: 'You have logged out'
		});
		return;
	}

	if(resource == 'currentuser'){
		if(req.session == null){
			res.json(createErrorObject('User not logged in'));
			return;
		}

		if(req.session.user == null){
			res.json(createErrorObject('Oops User not logged in'));
			return;
		}

		ProfileController.getById(req.session.user, function(err, result){
			if(err){
				res.json(createErrorObject(err.message));
				return;
			}

			res.json({
				confirmation: 'success',
				currentuser: result
			})
		});

		return;
	}

	if(controller == null){
		res.json(createErrorObject(resource + 'is not a valid resource'));
		return;
	}
		//AVOID ACCOUNT ROUTE ACCESS TO 
		// controller.get(req.query, function(err, results){
		// 	if(err){
		// 		res.json(createErrorObject(err.message));
		// 		return;
		// 	}

		// 	res.json({
		// 		confirmation: 'success',
		// 		results: results
		// 	});
		// 	return;
		// });
		res.json({
			confirmation: 'fail',
			message: "invalid Action:" + resource
		});
		return;
});


router.post('/:resource', function(req, res, next){
	var resource = req.params.resource;
	var controller = controllers[resource];


	if(resource == 'login'){
		var loginCredentials = req.body;
		var email = loginCredentials.email;

		//find profile with that email
		ProfileController.getRawProfiles({email:email}, function(err, results){
			if(err){
				res.json(createErrorObject(err.message));
				return;
			}

			if(results.length == 0){
				res.json(createErrorObject('User not found'));
				return;
			}

			var user = results[0];

			//THIS CHECKS THE PASSWORD BEFORE ENCRYPTION
			// if(loginCredentials.password != user.password){
			// 	res.json(createErrorObject('Incorrect password'));
			// 	return;
			// }


			var passwordCorrect = bcrypt.compareSync(loginCredentials.password, user.password);
			if(passwordCorrect == false){
				res.json(createErrorObject('Incorrect password'));
				return;
			}	
			

			//INSTALLS COOKIE
			req.session.user = user._id;

			res.json({
				confirmation:'success',
				profile: user.summary()
			});

			return;
		});
		return;
	}

	if(controller == null){
		res.json(createErrorObject('Invalid request'));
		return;
	}
	
		controller.post(req.body, function(err, result){
			if(err){
				res.json(createErrorObject(err.message));
				return;
			}

			if(resource == 'profile'){
				req.session.user = result.id;
			}

			res.json({
				confirmation: 'success',
				result: result
			});
			return;
		});
		return;
	
});


module.exports = router;