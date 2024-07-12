const express = require("express");
const router = express.Router();

const { API_ENDPOINT } = require("./constant");
const {
  fetchDataShuttleBussController,
  createShuttleBussController,
  deleteShuttleBusController,
  editShuttleBussController,
  editSeqShuttleBusController,
  editSeqShuttleBusDetailSeqController,
} = require("../controllers/shuttleBussController");
const { shuttlebusValidator } = require("../request/shuttleBuss");
const { busStopValidator } = require("../request/busStop");
const {
  listBussStopControler,
  createBusStopController,
  deleteBusStopController,
  editBusStopController,
  getBussStopControler,
} = require("../controllers/busStopController");
const {
  AuthRegisterController,
  AuthLoginController,
} = require("../controllers/authController");
const { authValidator } = require("../request/auth");
const {
  authenticateAdminToken,
} = require("../middleware/middleware");
const { uploadSingleImageCloudinaryController } = require("../controllers/fileUpload");
const { uploadMulter } = require("../utils/utils");
const { listUserControler } = require("../controllers/UserController");

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

router.post(
  `${API_ENDPOINT}/edit-seq-shuttlebus-detail`,
  authenticateAdminToken,
  editSeqShuttleBusDetailSeqController
);

router.post(`${API_ENDPOINT}/list-bus-stop`, listBussStopControler);
router.post(`${API_ENDPOINT}/list-user`,authenticateAdminToken, listUserControler);

router.post(`${API_ENDPOINT}/get-bus-stop`, getBussStopControler);

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
  AuthRegisterController
);

router.post(`${API_ENDPOINT}/login`, authValidator, AuthLoginController);

router.post(`${API_ENDPOINT}/upload-single-image`, authenticateAdminToken, uploadMulter.single('image'), uploadSingleImageCloudinaryController);

module.exports = router;
