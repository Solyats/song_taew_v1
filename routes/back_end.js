const express = require('express');
const router = express.Router();

const { GetRouteController, fetchDataRoad02Controller, fetchDataRoad03Controller , bus02 } = require('../controllers/routeController');
const { API_ENDPOINT } = require('./constant');

router.get(`${API_ENDPOINT}/get-bus`, GetRouteController);
router.get(`${API_ENDPOINT}/get-path1`, GetRouteController);
router.post(`${API_ENDPOINT}/get-path2`, fetchDataRoad02Controller);
router.post(`${API_ENDPOINT}/get-path2`, fetchDataRoad03Controller);


module.exports = router;
