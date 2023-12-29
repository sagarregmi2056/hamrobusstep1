const mongoose = require("mongoose");
const { v1 } = require("uuid");
const crypto = require("crypto");

const departmentSchema = new mongoose.Schema(
  {
    // personal details
    name: {
      type: String,
      trim: true,
      maxlength: 32,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 255,
    },
    mobileNumber: {
      type: String,
      trim: true,
      maxlength: 32,
    },
    zipcode: {
      type: String,
      trim: true,
    },
    district: {
      type: String,
      trim: true,
      maxlength: 32,
    },
    city: {
      type: String,
      trim: true,
      maxlength: 32,
    },
    address: {
      type: String,
      trim: true,
      maxlength: 32,
    },
    // documents
    documents: [
      {
        type: {
          type: String,
          required: true,
        },
        url: String,
      },
    ],
    // bank details

    bankName: {
      type: String,
      trim: true,
    },
    beneficiaryName: {
      type: String,
      trim: true,
    },
    accountNumber: {
      type: String,
      trim: true,
    },
    accountType: {
      type: String,
      trim: true,
    },

    departmentId: {
      type: String,
      unique: true,
    },

    hashed_password: {
      type: String,
    },
    salt: String,
    role: {
      type: String,
      enum: [
        "maintenancedepartment",
        "trainingdepartment",
        "supportdepartment",
        "accountdepartment",
      ],
      default: "Trainingdepartment",
    },
  },
  { timestamps: true }
);

// virtual field
departmentSchema
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
departmentSchema.methods = {
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

module.exports = mongoose.model("Department", departmentSchema);
