const { body } = require("express-validator");

const registerValidator = [
    body('name').notEmpty(),
    body('email').notEmpty().isEmail(),
    body('password').notEmpty(),
]

const loginValidator = [
    body('email').notEmpty().isEmail(),
    body('password').notEmpty()
]

module.exports = {
    registerValidator,
    loginValidator
}