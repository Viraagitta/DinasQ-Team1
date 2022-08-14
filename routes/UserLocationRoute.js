const router = require('express').Router();
const UserLocationController = require('../controllers/UserLocationController');

router.post("/locations", UserLocationController.checkInUser)

module.exports = router