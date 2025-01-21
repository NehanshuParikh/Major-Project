import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Staff } from '../models/staffModel.js';
import { Student } from '../models/studentModel.js';
import { Marks } from '../models/marksModel.js';
import { Attendance } from '../models/attendanceModel.js';
import { readFile } from 'fs/promises';
import path from 'path';
import pdf from 'html-pdf';
import { createCanvas } from 'canvas'; // Importing the createCanvas function
import { Chart, registerables } from 'chart.js/auto'; // Importing Chart.js
import { readFileSync } from 'fs';
import bcrypt from 'bcryptjs';

// Get the current file path and directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define the template path
const templatePath = path.join(__dirname, '../templates/reportTemplate.html');



// Convert image to Base64
const imagePath = path.join(__dirname, '../uploads/images/profile-placeholder.png');
const imageBase64 = readFileSync(imagePath).toString('base64');
const imageSrc = `data:image/png;base64,${imageBase64}`;

Chart.register(...registerables); // Register chart.js components

const generateTableHTML = (marksDetails) => {
    // Group marks by examType and semester
    const groupedMarks = marksDetails.reduce((acc, mark) => {
        const examType = mark.examType.replace(/-/g, ' ');
        const semester = `Semester ${mark.semester}`;
        if (!acc[examType]) acc[examType] = {};
        if (!acc[examType][semester]) acc[examType][semester] = [];
        acc[examType][semester].push(mark);
        return acc;
    }, {});

    let tableHTML = '';

    for (const examType in groupedMarks) {
        tableHTML += `<h2>${examType
            .split('-') // Split by hyphen (or spaces if needed)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
            .join(' ')}</h2>`; // Join words with spaces


        for (const semester in groupedMarks[examType]) {
            tableHTML += `
                <h3>${semester}</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Subject</th>
                            <th>Marks</th>
                            <th>Branch</th>
                            <th>Division</th>
                            <th>School</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${groupedMarks[examType][semester]
                    .map(
                        (mark) => `
                                <tr>
                                    <td>${mark.subject.toUpperCase()}</td>
                                    <td>${mark.marks}</td>
                                    <td>${mark.branch.toUpperCase()}</td>
                                    <td>${mark.division}</td>
                                    <td>${mark.school.toUpperCase()}</td>
                                </tr>
                            `
                    )
                    .join('')}
                    </tbody>
                </table>
            `;
        }
    }

    return tableHTML;
};




export const generateStudentReport = async (req, res) => {
    try {
        const searchQuery = req.query.searchQuery || req.body.searchQuery;
        const { marksDetails } = req.body;

        // console.log('Request Query:', req.query);
        // console.log('Request Body:', req.body);

        if (!searchQuery) {
            return res.status(400).json({ success: false, message: 'Search query is required' });
        }

        const student = await Student.findOne({
            $or: [
                { enrollmentId: searchQuery },
                { fullname: new RegExp(searchQuery, 'i') }
            ]
        });

        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }
        console.log(student.fullName)

        const marks = await Marks.find({ studentId: student.userId }).sort({ examType: 1, semester: 1 });

        // Prepare HTML content with dynamic data
        let templateContent = await readFile(templatePath, 'utf8');

        // Replace placeholders with actual data
        templateContent = templateContent
            .replace('{{userId}}', student.enrollmentId)
            .replace('{{student_name}}', student.fullName)
            .replace('{{email}}', student.email)
            .replace('{{path}}', student.profilePhoto)
            .replace('{{mobile}}', student.mobile || 'Not provided');

        // console.log(templateContent); // Check if name is being replaced correctly


        const midSem1Table = generateTableHTML(marksDetails.filter(mark => mark.examType === 'mid-sem-1'));
        const midSem2Table = generateTableHTML(marksDetails.filter(mark => mark.examType === 'mid-sem-2'));
        const externalTable = generateTableHTML(marksDetails.filter(mark => mark.examType === 'external'));

        templateContent = templateContent
            .replace('{{midSem1Table}}', midSem1Table || '<p>No data available for Mid Sem 1.</p>')
            .replace('{{midSem2Table}}', midSem2Table || '<p>No data available for Mid Sem 2.</p>')
            .replace('{{externalTable}}', externalTable || '<p>No data available for External.</p>');


        // Generate the PDF using html-pdf
        const options = {
            format: 'A4',
            orientation: 'portrait',
            border: '10mm',
        };

        pdf.create(templateContent, options).toStream((err, stream) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Error generating PDF' });
            }
            const fileName = `Report_${student.enrollmentId}.pdf`;
            res.setHeader('Content-disposition', 'attachment; filename=' + fileName);
            res.setHeader('Content-type', 'application/pdf');
            stream.pipe(res);
        });

    } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({ success: false, message: 'Error generating report' });
    }
};

export const viewStudentReportSheet = async (req, res) => {
    try {
        console.log(req.query)
        const searchQuery = req.query.searchQuery || req.body.searchQuery;
        const examTypeFilter = req.query.examType || req.body.examType;
        const semesterFilter = req.query.semester || req.body.semester;

        if (!searchQuery) {
            return res.status(400).json({ success: false, message: 'Search query is required' });
        }

        const student = await Student.findOne({
            $or: [
                { enrollmentId: searchQuery },
                { fullname: new RegExp(searchQuery, 'i') }
            ]
        });

        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        const query = { studentId: student.enrollmentId };

        if (examTypeFilter) {
            query.examType = examTypeFilter;
        }

        if (semesterFilter) {
            query.semester = semesterFilter;
        }

        const marks = await Marks.find(query).sort({ semester: 1, examType: 1 });

        if (marks.length === 0) {
            return res.status(404).json({ success: false, message: 'No marks data found' });
        }

        const reportData = {
            studentDetails: {
                name: student.fullName,
                enrollmentNumber: student.enrollmentId,
                email: student.email,
                mobile: student.mobile || 'Not provided',
                profilePhoto: student.profilePhoto
            },
            marksDetails: marks
        };

        return res.status(200).json({ success: true, data: reportData });
    } catch (error) {
        console.error('Error retrieving report:', error);
        return res.status(500).json({ success: false, message: 'Error retrieving report' });
    }
};

export const viewStudentAttendanceSheet = async (req, res) => {
    try {
        const searchQuery = req.query.searchQuery || req.body.searchQuery;

        // Find student
        const student = await Student.findOne({
            $or: [
                { enrollmentId: searchQuery.trim() },
                { fullName: new RegExp(searchQuery.trim(), 'i') }
            ]
        });

        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }
        const allAttendance = await Attendance.find();
        console.log(allAttendance);


        // Modified query to handle date properly
        const attendance = await Attendance.find({
            enrollment: student.enrollmentId
        })
            .select({
                userType: 1,
                enrollment: 1,
                date: 1,
                time: 1,
                level: 1,
                branch: 1,
                school: 1,
                semester: 1,
                division: 1,
                subject: 1,
                attendanceTakenBy: 1
            })
            .sort({
                date: -1,
                time: -1
            })
            .lean(); // Convert to plain JavaScript objects

        console.log('Found attendance records:', JSON.stringify(attendance, null, 2));

        if (attendance.length === 0) {
            return res.status(404).json({ success: false, message: 'No attendance data found' });
        }

        // Format dates in the response
        const formattedAttendance = attendance.map(record => ({
            ...record,
            date: new Date(record.date).toISOString().split('T')[0]
        }));

        const attendanceData = {
            studentDetails: {
                name: student.fullName,
                enrollmentNumber: student.enrollmentId,
                email: student.email,
                mobile: student.mobile || 'Not provided',
                profilePhoto: student.profilePhoto
            },
            totalRecords: formattedAttendance.length,
            attendanceDetails: formattedAttendance
        };

        return res.status(200).json({
            success: true,
            message: 'Attendance sheet retrieved successfully',
            attendanceData
        });
    } catch (error) {
        console.error('Error details:', error);
        return res.status(500).json({ success: false, message: 'Error retrieving attendance sheet' });
    }
};


