const express = require("express");
const router = express.Router();
const controller = require('../../controller/index');

router.post('/accounts', controller.accountsController.createAccount);
router.get('/accounts', controller.accountsController.getAllAccounts);
router.get('/accounts/:accountId', controller.accountsController.getAccountById)
router.put('/accounts/:accountId', controller.accountsController.updateAccountById)
router.delete('/accounts/:accountId', controller.accountsController.deleteAccountById)

module.exports = router;