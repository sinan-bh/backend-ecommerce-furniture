
const errorHandler = async (err,req,res,next) => {
    const errStatus = req.statuCode || 500
    const errMessage = err.message || "error"    
    res.status(errStatus).send({
        status: errStatus,
        errMessage: errMessage,
    })
}

module.exports = errorHandler