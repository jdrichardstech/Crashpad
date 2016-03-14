var Pad = require ('../models/Pad');





module.exports = {


	get: function(params, completion){
		Pad.find(params, function(err, pads){

			if(err){
				completion(err, null);
				return;
			}

			var list=[];
			for(i = 0; i < pads.length; i++){
				var pad = pads[i];
				list.push(pad.summary());
			}

			completion(null, list);
			return;

		});
		return;
	},

	getById: function(id, completion){
		Pad.findById(id, function(err, pad){
			if(err){
				
				completion({message:'Pad ' + id + ' not found'}, null);
				return;
			}

			if(pad == null){
				var error = {message: 'Pad not found'}
				completion(error, null);
				return;
			}


			completion(null, pad.summary());
			return;
		});
	},


	post: function(params, completion){
		Pad.create(params, function(err, pad){
			if(err){
				completion(err, null);
			}
			completion(null, pad.summary());
			return;
		});
		return;
	},


	put: function(id, params, completion){
		Pad.findByIdAndUpdate(id, params, {new:true}, function(err, pad){
			if(err){
				completion(err, null);
			}
			completion(null, pad.summary());
			return;
		});
	}
}


