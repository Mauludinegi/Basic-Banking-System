const express = require("express");
const userRoutes = require("./userRoutes/route");
const bankAccountRoutes = require("./accountRoutes/route");
const transactionsRoutes = require("./transactionRoutes/route")
const authRoutes = require('./userRoutes/auth')

const router = express.Router();


router.use("/api/v1", authRoutes)
router.use("/api/v1", userRoutes);
router.use("/api/v1", bankAccountRoutes);
router.use("/api/v1", transactionsRoutes);



module.exports = router;
