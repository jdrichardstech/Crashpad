var express = require('express');
var router = express.Router();
var ProfileController = require('../controllers/ProfileController');
var PadController = require('../controllers/PadController');
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

	if(controller == null){
		res.json(createErrorObject(resource + 'is not a valid resource'));
		return;
	}

		controller.get(req.query, function(err, results){
			if(err){
				res.json(createErrorObject(err.message));
				return;
			}

			res.json({
				confirmation: 'success',
				results: results
			});
			return;
		});
		return;
});

router.get('/:resource/:id', function(req, res, next) {
	var resource = req.params.resource;
	var controller = controllers[resource];

	if(controller == null){
		res.json(createErrorObject(resource + ' is not a valid resource'));
	}

	
		controller.getById(req.params.id, function(err, result){
			if(err){
				res.json(createErrorObject(err.message));
				return;
			}

			res.json({
				confirmation: 'success',
				result: result
			});
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
			if(loginCredentials.password != user.password){
				res.json(createErrorObject('Incorrect password'));
				return;
			}
			//user logged in

			//install cookie here before confirmation
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

			// if(resource == 'profile'){
			// 	req.session.user = result.id;
			// }

			res.json({
				confirmation: 'success',
				result: result
			});
			return;
		});
		return;
	
});

router.put('/:resource/:id', function(req, res, next){
		var resource = req.params.resource;
		var controller = controllers[resource];

	if(controller == null){
		res.json(createErrorObject('Invalid request'));
	}
		
		controller.put(req.params.id, req.body, function(err, result){
			if(err){
			res.json(createErrorObject(err.message));
			return;
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
