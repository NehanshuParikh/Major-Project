import path from 'path'
import { fileURLToPath } from 'url';
import fs from 'fs';
import { Unit } from '../models/unitModel.js';
import { Subject } from '../models/subjectModel.js';
import { Staff } from '../models/staffModel.js';
import { sendEmailToHOD } from '../mailtrap/emails.js';
import os from 'os';

// Define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../'); // Go up two levels to reach "Diploma Major Project"



export const startAttendance = async (req, res) => {
    const { level, school, branch, semester, division, subject } = req.body;
    const facultyName = req.user.fullName;
    console.log(level, school, branch, semester, division, subject, facultyName)
    // Validate all fields
    if (!level || !school || !branch || !semester || !division || !subject || !facultyName) {
        return res.status(400).json({ message: 'All attendance details are required!' });
    }

    try {
        // Send all details to Flask API
        const response = await fetch('http://localhost:5001/start-attendance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ level, school, branch, semester, division, subject, facultyName }),
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ message: data.message || 'Error communicating with Python API' });
        }

        res.json(data); // Send Flask API response back to frontend
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error communicating with Flask API' });
    }
};

export const downloadExcel = async (req, res) => {
    try {
        const { school, branch, semester, division, subject, level } = req.query;

        // Validate query parameters
        if (!school || !branch || !semester || !division || !subject || !level) {
            return res.status(400).send('All parameters (school, branch, semester, division, subject, level) are required.');
        }

        // Flask backend URL
        const flaskUrl = `http://localhost:5001/download-excel`;
        console.log('[DEBUG] Forwarding request to Flask backend:', flaskUrl);

        // Forward request to Flask backend
        const queryParams = new URLSearchParams({ school, branch, semester, division, subject, level }).toString();
        const flaskResponse = await fetch(`${flaskUrl}?${queryParams}`);

        // Check if Flask backend returned an error
        if (!flaskResponse.ok) {
            console.error('[ERROR] Flask backend returned an error:', flaskResponse.statusText);
            const errorText = await flaskResponse.text();
            return res.status(flaskResponse.status).send(errorText);
        }

        // Extract headers from Flask response
        const contentDisposition = flaskResponse.headers.get('content-disposition');
        const contentType = flaskResponse.headers.get('content-type');
        const fileName = contentDisposition?.split('filename=')[1]?.replace(/"/g, '') || 'download.xlsx';

        console.log(`[DEBUG] File received from Flask backend: ${fileName}`);

        // Set headers for the client response
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
        res.setHeader('Content-Type', contentType);

        // Pipe the Flask response (file stream) to the client
        flaskResponse.body.pipe(res);

    } catch (error) {
        console.error('[ERROR] Error in forwarding request to Flask backend:', error.message);
        res.status(500).send('An unexpected error occurred while downloading the file.');
    }
};

export const proxyMailToHOD = async (req, res) => {
    console.log(req.body);
    const { level, branch, school, semester, division, subjectCode } = req.body;

    try {
        // Find the subject
        const subject = await Subject.findOne({ SubjectCode: subjectCode });

        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }

        console.log("Subject retrieved:", subject, subject._id);

        // Find the unit
        const unit = await Unit.findOne({
            Level: level,
            Branch: branch,
            School: school,
            Semester: semester,
            Division: division,
            Subject: subject._id, // Ensure this matches the Unit's Subject field
        });

        console.log(unit)

        if (!unit || unit.length === 0) {
            return res.status(404).json({ message: 'No units found' });
        }

        const faculty = await Staff.findOne({ _id: unit.FacultyId }).select('email fullName userId profilePhoto mobile branch school');
        const hod = await Staff.findOne({ _id: unit.HODId }).select('email fullName userId profilePhoto mobile branch school');
        const proxyTakingFaculty = await Staff.findOne({ _id: req.user._id }).select('email fullName userId profilePhoto mobile branch school');

        console.log("Units retrieved:", unit);

        const data = {
            unit,
            faculty,
            hod,
            proxyTakingFaculty,
            subject
        };

        // Send email to HOD
        await sendEmailToHOD(data);

        res.json({ message: 'Email sent successfully', success: true });
    } catch (error) {
        console.error('Error in proxyMailToHOD:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const checkExcelFile = async (req, res) => {
    console.log('Checking file existence...');

    // Extract the details from the request body
    const { level, school, branch, semester, division, subject } = req.body;

    // Correct BASE_DIR path to point to the AttendanceSystem folder
    const BASE_DIR = path.join(__dirname, '..', '..', 'AttendanceSystem'); // Goes two levels up to the root and then to AttendanceSystem folder

    // Construct the file name based on the given format
    const fileName = `${level}_${school}_${branch}_Semester ${semester}_Division ${division}_${subject}.xlsx`;
    const filePath = path.join(BASE_DIR, fileName); // Combine the BASE_DIR with the file name

    // Check if the file exists
    if (fs.existsSync(filePath)) {
        console.log(`File found: ${filePath}`);
        return res.json({ fileExists: true });
    } else {
        console.log(`File not found: ${filePath}`);
        return res.json({ fileExists: false });
    }
};


