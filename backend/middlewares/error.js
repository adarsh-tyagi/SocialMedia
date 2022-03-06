const ErrorHandler = require("../utils/errorHandler")

// error Middleware
module.exports = async (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.message = err.message || "Internal Server Error"

    // wrong mongodb id
    if (err.name === "CastError") {
        const message = `Resource not found. Invalid ${err.path}`
        err = new ErrorHandler(message, 400)
    }

    // mongoose duplicate key error
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`
        err = new ErrorHandler(message, 400)
    }

    // invalid jwt error
    if (err.name === "JsonWebTokenError") {
        const message = "Please login to access the resource"
        err = new ErrorHandler(message, 401)
    }

    // jwt expire error
    if (err.name === "TokenExpiredError") {
        const message = "Please login to access the resource"
        err = new ErrorHandler(message, 401)
    }

    res.status(err.statusCode).json({success: false, message: err.message})
}   