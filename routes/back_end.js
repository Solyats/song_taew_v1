const express = require('express');
const router = express.Router();
const { API_ENDPOINT } = require('./constant');
const { fetchDataShuttleBussController } = require('../controllers/shuttleBUssController');

router.post(`${API_ENDPOINT}/fetch-shuttlebus`, fetchDataShuttleBussController);


module.exports = router;
