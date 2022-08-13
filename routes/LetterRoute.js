const router = require("express").Router();
const OfficialLetterController = require("../controllers/OfficialLetterController");

router.get("/officialletters", OfficialLetterController.getAllOfficialLetter);
router.get(
  "/officialletters/:id",
  OfficialLetterController.getOfficialLetterById
);
router.post("/officialletters", OfficialLetterController.createOfficialLetter);

module.exports = router