const express = require('express');
const router = express.Router();
const controller = require("../../controller/index");
const checkToken = require("../../middleware/checkToken");


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

router.post('/auth/register', controller.userController.registerUser);
router.post('/auth/login',controller.userController.loginUser);
router.get('/auth/authenticate', checkToken, controller.userController.getProfile);

module.exports = router;