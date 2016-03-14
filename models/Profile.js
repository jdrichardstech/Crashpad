var mongoose = require('mongoose');

var ProfileSchema = new mongoose.Schema({
	firstName: {type:String,trim:true,lowercase:true, default:''},
	lastName: {type:String, trim:true,lowercase:true,default:''},
	city: {type:String, trim:true,lowercase:true,default:''},
	state: {type:String,trim:true, lowercase:true,default: ''},
	zip: {type:String,trim:true, lowercase:true,default: ''},
	email:{type:String, trim:true,lowercase:true,default: ''},
	password:{type:String, default: ''}
	

});



ProfileSchema.methods.summary = function() {
	
	var profileDetails = {
		'firstName': this.firstName,
		'lastName': this.lastName,
		'city': this.city,
		'state': this.state,
		'zip': this.zip,
		'email': this.email,
		'id': this._id

	};

	return profileDetails;

};

module.exports = mongoose.model('ProfileSchema', ProfileSchema);