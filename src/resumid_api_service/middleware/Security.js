const dotenv = require("dotenv")
const {API_HEADERS_KEY} = require("../constants/global");

exports.ValidateApiKey = (req, res, next) => {
    const apiKey = req.headers[API_HEADERS_KEY];
    
    if(!apiKey) {
        return res.status(401).json({ message: "API key is missing" });
    }

    if(apiKey != process.env.API_KEY) {
        return res.status(403).json({ message: "Invalid API key" });
    }

    next();
}