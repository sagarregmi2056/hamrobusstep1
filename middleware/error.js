const ErrorResponse = require("../utils/ErrorResponse");

const errorHandler =(err,req,res,next)=>{
    let error = {...err};
    error.message = err.message;
    if(err.name ==="CastError"){
        const message = `Resource not found ${err.value}`;
        error = new ErrorResponse(message,404);

    }
     //Mongoose duplicate value
    if(err.name ===11000){
        const message = "Duplicate field value entered";
        error = new ErrorResponse(message,404);
    }

    
    //Mongoose validation error
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors).map(val => ' ' + val.message);
        error = new ErrorResponse(message, 400);
    }

    res.status(error.codestatus || 500).json({
        success: false,
        error: error.message || "server error"
    })
}
module.exports = errorHandler;