const userController = require('./users/userController');
const accountsController = require('./accounts/accountsController');
const transactionController = require("./transactions/transactionController");
const authController = require('./users/authController');

module.exports = {
    userController,
    accountsController,
    transactionController,
    authController
};
