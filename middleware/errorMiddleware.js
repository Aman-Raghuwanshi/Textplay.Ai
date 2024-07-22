const errorResponse = require('../utils/errorResponse')

const errorHandler = (err, req, res, next) =>{
    let error = {...err}
    error.message = err.message

    //mongoose cast Error
    if(err.name === 'castError'){
        const message = 'Resouces not found'
        error = new errorResponse(message,404)
    }

    //duplicate Key Error
    if(err.code === 11000){
        const message = 'Duplicate field value entered'
        error = new errorResponse(message,400)
    }

    //mongoos validation
    if(err.name = 'ValidationError'){
        const message =Object.values(err.errors).map(val=>val.message)
        error = new errorResponse(message,400)
        res.status(error.statusCode || 500).json({
            success :false,
            error : error.message || 'Server Error'
    });
    }
};

module.exports = errorHandler
