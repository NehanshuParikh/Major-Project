import express from 'express'
import { downloadExcel, startAttendance, proxyMailToHOD, checkExcelFile } from '../controllers/attendanceControllers.js'
import { verifyToken } from '../middleware/verifyToken.js'
const router = express.Router()

router.post('/start-attendance', verifyToken, startAttendance)
router.get('/download-excel', verifyToken, downloadExcel);
router.post('/check-file', verifyToken, checkExcelFile);
router.post('/proxy-mail-to-hod', verifyToken, proxyMailToHOD)

export default router