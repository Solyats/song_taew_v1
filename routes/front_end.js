const express = require('express');
const router = express.Router();

const cssPath =""

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/shuttlehome', (req, res) => {
  res.render('shuttlehome');
});

router.get('/admin_list_shuttle_bus',  (req, res) => {
  res.render('admin_list_shuttle_bus');
});

router.get('/admin_create_shuttle_bus', (req, res) => {
  res.render('admin_create_shuttle_bus');
});

router.get('/admin_edit_shuttle_bus', (req, res) => {
  if (!req.query.id) {
    return res.redirect('/admin_list_shuttle_bus');
  }
  res.render('admin_edit_shuttle_bus');
});

router.get('/admin_create_bus_stop', (req, res) => {
  res.render('admin_create_bus_stop');
});

router.get('/admin_list_bus_stop', async (req, res) => {
  res.render('admin_list_bus_stop');
});

module.exports = router;
