const express = require("express")
const router = express.Router()
const adminController = require("../controllers/admin/adminController")
const auth = require("../middlewares/authAdmin")

router.get('/admin', auth, adminController.getAdmin)
router.get('/admin/login', adminController.login)
router.post('/admin', adminController.postAdmin)
router.put('/admin/:id', adminController.updateAdmin)
router.delete('/admin/:id', adminController.deleteAdmin)

module.exports = router;