const Payment = require("../models/Payment");

// ✅ Create Payment
exports.createPayment = async (req, res) => {
  try {
    const { userId, amount, paymentMethod } = req.body;

    if (!userId || !amount) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const data = await Payment.create({
      userId,
      amount,
      paymentMethod: paymentMethod || "UPI"
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPaymentsWithUser = async (req, res) => {
  try {
    const data = await Payment.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" }
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
