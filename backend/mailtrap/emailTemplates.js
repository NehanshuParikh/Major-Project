export const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Verify Your Email</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>Thank you for signing up! Your verification code is:</p>
    <div style="text-align: center; margin: 30px 0;">
      <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4CAF50;">{verificationCode}</span>
    </div>
    <p>Enter this code on the verification page to complete your registration.</p>
    <p>This code will expire in 10 minutes for security reasons.</p>
    <p>If you didn't create an account with us, please ignore this email.</p>
    <p>Best regards,<br>Your App Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

export const MARKS_REQUEST_APPROVAL = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Request Approved</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Request Approved</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>Your Request for Inputting marks is Approved</p>
    <ul>
      <li>Level: {level}</li>
      <li>Branch: {branch}</li>
      <li>School: {school}</li>
      <li>Division: {division}</li>
      <li>Exam Type: {examType}</li>
      <li>Semester: {semester}</li>
      <li>Subject: {subject}</li>
    </ul>
    <p>Your Request Has been approved by the {HODName}</p>
    <p>This Approval will expire within 7 days for security concerns.</p>
    <p>If you didn't create this request, please ignore this email.</p>
    <p>Best regards,<br>Code Red Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;


export const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Successful</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Password Reset Successful</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>We're writing to confirm that your password has been successfully reset.</p>
    <div style="text-align: center; margin: 30px 0;">
      <div style="background-color: #4CAF50; color: white; width: 50px; height: 50px; line-height: 50px; border-radius: 50%; display: inline-block; font-size: 30px;">
        ✓
      </div>
    </div>
    <p>If you did not initiate this password reset, please contact our support team immediately.</p>
    <p>For security reasons, we recommend that you:</p>
    <ul>
      <li>Use a strong, unique password</li>
      <li>Enable two-factor authentication if available</li>
      <li>Avoid using the same password across multiple sites</li>
    </ul>
    <p>Thank you for helping us keep your account secure.</p>
    <p>Best regards,<br>Your App Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

export const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Password Reset</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>We received a request to reset your password. If you didn't make this request, please ignore this email.</p>
    <p>To reset your password, click the button below:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{resetURL}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
    </div>
    <p>This link will expire in 1 hour for security reasons.</p>
    <p>Best regards,<br>Your App Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;


export const PROXY_NOTIFICATION_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Proxy Lecture Notification</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #FF9800, #F57C00); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Proxy Lecture Notification</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello {HODName},</p>
    <p>We want to notify you that a proxy lecture has been arranged in your department. Below are the details:</p>

    <!-- General Details -->
    <h3 style="color: #4CAF50;">General Details</h3>
    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">Subject</td>
        <td style="padding: 8px; border: 1px solid #ddd;">{subject}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">Subject Code</td>
        <td style="padding: 8px; border: 1px solid #ddd;">{subjectCode}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">Date</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${new Date().toLocaleDateString()}</td>
      </tr>
    </table>

    <!-- Proxy Faculty Details -->
    <h3 style="color: #4CAF50;">Proxy Faculty Details</h3>
    <div style="display: flex; align-items: center; gap: 40px; margin-bottom: 20px;">
      <div style="width: 100px; height: 100px">  
        <img src="{proxyFacultyPhoto}" alt="Proxy Faculty Photo" style="width: 100%; height: 100%; object-fit: cover; object-position: center; border-radius: 10%;">
      </div>
      <div style="margin-left: 10px;">
        <p><strong>Name:</strong> {proxyFacultyName}</p>
        <p><strong>Email:</strong> {proxyFacultyEmail}</p>
        <p><strong>Mobile:</strong> {proxyFacultyMobile}</p>
        <p><strong>Branch:</strong> {proxyFacultyBranch}</p>
      </div>
    </div>

    <!-- Original Faculty Details -->
    <h3 style="color: #4CAF50;">Original Faculty Details</h3>
    <div style="display: flex; align-items: center; gap: 40px; margin-bottom: 20px;">
      <div style="width: 100px; height: 100px">
        <img src="{originalFacultyPhoto}" alt="Original Faculty Photo" style="width: 100%; height: 100%; object-fit: cover; object-position: center; border-radius: 10%;">
      </div>
      <div style="margin-left: 10px;">
        <p><strong>Name:</strong> {originalFacultyName}</p>
        <p><strong>Email:</strong> {originalFacultyEmail}</p>
        <p><strong>Mobile:</strong> {originalFacultyMobile}</p>
        <p><strong>Branch:</strong> {originalFacultyBranch}</p>
      </div>
    </div>

    <p>Please review this proxy arrangement for approval or further actions.</p>
    <p>If you have any questions or need further details, feel free to contact us.</p>
    <p>Best regards,<br>Edu Track Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;


export const ATTENDANCE_REPORT_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Attendance Report</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #2E7D32); padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0;">Attendance Report</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Dear Parents,</p>
    <p>We are sharing the attendance report of your child. Please find the details below:</p>

    <!-- Attendance Overview -->
    <div style="text-align: center; margin-bottom: 30px;">
      <h3 style="color: #4CAF50; margin: 0;">Attendance Marked on {attendanceDate} at {attendanceTime}</h3>
      <p style="color: #555; font-size: 1.1em; font-weight: bold;">Attendance was marked by {facultyFullName} for the subject <span style="color: #FF9800;">{subject}</span>.</p>
    </div>

    <!-- Student Profile -->
    <h3>Student Details: </h3>
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 30px;">
      <div style="text-align: center; margin-right: 20px;">
        <img src="{studentProfilePhoto}" alt="Student Profile Photo" style="border-radius: 10%; width: 100px; height: 100px; object-fit: cover;">
      </div>
      <div style="flex-grow: 1; width: 100%;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Student Name</td>
            <td style="padding: 8px; border: 1px solid #ddd;">{studentName}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Roll Number</td>
            <td style="padding: 8px; border: 1px solid #ddd;">{studentEnrollmentId}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Branch</td>
            <td style="padding: 8px; border: 1px solid #ddd;">{studentBranch}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">School</td>
            <td style="padding: 8px; border: 1px solid #ddd;">{studentSchool}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Semester</td>
            <td style="padding: 8px; border: 1px solid #ddd;">{studentSemester}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Division</td>
            <td style="padding: 8px; border: 1px solid #ddd;">{studentDivision}</td>
          </tr>
        </table>
      </div>
    </div>

    <!-- Parent Contact -->
    <div style="margin-bottom: 30px;">
      <h3 style="color: #FF9800;">Parent Contact Information</h3>
      <p><strong>Father's Email:</strong> {fatherEmail}</p>
      <p><strong>Mother's Email:</strong> {motherEmail}</p>
    </div>

    <!-- Attendance Details -->
    <div style="margin-bottom: 20px;">
      <h3 style="color: #4CAF50;">Attendance Details</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Attendance Taken By:</td>
          <td style="padding: 8px; border: 1px solid #ddd;">{facultyFullName}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Date</td>
          <td style="padding: 8px; border: 1px solid #ddd;">{attendanceDate}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Time</td>
          <td style="padding: 8px; border: 1px solid #ddd;">{attendanceTime}</td>
        </tr>
      </table>
    </div>

    <p>We encourage regular attendance and appreciate your efforts in supporting your child's education.</p>
    <p>If you have any concerns or questions, feel free to contact us.</p>
    <p>Best regards,<br>Edu Track Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>

`;


