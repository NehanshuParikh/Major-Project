import express from 'express'
import { downloadExcel, startAttendance, proxyMailToHOD, checkExcelFile } from '../controllers/attendanceControllers.js'
import { verifyToken } from '../middleware/verifyToken.js'
const router = express.Router()

router.post('/start-attendance', startAttendance)
router.get('/download-excel', downloadExcel);
router.post('/check-file', checkExcelFile);
router.post('/proxy-mail-to-hod', verifyToken, proxyMailToHOD)

export default router