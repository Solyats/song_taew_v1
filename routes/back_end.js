const express = require("express");
const router = express.Router();

const { API_ENDPOINT } = require("./constant");
const {
  fetchDataShuttleBussController,
  createShuttleBussController,
} = require("../controllers/shuttleBUssController");
const { shuttlebusValidator } = require("../request/shuttleBuss");

router.post(`${API_ENDPOINT}/fetch-shuttlebus`, fetchDataShuttleBussController);
router.post(
  `${API_ENDPOINT}/create-shuttlebus`,
  shuttlebusValidator,
  createShuttleBussController
);

module.exports = router;
