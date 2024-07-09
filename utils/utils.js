const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const path = require('path');

const newUUID = () => {
  return uuidv4();
};

const currentEpochTimeMilli = () => {
  return Date.now(); 
};

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    const uniqueName = uuidv4() + path.extname(file.originalname); // Generate unique filename with uuid
    cb(null, uniqueName);
  }
});

const uploadMulter = multer({ storage });

module.exports = {
  newUUID,
  currentEpochTimeMilli,
  uploadMulter
};