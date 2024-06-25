const express = require("express");
const router = express.Router();

const { API_ENDPOINT } = require("./constant");
const {
  fetchDataShuttleBussController,
  createShuttleBussController,
  deleteShuttleBusController,
  editShuttleBussController,
} = require("../controllers/shuttleBussController");
const { shuttlebusValidator } = require("../request/shuttleBuss");
const { busStopValidator } = require("../request/busStop");
const { listBussStopControler, createBusStopController, deleteBusStopController, editBusStopController } = require("../controllers/busStopController");

router.post(`${API_ENDPOINT}/fetch-shuttlebus`, fetchDataShuttleBussController);
router.post(
  `${API_ENDPOINT}/create-shuttlebus`,
  shuttlebusValidator,
  createShuttleBussController
);
router.post(
  `${API_ENDPOINT}/delete-shuttlebus`,
  deleteShuttleBusController
);
router.post(
  `${API_ENDPOINT}/edit-shuttlebus`,
  shuttlebusValidator,
  editShuttleBussController
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

router.post(
  `${API_ENDPOINT}/delete-bus-stop`,
  deleteBusStopController
);

router.post(
  `${API_ENDPOINT}/edit-bus-stop`,
   busStopValidator,
  editBusStopController
);

module.exports = router;
