// attendanceFunctions.js
import { Attendance } from "../models/attendanceModel.js";

export const getAttendance = async (enrollment, date, subject) => {
    try {
        const parts = date.split('-');
        const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;

        console.log("Checking for enrollment:", enrollment, "Type:", typeof enrollment);
        console.log("Checking for date:", formattedDate, "Type:", typeof formattedDate);
        console.log("Checking for subject:", subject, "Type:", typeof subject);
``        

        const record = await Attendance.findOne({
            enrollment: enrollment,
            date: formattedDate,
            subject: { $regex: new RegExp(`^${subject.trim()}$`, 'i') }
        });

        
        console.log("MongoDB Query: ", {
            enrollment: enrollment,
            date: formattedDate,
            subject: { $regex: new RegExp(`^${subject.trim()}$`, 'i') }
        });
        

        console.log("Found Record:", record);

        if (record) {
            return { present: true, attendanceTakenBy: record.attendanceTakenBy };
        } else {
            return { present: false, message: "Student was absent." };
        }
    } catch (error) {
        console.error('Error fetching attendance:', error);
        return { present: false, message: 'An error occurred while fetching attendance.' };
    }
};
