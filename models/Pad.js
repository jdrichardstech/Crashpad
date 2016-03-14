var mongoose = require('mongoose');

var PadSchema = new mongoose.Schema({
	owner: {type:String,trim:true,lowercase:true, default:''},
	address: {type:String, trim:true,lowercase:true,default:''},
	city: {type:String, trim:true,lowercase:true,default:''},
	state: {type:String,trim:true, lowercase:true,default: ''},
	zip: {type:String,trim:true, lowercase:true,default: ''},
	rate: {type:Number, default: 0}

});



PadSchema.methods.summary = function() {
	
	var profileDetails = {
		'owner': this.owner,
		'address': this.address,
		'city': this.city,
		'state': this.state,
		'zip': this.zip,
		'rate': this.rate,
		'id': this._id

	};

	return profileDetails;

};

module.exports = mongoose.model('PadSchema', PadSchema);