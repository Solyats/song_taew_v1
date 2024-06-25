const { v4: uuidv4 } = require('uuid');

const newUUID = () => {
  return uuidv4();
};

module.exports = {
  newUUID,
};