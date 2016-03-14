var Profile = require ('../models/Profile');

//import encryption file
var bcrypt = require('bcrypt');





module.exports = {



	getRawProfiles: function(params, completion){
		Profile.find(params, function(err, profiles){

			if(err){
				completion(err, null);
				return;
			}
			completion(null, profiles);
			return;

		});
		return;
	},

	get: function(params, completion){
		Profile.find(params, function(err, profiles){

			if(err){
				completion(err, null);
				return;
			}

			var list=[];
			for(i = 0; i < profiles.length; i++){
				var profile = profiles[i];
				list.push(profile.summary());
			}

			completion(null, list);
			return;

		});
		return;
	},

	getById: function(id, completion){
		Profile.findById(id, function(err, profile){
			if(err){
				
				completion({message:'Profile ' + id + ' not found'}, null);
				return;
			}

			if(profile == null){
				var error = {message: 'Profile not found'}
				completion(error, null);
				return;
			}


			completion(null, profile.summary());
			return;
		});
	},


	post: function(params, completion){

		//hash the password
		var plainTextPassword = params['password'];
		var hashedPassword = bcrypt.hashSync(plainTextPassword, 10);
		params['password'] = hashedPassword;

		Profile.create(params, function(err, profile){
			if(err){
				completion(err, null);
			}
			completion(null, profile.summary());
			return;
		});
		return;
	},


	put: function(id, params, completion){
		Profile.findByIdAndUpdate(id, params, {new:true}, function(err, profile){
			if(err){
				completion(err, null);
			}
			completion(null, profile.summary());
			return;
		});
	}
}


