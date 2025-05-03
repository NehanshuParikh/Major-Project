import { fileURLToPath } from 'url';
import { dirname } from 'path';
import multer from 'multer';
import xlsx from 'xlsx';
import fs from 'fs'; // Import fs module
import path from 'path'; // Import path module
import { Marks } from '../models/marksModel.js';
import { Permission } from '../models/permissionModel.js';

// Determine the directory name using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname, '../uploads')); // Adjust path as needed
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname);
        }
    })
});

export const setExamTypeSubjectBranchDivision = async (req, res) => {
    let { examType, subject, branch, division, level, school, semester } = req.body;
    const userId = req.user.userId; // Getting faculty ID from the logged-in user

    // Ensure all fields are filled
    if (!examType || !subject || !branch || !division || !level || !school || !semester) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Convert all string fields in req.body to lowercase
        examType = examType.toLowerCase();
        subject = subject.toLowerCase();
        branch = branch.toLowerCase();
        level = level.toLowerCase();
        school = school.toLowerCase();

        // Check if the HOD has already granted permission for this exam type and subject
        const permission = await Permission.findOne({
            facultyId: userId,
            examType,
            subject,
            semester,
            branch,
            division,
            level,
            school,
        });

        // If no permission record is found, respond with an error
        if (!permission) {
            return res.status(400).json({ message: 'No permission granted by HOD for this exam type or subject' });
        }

        // Set cookies with the selected exam type and subject details
        res.cookie('examType', examType);
        res.cookie('subject', subject);
        res.cookie('branch', branch);
        res.cookie('division', division);
        res.cookie('level', level);
        res.cookie('school', school);
        res.cookie('semester', semester);

        res.status(200).json({ message: 'Exam type, subject, and details selected successfully' });
    } catch (error) {
        console.error('Error setting exam type and subject:', error);
        res.status(500).json({ message: 'Error setting exam type and subject', error });
    }
};

export const marksEntry = async (req, res) => {
    const marksArray = req.body.marks; // Expecting an array of { studentId, marks }

    // Get exam and class info from cookies
    const { examType, subject, branch, division, level, school, semester } = req.cookies;
    const facultyId = req.user.userId;

    if (!examType || !subject) {
        return res.status(400).json({ message: 'Exam type or subject not selected' });
    }

    try {
        // Check permission first
        const permission = await Permission.findOne({
            facultyId,
            examType,
            subject,
            semester,
            branch,
            division,
            level,
            school,
        });

        if (!permission) {
            return res.status(403).json({ message: 'No permission found for entering marks' });
        }

        // Insert all marks
        const savedEntries = [];

        for (const entry of marksArray) {
            const { studentId, marks } = entry;

            const newMark = new Marks({
                marksId: `${studentId}-Sem-${semester}-${subject}-${examType}-${level}-${branch}-${school}`,
                studentId,
                marks,
                examType,
                subject,
                level,
                branch,
                division,
                school,
                semester
            });

            const saved = await newMark.save();
            savedEntries.push(saved);
        }

        // Update permission status
        await Permission.findOneAndUpdate(
            { facultyId, examType, subject, semester, branch, division, level, school },
            { status: 'Completed', marksSubmitted: true },
            { new: true }
        );

        res.status(201).json({
            message: 'All marks entered successfully, status updated to Completed',
            entries: savedEntries
        });
    } catch (error) {
        console.error('Error entering marks:', error);
        res.status(500).json({ message: 'Error entering marks', error });
    }
};



export const uploadMarksSheet = async (req, res) => {
    try {
        const file = req.file;

        // Normalize and parse input fields
        const {
            examType,
            subject,
            branch,
            level,
            school,
            division,
            semester,
        } = req.body;

        const facultyId = req.user.userId; // Faculty ID from logged-in user

        // Normalize the fields
        const normalizedExamType = examType.trim().toLowerCase();
        const normalizedSubject = subject.trim().toLowerCase();
        const normalizedBranch = branch.trim().toLowerCase();
        const normalizedLevel = level.trim().toLowerCase();
        const normalizedSchool = school.trim().toLowerCase();
        const normalizedDivision = parseInt(division.trim());
        const normalizedSemester = parseInt(semester.trim());

        // Check if the faculty has permission
        const permission = await Permission.findOne({
            facultyId,
            examType: normalizedExamType,
            subject: normalizedSubject,
            semester: normalizedSemester,
            branch: normalizedBranch,
            division: normalizedDivision,
            level: normalizedLevel,
            school: normalizedSchool,
        });

        if (!permission) {
            return res.status(403).json({ message: 'You do not have permission to upload the marks' });
        }

        if (!file) {
            return res.status(400).json({ message: 'No file uploaded for bulk marks entry' });
        }

        // Process the uploaded file
        const workbook = xlsx.readFile(file.path);
        const bulkUpdates = [];

        for (const sheetName of workbook.SheetNames) {
            const sheet = workbook.Sheets[sheetName];
            const data = xlsx.utils.sheet_to_json(sheet);

            for (const row of data) {
                const { studentId, marks } = row;

                if (!studentId || marks === undefined) {
                    console.warn(`Skipping row due to missing fields: ${JSON.stringify(row)}`);
                    continue;
                }

                // Update or insert the record using the compound unique index
                await Marks.updateOne(
                    {
                        studentId,
                        examType: normalizedExamType,
                        subject: normalizedSubject,
                        semester: normalizedSemester,
                    },
                    {
                        $set: {
                            marks,
                            level: normalizedLevel,
                            branch: normalizedBranch,
                            division: normalizedDivision,
                            school: normalizedSchool,
                        },
                    },
                    { upsert: true }
                );
            }
        }


        // Perform bulk write operation
        if (bulkUpdates.length > 0) {
            await Marks.bulkWrite(bulkUpdates);
        }

        // Clean up the uploaded file
        fs.unlinkSync(file.path);

        // Update permission status
        const updatedPermission = await Permission.findOneAndUpdate(
            {
                facultyId,
                examType: normalizedExamType,
                subject: normalizedSubject,
                semester: normalizedSemester,
                branch: normalizedBranch,
                division: normalizedDivision,
                level: normalizedLevel,
                school: normalizedSchool,
            },
            {
                status: 'Completed',
                marksSubmitted: true,
            },
            { new: true }
        );

        console.log(updatedPermission);
        res.status(200).json({ message: 'Marks uploaded successfully, permission status updated' });
    } catch (error) {
        console.error('Error uploading marks:', error);
        res.status(500).json({ message: 'Error uploading marks', error });
    }
};

