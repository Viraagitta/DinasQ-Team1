const router = require("express").Router();
const UserController = require("../controllers/UserController");
const authentication = require("../middlewares/authentication");
const UserRoutes = require("./UserRoute");
const LetterRoutes = require("./LetterRoute");
const ReimbursementRoutes = require("./ReimbursementRoute");

router.post("/register", UserController.registerUser);
//register
router.post("/login", UserController.loginAdmin);
//login dashboard admin
router.post("/login-all", UserController.loginAllUser);
//login mobile

router.use(authentication);
router.use(UserRoutes);
router.use(LetterRoutes);
router.use(ReimbursementRoutes);

module.exports = router;
