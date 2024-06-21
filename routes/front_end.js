const express = require('express');
const router = express.Router();

const cssPath =""

router.get('/', (req, res) => {
  res.render('index', { title: 'HomePage' });
});

router.get('/shuttlehome', (req, res) => {
  res.render('shuttlehome', { title: 'shuttlehome' });
});

router.get('/shuttlebus_02', (req, res) => {
  res.render('shuttlebus_02', { title: 'shuttlehome2' });
});

router.get('/shuttlebus_03', (req, res) => {
  res.render('shuttlebus_03', { title: 'shuttlehome2' });
});

router.get('/shuttlebus_04', (req, res) => {
  res.render('shuttlebus_04', { title: 'shuttlehome2' });
});

router.get('/shuttlebus_09', (req, res) => {
  res.render('shuttlebus_09', { title: 'shuttlehome2' });
});

router.get('/shuttlebus_10', (req, res) => {
  res.render('shuttlebus_10', { title: 'shuttlehome2' });
});

module.exports = router;
