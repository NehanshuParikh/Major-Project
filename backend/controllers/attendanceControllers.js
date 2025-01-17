import path from 'path'
import { Unit } from '../models/unitModel.js';
import { Subject } from '../models/subjectModel.js';
import { Staff } from '../models/staffModel.js';
import { sendEmailToHOD } from '../mailtrap/emails.js';

export const startAttendance = async (req, res) => {
    const { level, school, branch, semester, division, subject } = req.body;

    // Validate all fields
    if (!level || !school || !branch || !semester || !division || !subject) {
        return res.status(400).json({ message: 'All attendance details are required!' });
    }

    try {
        // Send all details to Flask API
        const response = await fetch('http://localhost:5001/start-attendance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ level, school, branch, semester, division, subject }),
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
        const { school, branch, semester, division, subject } = req.query;

        if (!school || !branch || !semester || !division || !subject) {
            return res.status(400).send('All parameters (school, branch, semester, division, subject) are required.');
        }

        // Construct sanitized file name
        const sanitizedFileName = [
            school,
            branch,
            semester,
            division,
            subject
        ]
            .map((param) => param.replace(/[^a-zA-Z0-9_\- ]/g, '_'))
            .join('_');
        const filePath = path.join(__dirname, 'AttendanceSystem', `${sanitizedFileName}.xlsx`);

        // Check if the file exists
        if (!fs.existsSync(filePath)) {
            return res.status(404).send(`File '${sanitizedFileName}.xlsx' not found.`);
        }

        // Send the file for download
        res.download(filePath, `${sanitizedFileName}.xlsx`, (err) => {
            if (err) {
                console.error('Error downloading the file:', err);
                res.status(500).send('Could not download the file.');
            }
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).send('An unexpected error occurred.');
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


