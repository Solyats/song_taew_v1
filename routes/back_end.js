const express = require("express");
const router = express.Router();

const { API_ENDPOINT } = require("./constant");
const {
  fetchDataShuttleBussController,
  createShuttleBussController,
  listBussStopControler,
} = require("../controllers/shuttleBussController");
const { shuttlebusValidator } = require("../request/shuttleBuss");

router.post(`${API_ENDPOINT}/fetch-shuttlebus`, fetchDataShuttleBussController);
router.post(
  `${API_ENDPOINT}/create-shuttlebus`,
  shuttlebusValidator,
  createShuttleBussController
);
router.post(
  `${API_ENDPOINT}/list-bus-stop`,
  listBussStopControler
);

module.exports = router;
