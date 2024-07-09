
const cloudinary = require("../db/cloudinary");

const uploadSingleImageCloudinaryController = async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path);

        const data = {
            name: result.original_filename,
            url: result?.url
        }

    return res.status(200).json({ status: 200, data: data });
  } catch (err) {
    console.log("🚀 ~ uploadImageCloudinary ~ err:", err);
    return res.status(500).json({ status: 500, error: err });
  }
};

module.exports = {
    uploadSingleImageCloudinaryController
};
