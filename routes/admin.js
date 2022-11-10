const express = require("express")
const router = express.Router()
const adminController = require("../controllers/admin/adminController")
const auth = require("../middlewares/authAdmin")

router.get('/admin', auth, adminController.getAdmin)
router.post('/admin', adminController.postAdmin)
router.put('/admin/:id', adminController.updateAdmin)
router.delete('/admin/:id', adminController.deleteAdmin)

module.exports = router;