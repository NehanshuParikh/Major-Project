import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../Components/DashboardComponents/DashboardLayout';
import Calendar from 'react-calendar'; // Install react-calendar for calendar view
import 'react-calendar/dist/Calendar.css';
import { FaDownload } from 'react-icons/fa'; // Download icon from react-icons
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import CalendarComponent from '../../Components/Calendar/CalendarComponent';
import html2canvas from "html2canvas";

const BASEURL = 'http://localhost:5000/api';
const STUDENT_SEARCH_URL = 'http://localhost:5000/api/user/student-search'; // Ensure this is the correct endpoint


const ViewStudentsAttendance = () => {
    const [view, setView] = useState("table"); // "table", "bar", "pie", "line"
    const [showAll, setShowAll] = useState(false); // State for showing all or limited records
    const [details, setDetails] = useState(null); // Initialize with null
    const [attendanceData, setAttendanceData] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());


    const generatePDF = async () => {
        const calendarElement = document.getElementById("calendar-component");
        const canvas = await html2canvas(calendarElement); // Capture the calendar as a canvas
        const calendarImage = canvas.toDataURL("image/jpeg"); // Convert the canvas to an image

        // Create the PDF and add the calendar image
        const doc = new jsPDF();
        doc.addImage(calendarImage, "JPEG", 10, 100, 190, 100); // Adjust position/size as needed
        doc.save("calendar.pdf");
    };



    // Limit records to show only 3 when not showing all
    const visibleData = showAll ? attendanceData : attendanceData.slice(0, 3);

    const [formData, setFormData] = useState({
        studentNameOrId: '', // Field to handle student name or ID
    });
    const [suggestions, setSuggestions] = useState([]); // To store user suggestions
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchSuggestions = async (query) => {
        const token = localStorage.getItem('token'); // Get the token at the beginning

        try {
            const response = await fetch(`${STUDENT_SEARCH_URL}?query=${query}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    // Filter out student user types
                    const filteredUsers = data.users.filter(user => user.userType !== 'student');
                    setSuggestions(filteredUsers); // Set filtered users or empty array
                    setShowSuggestions(true); // Show the suggestions
                } else {
                    setSuggestions([]); // No success, no suggestions
                    setShowSuggestions(true); // Still show empty suggestions
                }
            } else {
                console.error('Error fetching suggestions:', response.statusText);
                setSuggestions([]); // Error means no suggestions
                setShowSuggestions(true); // Still show empty suggestions
            }
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            setSuggestions([]); // If error, no suggestions
            setShowSuggestions(true); // Still show empty suggestions
        }
    };


    const handleSelectSuggestion = (student) => {
        setFormData({ ...formData, studentNameOrId: `${student.enrollmentId}` });
        setShowSuggestions(false); // Hide suggestions after selection
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleSearchChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });

        // Fetch suggestions when typing in the student input
        if (e.target.name === 'studentNameOrId' && e.target.value.length > 1) {
            fetchSuggestions(e.target.value);
        } else {
            setShowSuggestions(false); // Hide suggestions when input is less than 2 characters
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('No token found. Please log in.');
            setLoading(false);
            return;
        }

        try {
            const queryParams = new URLSearchParams({
                searchQuery: formData.studentNameOrId,
            }).toString();

            const response = await fetch(`${BASEURL}/reports/view/studentAttendanceSheet?${queryParams}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                credentials: 'include',
            });

            const responseData = await response.json();
            setLoading(false);

            if (response.ok && responseData.success) {
                toast.success('Report fetched successfully');
                setDetails(responseData.attendanceData.studentDetails);
                setAttendanceData(responseData.attendanceData.attendanceDetails);
                setSuggestions([]);
            } else {
                toast.error(responseData.message || 'Failed to fetch report');
            }
        } catch (error) {
            console.error('Error:', error);
            setLoading(false);
            toast.error('An error occurred');
        }
    };

    const downloadReport = async () => {
        try {
            const doc = new jsPDF('p', 'pt', 'a4');
            const pageWidth = doc.internal.pageSize.width;
    
            // Add Title
            doc.setFontSize(20);
            doc.text('Student Attendance Report', pageWidth / 2, 40, { align: 'center' });
    
            // Add Student Details
            let nextY = 60;
            if (details.profilePhoto) {
                const img = new Image();
                img.src = details.profilePhoto;
                const imgWidth = 100;
                const imgHeight = 80;
                const imgX = 40;
                const imgY = nextY;
    
                doc.setDrawColor(0);
                doc.setLineWidth(1);
                doc.rect(imgX - 2, imgY - 2, imgWidth + 4, imgHeight + 4);
                doc.addImage(img, 'JPEG', imgX, imgY, imgWidth, imgHeight);
    
                doc.setFontSize(12);
                doc.text(`Name: ${details.name}`, imgX + imgWidth + 20, imgY + 20);
                doc.text(`Enrollment: ${details.enrollmentNumber}`, imgX + imgWidth + 20, imgY + 40);
                doc.text(`Email: ${details.email}`, imgX + imgWidth + 20, imgY + 60);
                doc.text(`Mobile: ${details.mobile || 'Not provided'}`, imgX + imgWidth + 20, imgY + 80);
    
                nextY = imgY + imgHeight + 20;
            } else {
                doc.setFontSize(12);
                doc.text(`Name: ${details.name}`, 40, nextY);
                doc.text(`Enrollment: ${details.enrollmentNumber}`, 40, nextY + 20);
                doc.text(`Email: ${details.email}`, 40, nextY + 40);
                doc.text(`Mobile: ${details.mobile || 'Not provided'}`, 40, nextY + 60);
                nextY += 80;
            }
    
            nextY += 10;
            // Add Attendance Summary
            doc.setFont("helvetica", "bold");
            doc.text(`Total Attendance Records: ${attendanceData.length}`, 40, nextY);
            doc.setFont("helvetica", "normal");
            nextY += 20;
    
            // Add Attendance Table
            const tableData = attendanceData.map(record => [
                new Date(record.date).toLocaleDateString(),
                record.time,
                record.subject,
                record.semester,
                record.division,
                record.attendanceTakenBy
            ]);
    
            doc.autoTable({
                startY: nextY,
                head: [['Date', 'Time', 'Subject', 'Semester', 'Division', 'Taken By']],
                body: tableData,
                theme: 'grid',
                styles: { fontSize: 8 },
                headStyles: { fillColor: [71, 85, 105] }
            });
    
            nextY = doc.lastAutoTable.finalY + 20; // Update Y position after the table
    
            // Capture Calendar Component
            const calendarElement = document.getElementById("calendar-component");
            if (calendarElement) {
                
                doc.addPage();
                doc.setFont("helvetica", "bold");
                doc.text(`Calendar View:`, 40, 40);
                doc.setFont("helvetica", "normal");
                nextY += 10;
    
                const canvas = await html2canvas(calendarElement); // Render the calendar
                const calendarImage = canvas.toDataURL("image/jpeg"); // Convert to image
                doc.addImage(calendarImage, "JPEG", 40, 60, 520, 400); // Add to PDF
                nextY += 220; // Update Y position
            } else {
                console.warn("Calendar component not found!");
            }

            
    
            // Add Subject-wise Attendance Summary
            const subjects = [...new Set(attendanceData.map(record => record.subject))];
            const subjectWiseCount = subjects.map(subject => {
                const count = attendanceData.filter(record => record.subject === subject).length;
                return [subject, count];
            });
    
            doc.addPage();
            doc.text('Subject-wise Attendance Summary', 40, 40);
    
            doc.autoTable({
                startY: 60,
                head: [['Subject', 'Total Present Classes']],
                body: subjectWiseCount,
                theme: 'grid',
                styles: { fontSize: 10 },
                headStyles: { fillColor: [71, 85, 105] }
            });
    
            // Save the PDF
            doc.save(`${details.enrollmentNumber}_attendance_report.pdf`);
        } catch (error) {
            console.error("Error generating report:", error);
        }
    };


    return (
        <DashboardLayout>
            <div className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-gray-700 dark:text-white">
                    Attendance Report
                </h2>

                {/* Search Form */}
                <label className="text-sm font-medium text-gray-700 dark:text-white">Search by Student Name or ID</label>
                <form onSubmit={handleSubmit} method="post" className="w-full flex items-center justify-start gap-2 mt-2">
                    <div className="w-10/12">
                        <input
                            type="text"
                            name="studentNameOrId"
                            value={formData.studentNameOrId}
                            onChange={handleSearchChange}
                            className="block w-full p-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md"
                            placeholder="Enter Student Name or ID"
                            required
                        />
                        {showSuggestions && (
                            <ul className="border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md mt-2">
                                {suggestions.length > 0 ? (
                                    suggestions.map((student) => (
                                        <li
                                            key={student._id}
                                            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                                            onClick={() => handleSelectSuggestion(student)}
                                        >
                                            {student.fullName} ({student.enrollmentId})
                                        </li>
                                    ))
                                ) : (
                                    <li className="p-2 text-gray-500">No match found</li>
                                )}
                            </ul>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                        Search
                    </button>
                </form>

                {/* Display Attendance Report */}
                {details && (
                    <div className="mt-8 bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
                        <div className="flex items-center flex-col sm:flex-row text-sm gap-6 overflow-x-auto sm:overflow-x-hidden">
                            <div className="w-24 h-24">
                                <div className="w-full h-full">
                                    <img
                                        src={details.profilePhoto || 'https://via.placeholder.com/100'}
                                        alt="Profile"
                                        className="w-full h-full object-cover object-center rounded-full border"
                                    />
                                </div>
                            </div>
                            <div className='w-full'>
                                <h3 className="text-lg font-bold text-gray-700 dark:text-white">{details.name}</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    <strong>Enrollment:</strong> {details.enrollmentNumber}
                                </p>
                                <p className="text-gray-600 dark:text-gray-400">
                                    <strong>Email:</strong> {details.email}
                                </p>
                                <p className="text-gray-600 dark:text-gray-400">
                                    <strong>Mobile:</strong> {details.mobile || 'Not provided'}
                                </p>
                            </div>
                        </div>


                        <h4 className="text-lg font-semibold mt-6 text-gray-700 dark:text-white">
                            Attendance Records ({attendanceData.length} total)
                        </h4>
                        <div>
                            <div className="flex justify-end w-full mb-4 gap-4      ">
                                <button onClick={() => setView("table")} className="btn-icon dark:text-white">📋 Table</button>
                                <button onClick={() => setView("calendar")} className="btn-icon dark:text-white">📅 Calendar</button>
                                <button
                                    onClick={downloadReport}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    <FaDownload className="mr-2" /> Download Report
                                </button>
                            </div>

                            {view === "table" && (
                                <div>
                                    <table className="w-full mt-4 border-collapse border border-gray-200 dark:border-gray-700">
                                        <thead>
                                            <tr className="bg-gray-100 dark:bg-gray-800 dark:text-white">
                                                <th className="border border-gray-200 dark:border-gray-500 p-2 text-left">Date</th>
                                                <th className="border border-gray-200 dark:border-gray-500 p-2 text-left">Time</th>
                                                <th className="border border-gray-200 dark:border-gray-500 p-2 text-left">Subject</th>
                                                <th className="border border-gray-200 dark:border-gray-500 p-2 text-left">Semester</th>
                                                <th className="border border-gray-200 dark:border-gray-500 p-2 text-left">Division</th>
                                                <th className="border border-gray-200 dark:border-gray-500 p-2 text-left">Attendance Taken By</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {visibleData.map((record) => (
                                                <tr key={record._id} className='dark:text-white'>
                                                    <td className="border border-gray-200 dark:border-gray-500 p-2">{record.date}</td>
                                                    <td className="border border-gray-200 dark:border-gray-500 p-2">{record.time}</td>
                                                    <td className="border border-gray-200 dark:border-gray-500 p-2">{record.subject}</td>
                                                    <td className="border border-gray-200 dark:border-gray-500 p-2">{record.semester}</td>
                                                    <td className="border border-gray-200 dark:border-gray-500 p-2">{record.division}</td>
                                                    <td className="border border-gray-200 dark:border-gray-500 p-2">{record.attendanceTakenBy}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    {/* Buttons for toggling the data */}
                                    <div className="mt-4">
                                        {!showAll && attendanceData.length > 3 && (
                                            <button
                                                onClick={() => setShowAll(true)}
                                                className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white px-4 py-2 m-2 rounded"
                                            >
                                                Show All
                                            </button>
                                        )}
                                        {showAll && (
                                            <button
                                                onClick={() => setShowAll(false)}
                                                className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white px-4 py-2 rounded"
                                            >
                                                View Less
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                            <div className={`calendar-container`}>
                                {view === "calendar" && <div id="calendar-component"><CalendarComponent attendanceData={attendanceData} /></div>}
                            </div>

                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default ViewStudentsAttendance;
