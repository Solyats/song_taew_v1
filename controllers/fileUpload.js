
const cloudinary = require("../db/cloudinary");

const uploadSingleImageCloudinaryController = async (req, res) => {
    try {
    const result = await cloudinary.uploader.upload(req.file.path);
    return res.status(200).json({ status: 200, url: result?.url });
  } catch (err) {
    console.log("🚀 ~ uploadImageCloudinary ~ err:", err);
    return res.status(500).json({ status: 500, error: err });
  }
};

module.exports = {
    uploadSingleImageCloudinaryController
};
