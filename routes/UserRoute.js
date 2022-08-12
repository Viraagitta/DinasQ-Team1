const router = require("express").Router();
const UserController = require("../controllers/UserController");
const authentication = require("../middlewares/authentication");
const updateAuthorization = require("../middlewares/UpdateAuthorization");
const deleteAuthorization = require("../middlewares/DeleteAuthorization");

router.post("/register", UserController.registerUser);
router.post("/login", UserController.loginAdmin);
router.post("/login-all", UserController.loginAllUser);
router.use(authentication);

router.get("/users", UserController.getUsers);
router.get("/users/:id", UserController.getUserById);
router.put("/users/:id", updateAuthorization, UserController.updateUser);
router.delete("/users/:id", deleteAuthorization, UserController.deleteUser);

module.exports = router;
