const express = require("express")
const router = express.Router()
const adminController = require("../controllers/admin/adminController")

router.get('/admin', adminController.getAdmin)

module.exports = router;