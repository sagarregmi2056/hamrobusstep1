module.exports = {
  runEveryMidnight: require("./misc").runEveryMidnight,
  checkDateAvailability: require("./misc").checkDateAvailability,
  errorHandler: require("./dbErrorHandler").errorHandler,
  uploadBusImage: require("./multer").uploadBusImage,
  uploadOwnerAvatar: require("./multer").uploadOwnerAvatar,

  uploadnationalID: require("./multer").uploadnationalID,
  uploadCitizenshipimages: require("./multer").uploadCitizenshipimages,
  uploaddriverlisence: require("./multer").uploaddriverlisence,
  uploadpancard: require("./multer").uploadpancard,
  uploadprofilepic: require("./multer").uploadprofilepic,
  uploademployecitizenship: require("./multer").uploademployecitizenship,

  // uploadowner: require("./multer").uploadowner,

  sendEmail: require("./mailer").sendEmail,
  dbConnection: require("./dbConnection"),

  uploadinsideBusImage: require("./multer").uploadinsideBusImage,
};
