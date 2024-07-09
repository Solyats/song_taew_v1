const { validationResult } = require("express-validator");
const { newUUID, currentEpochTimeMilli } = require("../utils/utils");
const {
  getUserByUsernameWithPasswordRepository,
  insertUserRepository,
} = require("../repositories/userRepository");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const AuthRegisterController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: 400, error: errors.array() });
  }

  const data = req.body;
  try {
    const getUsername = await getUserByUsernameWithPasswordRepository(data?.username);

    if (getUsername.error !== null) {
      return res.status(500).json({ status: 500, error: data.error });
    }

    if (getUsername?.data.length > 0) {
      return res
        .status(400)
        .json({ status: 500, error: "username_already_exist" });
    }

    const userID = newUUID();
    const currentEpochTime = currentEpochTimeMilli();
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const bodyJSON = {
      id: userID,
      username: data.username,
      password: hashedPassword,
      role: "ADMIN",
      status: true,
      created_at: currentEpochTime,
      updated_at: currentEpochTime,
      update_by: "SYSTEM",
    };

    const insertResult = await insertUserRepository(bodyJSON);

    if (insertResult.error !== null) {
      return res.status(500).json({ status: 500, error: data.error });
    }

    return res.status(200).json({ status: 200, data: null });
  } catch (err) {
    console.log("🚀 ~ GetRouteController ~ err:", err);
    return res.status(500).json({ status: 500, error: err });
  }
};

const AuthLoginController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: 400, error: errors.array() });
  }

  const data = req.body;
  try {
    const getUsername = await getUserByUsernameWithPasswordRepository(data.username);

    if (getUsername.error !== null) {
      return res.status(500).json({ status: 500, error: getUsername.error });
    }

    if (getUsername.data.length === 0) {
      return res.status(400).json({ status: 400, error: "invalid_username" });
    }

    const user = getUsername.data[0];
    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ status: 400, error: "invalid_password" });
    }

    if (user?.status === 0) {
      return res.status(400).json({ status: 400, error: "user_got_banned" });
    }

    const tokenExp = process.env.TOKEN_EXPIRES
      ? process.env.TOKEN_EXPIRES
      : "1h";
    const secretKey = process.env.SECRET_TOKEN_KEY
      ? process.env.SECRET_TOKEN_KEY
      : "asdsaddsaddsa2222";

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user?.role },
      secretKey,
      {
        expiresIn: tokenExp,
      }
    );

    res.cookie("token", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000,
      path: "/"
    });

    return res.status(200).json({ status: 200, message: "Login successful", token: token });
  } catch (err) {
    console.log("🚀 ~ AuthLoginController ~ err:", err);
    return res.status(500).json({ status: 500, error: err.message });
  }
};

module.exports = {
  AuthRegisterController,
  AuthLoginController,
};
