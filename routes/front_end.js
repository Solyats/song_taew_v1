const express = require("express");
const { FrontEndAdminToken } = require("../middleware/middleware");
const { CheckIsHaveUser } = require("../middleware/CheckIsHaveUser");
const router = express.Router();

router.get("/", CheckIsHaveUser, (req, res) => {
  const error = req?.errorHaveUser || "no_user";
  res.render("index", { error });
});

router.get("/shuttlehome", (req, res) => {
  res.render("shuttlehome");
});

router.get("/admin_list_shuttle_bus", FrontEndAdminToken, (req, res) => {
  res.render("admin_list_shuttle_bus");
});

router.get("/admin_create_shuttle_bus", FrontEndAdminToken, (req, res) => {
  res.render("admin_create_shuttle_bus");
});

router.get("/admin_edit_shuttle_bus", FrontEndAdminToken, (req, res) => {
  if (!req.query.id) {
    return res.redirect("/admin_list_shuttle_bus");
  }
  res.render("admin_edit_shuttle_bus");
});

router.get("/admin_create_bus_stop", FrontEndAdminToken, (req, res) => {
  res.render("admin_create_bus_stop");
});

router.get("/admin_list_bus_stop", FrontEndAdminToken, async (req, res) => {
  res.render("admin_list_bus_stop");
});

router.get("/admin_edit_bus_stop", FrontEndAdminToken, (req, res) => {
  if (!req.query.id) {
    return res.redirect("/admin_list_bus_stop");
  }
  res.render("admin_edit_bus_stop");
});

router.get('/admin_login', async (req, res) => {
  res.render('admin_login');
});

router.get('/admin_register', async (req, res) => {
  res.render('admin_register');
});


module.exports = router;
