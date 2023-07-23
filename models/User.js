


const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  accountId: {
    type: String,
  },
  password: String,
  phoneNumber: String,
  userType:{
    type:String,
    enum:['customer','busowner','superadmin'],
    default: 'customer'
}
});

module.exports = mongoose.model('User', userSchema);