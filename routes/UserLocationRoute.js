const router = require("express").Router();
const UserLocationController = require("../controllers/UserLocationController");

router.post("/locations", UserLocationController.checkInUser);
// create new location (absent)
router.get(
  "/location-history",
  UserLocationController.locationHistoryOfOneUser
);
// get all locations history of logged in user
router.get("/locations", UserLocationController.lastLocationAllUser);
// get all locations of all users
module.exports = router;
