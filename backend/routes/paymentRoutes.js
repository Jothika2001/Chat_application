const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const { authMiddleware } = require("../middleware/auth");

router.post("/",authMiddleware, paymentController.createPayment);
router.get("/with-user",authMiddleware, paymentController.getPaymentsWithUser);

module.exports = router;
