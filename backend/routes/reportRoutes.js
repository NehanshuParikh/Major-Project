import express from 'express';
import { generateStudentReport, viewStudentReportSheet, viewStudentAttendanceSheet } from '../controllers/reportController.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.post('/student-report', generateStudentReport); //veirfyToken middleware is needed to be added here. we have removed it for development process once development is donwe of the backend and fronend will be integrated then we will use verifyToken Middleware for desiging pdf we have not protected this route as we still wan tto see the pdf in the browser.
router.get('/view/studentReportSheet',verifyToken,viewStudentReportSheet)
router.get('/view/studentAttendanceSheet',verifyToken,viewStudentAttendanceSheet)
export default router;
