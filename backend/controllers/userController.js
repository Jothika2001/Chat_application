const User = require("../models/User");
const jwt = require("jsonwebtoken");


// ✅ Create User
exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get All Users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { name } = req.body;

    const user = await User.findOne({ name });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // ✅ Create JWT Token
    const token = jwt.sign(
      {
        id: user._id,
        name: user.name
      },
      "SECRET_KEY", // 🔥 move to .env later
      {
        expiresIn: "1d"
      }
    );

    // ✅ Send user + token
    res.json({
      user,
      token
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};