const express = require('express');
const router = express.Router();
const controller = require("../../controller/index");

router.post('/transactions', controller.transactionController.createTransactions);
router.get("/transactions", controller.transactionController.getAllTransactions);
router.get("/transactions/:transactionId", controller.transactionController.getTransactionsById);
router.delete("/transactions/:transactionId", controller.transactionController.deleteTransactionsById);

module.exports = router;