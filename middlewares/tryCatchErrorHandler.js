const tryCatch =  (errorHandler) => {
    return async (req,res,next) => {
        try {
            await errorHandler(req,res,next)
        } catch (error) {
            res.status(500).send({status: "failure", message: "error", error: error.message})
        }
    }
}

module.exports = tryCatch