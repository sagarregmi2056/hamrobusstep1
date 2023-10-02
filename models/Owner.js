const mongoose = require("mongoose");
const { v1 } = require("uuid");
const crypto = require("crypto");

const ownerSchema = new mongoose.Schema(
  {
  //  part one  for the registration
  // phone number double xa hai 



  // personal details 

    travelName:{
      type: String,
      trim: true,
      maxlength: 32,

    },


    pincode:{
      type: String,
      trim: true,
      maxlength: 32,
    },

    state: {
      type: String,
      maxlength: 30,
      
    },

    city: {
      type: String,
      maxlength: 30,
    
    },

    phone: {
      type: Number,
      max: 9999999999,
      maxlength: 30,
      
     
    },

    email: {
      type: String,
      trim: true,
     
    },


    name: {
      type: String,
      trim: true,
     
      maxlength: 32,
    },


    country:{
      type: String,
      maxlength: 32,
      trim: true,
     

    },

    
    district: {
      type: String,
      maxlength: 30,
      trim: true,
      
    },


    // bank details 
    bankName:{
      type: String,
      maxlength: 70,
      trim: true,
     
    
     
    },
    accountNumber:{
      type: String,
      maxlength: 70,
      
    },
    beneficaryName:{
      type: String,
      maxlength: 70,
    
    },

    bankaccountType:{
      type: String,
      maxlength: 70,
   
    },
    
    citizenshipNumber: {
      type: String,
      trim: true,
     
      maxlength: 32,
    },
    // pancard details step 3
    panName:{
      type: String,
      maxlength: 70,
     
    
    },
    panAddress:{
      type: String,
      maxlength: 70,
      
    },
    issuedate:{
     
        type: String,
        maxlength: 30,
       
      
    },
    dateofbirth:{
      
        type: String,
        maxlength: 30,
       
      
    },



   
    isVerified: {
      type: Boolean,
      default: false,
    },
   
    hashed_password: {
      type: String,
      required: true,
    },

    //  document requirements haru
    nationalID: {
      type: String,
     
      
    },

    DriverLisence: {
      type: String,
     
    },

    citizenship: {
      type: String,
   
    },

    pancard: {
      type: String,
     
    },

    photo: {
      type: String,
     
    },

    // yaha chai addition requirements haru
    businessBackground: {
      type: String,
      trim: true,
     
      maxlength: 200,
    },
    
    postalCode: {
      type: String,
      maxlength: 10,
     
    },
  
   
    optionalEmailid: {
      type: String,
    },
    panNumber: {
      type: String,
      maxlength: 30,
      
    },

    salt: String,
    role: {
      type: String,
      enum: ["owner", "superadmin"],
      default: "owner",
    },
  },
  { timestamps: true }
);

// virtual field
ownerSchema
  .virtual("password")
  .set(function (password) {
    // create temporary variable called _password
    this._password = password;
    // generate a timestamp
    this.salt = v1();
    // encryptPassword()
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

// methods
ownerSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  encryptPassword: function (password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
};

module.exports = mongoose.model("Owner", ownerSchema);
