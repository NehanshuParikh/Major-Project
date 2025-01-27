import { mailtrapClient, sender } from "./mailtrapConfig.js"
import dotenv from 'dotenv';
import { VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE, MARKS_REQUEST_APPROVAL, PROXY_NOTIFICATION_TEMPLATE, ATTENDANCE_REPORT_TEMPLATE } from "./emailTemplates.js";

dotenv.config()

export const sendVerificationEmail = async (email, verificationToken) => {
    const receipent = [{ email }]
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: receipent,
            subject: 'Verify your email',
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email Verification"
        })
        console.log("Email sent successfully")

    } catch (error) {
        console.error('Error wihile sending the email: ', error)
        throw new Error('Error while sending the email: ', error)

    }
}

export const sendPermissionAprovedForMarksInputting = async (email, examType, subject, level, branch, school, semester, division, HODName) => {
    const recipient = [{ email }];
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: 'Your permission to input marks has been approved',
            html: MARKS_REQUEST_APPROVAL
                .replace("{subject}", subject)
                .replace("{examType}", examType)
                .replace("{level}", level)
                .replace("{branch}", branch)
                .replace("{school}", school)
                .replace("{semester}", semester)
                .replace("{division}", division)
                .replace("{HODName}", HODName),
            category: "Permission Approval"
        });
        console.log("Email sent successfully");
    } catch (error) {
        console.error('Error while sending the email: ', error);
        throw new Error('Error while sending the email');
    }
};

export const sendWelcomeEmail = async (email) => {
    const receipent = [{ email }]
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: receipent,
            template_uuid: "78c16719-6fb0-45d2-acd6-061600cd2390",
            template_variables: {
                "company_info_name": "Code Red (Developers)",
                "name": "User"
            }
        })
        console.log("Email sent successfully", response)

    } catch (error) {
        console.log("Error in Email Send Welcome Email handler ")
        res.status(500).json({ success: false, message: 'server Error' })

    }
}
export const sendPasswordResetEmail = async (email, userId, resetURL) => {
    const receipent = [{ email }]
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: receipent,
            subject: 'Reset your password',
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
            category: "Password reset"
        })
        console.log("Email sent successfully")
    } catch (error) {
        console.error('Error while sending the email: ', error)
    }
}
export const sendResetSuccessEmail = async (email) => {
    const receipent = [{ email }]
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: receipent,
            subject: 'Password Reset Successfully',
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password reset"
        })
        console.log("Password reset email sent successfully")
    } catch (error) {
        console.error('Error while sending the Password reset email: ', error)
    }
}

export const sendEmailToHOD = async (data) => {
    const { unit, faculty, hod, proxyTakingFaculty, subject } = data;
    const recipient = [{ email: hod.email }];
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: 'Proxy has been taken in your department',
            html: PROXY_NOTIFICATION_TEMPLATE
                .replace("{HODName}", hod?.fullName || "N/A")
                .replace("{originalFacultyName}", faculty?.fullName || "N/A")
                .replace("{originalFacultyEmail}", faculty?.email || "N/A")
                .replace("{originalFacultyMobile}", faculty?.mobile || "N/A")
                .replace("{originalFacultyBranch}", faculty?.branch || "N/A")
                .replace("{originalFacultyPhoto}", faculty?.profilePhoto || "N/A")
                .replace("{proxyFacultyName}", proxyTakingFaculty?.fullName || "N/A")
                .replace("{proxyFacultyEmail}", proxyTakingFaculty?.email || "N/A")
                .replace("{proxyFacultyMobile}", proxyTakingFaculty?.mobile || "N/A")
                .replace("{proxyFacultyPhoto}", proxyTakingFaculty?.profilePhoto || "N/A")
                .replace("{proxyFacultyBranch}", proxyTakingFaculty?.branch || "N/A")
                .replace("{subject}", subject?.SubjectName || "N/A")
                .replace("{subjectCode}", subject?.SubjectCode || "N/A")
        });
        if (response) {
            console.log("Proxy Email sent to HOD successfully");
        }
    } catch (error) {
        console.error('Error while sending the email: ', error);
        throw new Error('Error while sending the email');
    }
}

export const sendAttendanceToParents = async (data) => {
    const { student, attendance, other } = data;
    // Properly structured array of recipient objects
    const recipient = [
        { email: student.fatherEmail || "N/A" }
    ];
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: `${student.fullName} Attendance Report`,
            html: ATTENDANCE_REPORT_TEMPLATE
                .replace("{studentName}", student.fullName || "N/A")
                .replace("{studentProfilePhoto}", student.profilePhoto || "N/A")
                .replace("{studentEnrollmentId}", student.enrollmentId || "N/A")
                .replace("{studentBranch}", student.branch || "N/A")
                .replace("{studentSchool}", student.school || "N/A")
                .replace("{studentSemester}", student.semester || "N/A")
                .replace("{studentDivision}", student.division || "N/A")
                .replace("{subject}", other.subject || "N/A")
                .replace("{facultyFullName}", other.facultyFullName || "N/A")
                .replace("{attendanceDate}", attendance.date || "N/A")
                .replace("{attendanceTime}", attendance.time || "N/A")
                .replace("{fatherEmail}", student.fatherEmail || "N/A")
                .replace("{motherEmail}", student.motherEmail || "N/A")
                .replace("{facultyFullName}", other.facultyFullName || "N/A")
                .replace("{attendanceDate}", attendance.date || "N/A")
                .replace("{attendanceTime}", attendance.time || "N/A")
    });
    if (response) {
        console.log("Attendance Email sent to parents successfully");
    }
}
    catch (error) {
    console.error('Error while sending the email: ', error);
    throw new Error('Error while sending the email');
}
    }
