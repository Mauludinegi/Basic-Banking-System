const express = require('express'),
    router = express.Router(),
    controller = require('../../controller'),
    validate = require('../../middlewares/validate'),
    schema = require('../../validatorSchema/authValidatorSchema'),
    checkToken = require('../../middlewares/checkToken')

router.post('/auth/register', validate(schema.registerValidator), controller.authController.register);
router.post('/auth/login', validate(schema.loginValidator), controller.authController.login);
router.get('/auth/authenticate', checkToken, controller.authController.profile);


module.exports = router;