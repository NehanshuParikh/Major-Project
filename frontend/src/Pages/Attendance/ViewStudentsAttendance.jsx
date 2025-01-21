import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../Components/DashboardComponents/DashboardLayout';
import Calendar from 'react-calendar'; // Install react-calendar for calendar view
import 'react-calendar/dist/Calendar.css';
import { FaDownload } from 'react-icons/fa'; // Download icon from react-icons
import toast from 'react-hot-toast';
import BarChart from '../../Components/Charts/BarChart';
import LineChart from '../../Components/Charts/LineChart';
import PieChart from '../../Components/Charts/PieChart';
const BASEURL = 'http://localhost:5000/api';
const STUDENT_SEARCH_URL = 'http://localhost:5000/api/user/student-search'; // Ensure this is the correct endpoint

const ViewStudentsAttendance = () => {
    const [view, setView] = useState("table"); // "table", "bar", "pie", "line"
    const [details, setDetails] = useState(null); // Initialize with null
    const [attendanceData, setAttendanceData] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
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
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24">
                                <img
                                    src={details.profilePhoto || 'https://via.placeholder.com/100'}
                                    alt="Profile"
                                    className="w-full h-full object-cover object-center rounded-full border"
                                />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-700 dark:text-white">{details.name}</h3>
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
                            <div className="flex justify-end space-x-4 mb-4">
                                <button onClick={() => setView("table")} className="btn-icon">📋 Table</button>
                                <button onClick={() => setView("bar")} className="btn-icon">📊 Bar Chart</button>
                                <button onClick={() => setView("pie")} className="btn-icon">🥧 Pie Chart</button>
                                <button onClick={() => setView("line")} className="btn-icon">📈 Line Chart</button>
                            </div>

                            {view === "table" && (
                                <table className="w-full mt-4 border-collapse border border-gray-200 dark:border-gray-700">
                                    <thead>
                                        <tr className="bg-gray-100 dark:bg-gray-800">
                                            <th className="border border-gray-200 dark:border-gray-500 p-2 text-left">Date</th>
                                            <th className="border border-gray-200 dark:border-gray-500 p-2 text-left">Time</th>
                                            <th className="border border-gray-200 dark:border-gray-500 p-2 text-left">Subject</th>
                                            <th className="border border-gray-200 dark:border-gray-500 p-2 text-left">Semester</th>
                                            <th className="border border-gray-200 dark:border-gray-500 p-2 text-left">Division</th>
                                            <th className="border border-gray-200 dark:border-gray-500 p-2 text-left">Attendance Taken By</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {attendanceData.map((record) => (
                                            <tr key={record._id}>
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
                            )}

                            {view === "bar" && <BarChart attendanceData={attendanceData} />}
                            {view === "pie" && <PieChart attendanceData={attendanceData} />}
                            {view === "line" && <LineChart attendanceData={attendanceData} />}
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default ViewStudentsAttendance;
