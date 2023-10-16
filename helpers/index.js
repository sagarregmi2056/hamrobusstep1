module.exports = {
    runEveryMidnight: require("./misc").runEveryMidnight,
    checkDateAvailability: require("./misc").checkDateAvailability,
    errorHandler: require("./dbErrorHandler").errorHandler,
    uploadBusImage: require("./multer").uploadBusImage,
    uploadOwnerAvatar: require("./multer").uploadOwnerAvatar,

    uploadnationalID: require("./multer").uploadnationalID,
    uploadCitizenshipimage: require("./multer").uploadCitizenshipimage,
    uploaddriverlisence: require("./multer").uploaddriverlisence,
    uploadpancard: require("./multer").uploadpancard,
    
    sendEmail: require("./mailer").sendEmail,
    dbConnection: require("./dbConnection"),
}