const { getUserListRepository } = require("../repositories/userRepository");

const listUserControler = async (req, res) => {
  try {
    const datas = await getUserListRepository();

    return res.status(200).json({ status: 200, data: datas?.data });
  } catch (err) {
    console.log("🚀 ~ listUserControler ~ err:", err);
    return res.status(500).json({ status: 500, error: err });
  }
};

module.exports = {
  listUserControler,
};
