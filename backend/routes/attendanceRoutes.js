import express from 'express'
import { downloadExcel, startAttendance } from '../controllers/attendanceControllers.js'
import { verifyToken } from '../middleware/verifyToken.js'
const router = express.Router()

router.post('/start-attendance', startAttendance)

router.get('/download-excel', downloadExcel);

export default router