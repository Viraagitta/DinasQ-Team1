const router = require("express").Router();
const UserController = require("../controllers/UserController");

router.post("/register", UserController.registerUser);
router.post("/login", UserController.loginAdmin);
router.get("/users", UserController.getUsers);
router.get("/users/:id", UserController.getUserById);
router.put("/users/:id", UserController.updateUser);
router.delete("/users/:id", UserController.deleteUser);
/* 
Kurang update dan delete. Untuk update dan delete, Super Admin bisa edit semua role termasuk role Admin. Untuk Admin, hanya bisa edit role Staff.
Case di atas butuh authorization
*/
module.exports = router;
