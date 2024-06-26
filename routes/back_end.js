const express = require("express");
const router = express.Router();

const { API_ENDPOINT } = require("./constant");
const {
  fetchDataShuttleBussController,
  createShuttleBussController,
  deleteShuttleBusController,
  editShuttleBussController,
  editSeqShuttleBusController,
} = require("../controllers/shuttleBussController");
const { shuttlebusValidator } = require("../request/shuttleBuss");
const { busStopValidator } = require("../request/busStop");
const {
  listBussStopControler,
  createBusStopController,
  deleteBusStopController,
  editBusStopController,
} = require("../controllers/busStopController");
const {
  AuthRegisterController,
  AuthLoginController,
} = require("../controllers/authController");
const { authValidator } = require("../request/auth");
const {
  authenticateAdminToken,
} = require("../middleware/middleware");

router.post(`${API_ENDPOINT}/fetch-shuttlebus`, fetchDataShuttleBussController);
router.post(
  `${API_ENDPOINT}/create-shuttlebus`,
  shuttlebusValidator,
  authenticateAdminToken,
  createShuttleBussController
);
router.post(
  `${API_ENDPOINT}/delete-shuttlebus`,
  authenticateAdminToken,
  deleteShuttleBusController
);
router.post(
  `${API_ENDPOINT}/edit-shuttlebus`,
  shuttlebusValidator,
  authenticateAdminToken,
  editShuttleBussController
);

router.post(
  `${API_ENDPOINT}/edit-seq-shuttlebus`,
  authenticateAdminToken,
  editSeqShuttleBusController
);

router.post(`${API_ENDPOINT}/list-bus-stop`, listBussStopControler);

router.post(
  `${API_ENDPOINT}/create-bus-stop`,
  busStopValidator,
  authenticateAdminToken,
  createBusStopController
);

router.post(
  `${API_ENDPOINT}/delete-bus-stop`,
  authenticateAdminToken,
  deleteBusStopController
);

router.post(
  `${API_ENDPOINT}/edit-bus-stop`,
  busStopValidator,
  authenticateAdminToken,
  editBusStopController
);

router.post(
  `${API_ENDPOINT}/register`,
  authValidator,
  authenticateAdminToken,
  AuthRegisterController
);

router.post(`${API_ENDPOINT}/login`, authValidator, AuthLoginController);

module.exports = router;
