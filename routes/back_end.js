const express = require("express");
const router = express.Router();

const { API_ENDPOINT } = require("./constant");
const {
  fetchDataShuttleBussController,
  createShuttleBussController,
} = require("../controllers/shuttleBussController");
const { shuttlebusValidator } = require("../request/shuttleBuss");
const { busStopValidator } = require("../request/busStop");
const { listBussStopControler, createBusStopController } = require("../controllers/busStopController");

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

router.post(
  `${API_ENDPOINT}/create-bus-stop`,
  busStopValidator,
  createBusStopController
);

module.exports = router;
