const router = require("express").Router();
const UserController = require("../controllers/UserController");
const updateAuthorization = require("../middlewares/UpdateUserAuthorization");
const deleteAuthorization = require("../middlewares/DeleteAuthorization");

router.get("/usersdetails", UserController.getAllUsersDetails);
//fetch all users details including official letter, reimbursement
router.get("/users", UserController.getUsers);
//fetch all users only
router.get("/users/:id", UserController.getUserById);
//fetch user by id
router.put("/users/:id", updateAuthorization, UserController.updateUser);
//update user by id
router.delete("/users/:id", deleteAuthorization, UserController.deleteUser);
//delete user by id

module.exports = router;
