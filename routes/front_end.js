const express = require('express');
const router = express.Router();

const cssPath =""

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/shuttlehome', (req, res) => {
  res.render('shuttlehome');
});

router.get('/admin_create_shuttle_bus', (req, res) => {
  res.render('admin_create_shuttle_bus');
});

module.exports = router;
