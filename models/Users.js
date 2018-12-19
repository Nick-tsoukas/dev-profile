//Mongo DB with mongoose >> mlab cloud server
const mongoose = require('mongoose');

// Creating schema for the users UserSchema
const Schema = mongoose.Schema;
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  },

  password: {
    type: String,
    required: true
  },

  avatar: {
    type: String
  },

  date: {
    type: Date,
    default: Date.now()
  }

});

// Adding methods the instance of user db document
UserSchema.methods.speak = function () {
  var greeting = `Hello My name is ${this.name}`;
  console.log(greeting);
}
// exporting users model using UserSchema  Exporting as User
module.exports = User = mongoose.model('users', UserSchema);
