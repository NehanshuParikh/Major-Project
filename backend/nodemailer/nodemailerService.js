import { transporter, sender } from "./nodemailerConfig.js";
import { VERIFICATION_EMAIL_TEMPLATE, MARKS_REQUEST_APPROVAL , PASSWORD_RESET_SUCCESS_TEMPLATE , PASSWORD_RESET_REQUEST_TEMPLATE , PROXY_NOTIFICATION_TEMPLATE , ATTENDANCE_REPORT_TEMPLATE, ABSENT_REPORT_TEMPLATE  } from "./emailTemplates.js";

export const sendVerificationEmailNodemailer = async (email, verificationToken) => {
    try {
        await transporter.sendMail({
            from: `"${sender.name}" <${sender.email}>`,
            to: email,
            subject: "Verify your Email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
        });
        console.log("✅ Verification email sent");
    } catch (error) {
        console.error("❌ Error sending verification email:", error);
        throw error;
    }
};

export const sendPermissionAprovedForMarksInputtingNodemailer = async (
    email, examType, subject, level, branch, school, semester, division, HODName
) => {
    try {
        await transporter.sendMail({
            from: `"${sender.name}" <${sender.email}>`,
            to: email,
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
        });
        console.log("✅ Permission approval email sent");
    } catch (error) {
        console.error('❌ Error while sending the permission approval email:', error);
        throw error;
    }
};

export const sendWelcomeEmailNodemailer = async (email) => {
    try {
        await transporter.sendMail({
            from: `"${sender.name}" <${sender.email}>`,
            to: email,
            subject: 'Welcome to Code Red (Developers)',
            html: WELCOME_EMAIL_TEMPLATE
                .replace("{company_info_name}", "Code Red (Developers)")
                .replace("{name}", "User"),
        });
        console.log("✅ Welcome email sent");
    } catch (error) {
        console.error("❌ Error sending welcome email:", error);
        throw error;
    }
};

export const sendPasswordResetEmailNodemailer = async (email, userId, resetURL) => {
    try {
        await transporter.sendMail({
            from: `"${sender.name}" <${sender.email}>`,
            to: email,
            subject: 'Reset your password',
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
        });
        console.log("✅ Password reset email sent");
    } catch (error) {
        console.error('❌ Error while sending the password reset email:', error);
        throw error;
    }
};

export const sendResetSuccessEmailNodemailer = async (email) => {
    try {
        await transporter.sendMail({
            from: `"${sender.name}" <${sender.email}>`,
            to: email,
            subject: 'Password Reset Successfully',
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
        });
        console.log("✅ Password reset success email sent");
    } catch (error) {
        console.error('❌ Error while sending the success email:', error);
        throw error;
    }
};

export const sendEmailToHODNodemailer = async (data) => {
    const { unit, faculty, hod, proxyTakingFaculty, subject } = data;

    try {
        await transporter.sendMail({
            from: `"${sender.name}" <${sender.email}>`,
            to: hod.email,
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
                .replace("{subjectCode}", subject?.SubjectCode || "N/A"),
        });

        console.log("✅ Proxy notification email sent to HOD");
    } catch (error) {
        console.error('❌ Error while sending proxy notification email:', error);
        throw error;
    }
};

export const sendAttendanceToParentsNodemailer = async (data) => {
    const { student, attendance, other } = data;

    try {
        await transporter.sendMail({
            from: `"${sender.name}" <${sender.email}>`,
            to: student.fatherEmail || "N/A",
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
                .replaceAll("{facultyFullName}", other.facultyFullName || "N/A")
                .replaceAll("{attendanceDate}", attendance.date || "N/A")
                .replaceAll("{attendanceTime}", attendance.time || "N/A")
                .replace("{fatherEmail}", student.fatherEmail || "N/A")
                .replace("{motherEmail}", student.motherEmail || "N/A"),
        });

        console.log("✅ Attendance report email sent to parents");
    } catch (error) {
        console.error('❌ Error while sending attendance report:', error);
        throw error;
    }
};

export const sendAbsentAttendanceEmailNodemailer = async (student, attendance, other) => {
    try {
        await transporter.sendMail({
            from: `"${sender.name}" <${sender.email}>`,
            to: student.parentsInfo.fatherEmail || "N/A",
            subject: `Absence Notification: ${student.fullName}`,
            html: ABSENT_REPORT_TEMPLATE
                .replace("{studentName}", student.fullName || "N/A")
                .replace("{studentEnrollmentId}", student.enrollmentId || "N/A")
                .replace("{studentBranch}", student.branch || "N/A")
                .replace("{studentSchool}", student.school || "N/A")
                .replace("{studentSemester}", student.semester || "N/A")
                .replace("{studentDivision}", student.division || "N/A")
                .replace("{subject}", other.subject || "N/A")
                .replace("{attendanceDate}", attendance.date || "N/A")
                .replace("{attendanceTime}", attendance.time || "N/A")
        });

        console.log(`✅ Absent mail sent to ${student.fullName}'s father`);
    } catch (error) {
        console.error(`❌ Failed to send absent mail for ${student.fullName}:`, error);
    }
};
