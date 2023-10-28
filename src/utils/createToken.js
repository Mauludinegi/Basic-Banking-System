const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret_key = process.env.JWT_KEY || 'no_secret';


const createToken = (payload) => {
    return jwt.sign(payload, secret_key);
}

module.exports = createToken;