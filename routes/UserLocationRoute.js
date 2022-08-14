const router = require("express").Router();
const UserLocationController = require("../controllers/UserLocationController");

router.post("/locations", UserLocationController.checkInUser);
router.get("/location-history", UserLocationController.locationHistoryOfOneUser);
router.get("/locations", UserLocationController.lastLocationAllUser)
module.exports = router;
