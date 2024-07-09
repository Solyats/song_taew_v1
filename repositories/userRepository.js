const db = require("../db/db");

const getUserByUsernameWithPasswordRepository = async (username) => {
  try {
    const result = await db
      .select(
        "id",
        "username",
        "password",
        "role",
        "status",
        "created_at",
        "updated_at",
        "update_by"
      )
      .from("tbl_users")
      .where("username", username);

    return { data: result, error: null };
  } catch (err) {
    console.log("🚀 ~ getUserByUsernameRepository ~ err:", err);
    return { data: null, error: err };
  }
};

const insertUserRepository = async (user) => {
  try {
    const result = await db("tbl_users").insert(user);

    return { data: result, error: null };
  } catch (err) {
    console.log("🚀 ~ insertUserRepository ~ err:", err);
    return { data: null, error: err };
  }
};

const checkIsHaveUserRepository = async () => {
  try {
    const result = await db
      .select(
        "id",
        "username",
        "password",
        "role",
        "status",
        "created_at",
        "updated_at",
        "update_by"
      )
      .from("tbl_users");

    return { data: result, error: null };
  } catch (err) {
    console.log("🚀 ~ checkIsHaveUserRepository ~ err:", err);
    return { data: null, error: err };
  }
};

module.exports = {
  getUserByUsernameWithPasswordRepository,
  insertUserRepository,
  checkIsHaveUserRepository,
};
