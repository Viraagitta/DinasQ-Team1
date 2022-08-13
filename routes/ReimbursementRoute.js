const router = require("express").Router();
const ReimbursementController = require("../controllers/ReimbursementController");

router.get("/reimbursements", ReimbursementController.getReimbursements);
router.get("/reimbursements/:id", ReimbursementController.getReimbursementById);
router.post("/reimbursements", ReimbursementController.createReimbursement);
module.exports = router;
