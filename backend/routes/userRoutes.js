const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authMiddleware } = require("../middleware/auth");

router.post("/",authMiddleware, userController.createUser);
router.get("/",authMiddleware, userController.getUsers);
router.post("/login", userController.loginUser);

module.exports = router;
