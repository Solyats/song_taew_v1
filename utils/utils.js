const { v4: uuidv4 } = require('uuid');

const newUUID = () => {
  return uuidv4();
};

const currentEpochTimeMilli = () => {
  return Date.now(); 
};

module.exports = {
  newUUID,
  currentEpochTimeMilli
};