const express = require('express');
const router = express.Router();
const controller = require("../../controller/index");


// Menambahkan data
router.post('/users', controller.userController.registerUser)
// Mengambil semua data
router.get('/users', controller.userController.getAllUser)
// Mengambil data berdasarkan id
router.get('/users/:userId', controller.userController.getUserById)
// Mengubah data berdasarkan id
router.put('/users/:userId', controller.userController.updateUserByid)
// Menghapus data berdasarkan id
router.delete('/users/:userId', controller.userController.deleteUserById)

module.exports = router;