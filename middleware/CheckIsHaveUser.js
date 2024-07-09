const { checkIsHaveUserRepository } = require("../repositories/userRepository");

const CheckIsHaveUser = async (req, res, next) => {
  try {
    const getUser = await checkIsHaveUserRepository();

    if (getUser.error !== null) {
      return next();
    }

    if (getUser?.data.length > 0) {
      req.errorHaveUser = "already_exist"
      return next();
    }

    next();
  } catch (err) {
    console.log("🚀 ~ CheckIsHaveUser ~ error:", err);
    next();
  }
};

module.exports = {
  CheckIsHaveUser,
};
