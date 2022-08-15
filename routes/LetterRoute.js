const router = require("express").Router();
const OfficialLetterController = require("../controllers/OfficialLetterController");

router.get("/officialletters", OfficialLetterController.getAllOfficialLetter);
// get all official letters
router.get(
  "/officialletters/:id",
  OfficialLetterController.getOfficialLetterById
);
// get official letter by id
router.get(
  "/logged-in-letter",
  OfficialLetterController.loggedInOfficialLetter
);
// get logged in user's official letter
router.post("/officialletters", OfficialLetterController.createOfficialLetter);
// create new official letter
router.patch(
  "/officialletters/:id",
  OfficialLetterController.updateStatusLetter
);
// update official letter status

module.exports = router;
