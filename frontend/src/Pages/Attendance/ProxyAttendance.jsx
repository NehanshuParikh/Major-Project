import React, { useState, useEffect } from 'react'
import DashboardLayout from '../../Components/DashboardComponents/DashboardLayout'
import toast from 'react-hot-toast';

const ProxyAttendance = () => {
    const [units, setUnits] = useState([]);
    const [students, setStudents] = useState([]); // State to store student data
    const [isLoading, setIsLoading] = useState(false)
    const [downloadDisabled, setDownloadDisabled] = useState(false);
    const [formData, setFormData] = useState({
        unit: '',
    });

    useEffect(() => {
        const getAllTheUnits = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/units/view-all-units', {
                    credentials: "include",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    method: 'GET'
                });

                const data = await response.json();
                console.log(data);

                if (data.success && Array.isArray(data.units)) {
                    if (data.units.length > 0) {
                        setUnits(data.units);
                        toast.success("All Units Found");
                    } else {
                        toast.success("No Units Found");
                    }
                } else {
                    toast.success(data.message || "Failed to fetch units");
                }
            } catch (error) {
                console.error('Error fetching units:', error);
                toast.error("Failed to fetch units");
            }
        };
        getAllTheUnits();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleUnitSubmission = async (e) => {
        e.preventDefault();

        const unitComponents = formData.unit.split(' - ');

        const selectedUnit = {
            level: unitComponents[0]?.trim(),
            branch: unitComponents[1]?.trim(),
            school: unitComponents[2]?.trim(),
            semester: Number(unitComponents[3]?.match(/\d+/)?.[0] || ''),
            division: Number(unitComponents[4]?.match(/\d+/)?.[0] || ''),
            subject: unitComponents[5]?.trim(),
            subjectCode: unitComponents[6]?.trim(),
        };

        console.log('Selected Unit:', selectedUnit);

        try {
            // Request to get students
            const response = await fetch('http://localhost:5000/api/user/get-particular-unit-students', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(selectedUnit),
            });

            const data = await response.json();

            if (data.success) {
                console.log(data)
                setStudents(data.students); // Set students data if successful
                toast.success("Students data fetched successfully");

                // Check if the Excel file exists after fetching students
                const fileCheckResponse = await fetch('http://localhost:5000/api/attendance/check-file', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(selectedUnit), // Send the same selectedUnit to check file existence
                });

                const fileCheckData = await fileCheckResponse.json();

                if (fileCheckData.fileExists) {
                    setDownloadDisabled(false); // Enable download button if file exists
                } else {
                    setDownloadDisabled(true); // Disable download button if file does not exist
                }
            } else {
                setStudents([]); // Clear students if no data found
                toast.error(data.message || "No students found");
            }
        } catch (error) {
            console.error('Error fetching students:', error);
            toast.error("Failed to fetch students");
        }
    };

    const handleProxyMailToHOD = async () => {


        const unitComponents = formData.unit.split(' - ');

        const selectedUnit = {
            level: unitComponents[0]?.trim(),
            branch: unitComponents[1]?.trim(),
            school: unitComponents[2]?.trim(),
            semester: Number(unitComponents[3]?.match(/\d+/)?.[0] || ''),
            division: Number(unitComponents[4]?.match(/\d+/)?.[0] || ''),
            subject: unitComponents[5]?.trim(),
            subjectCode: unitComponents[6]?.trim(),
        };

        console.log('Selected Unit:', selectedUnit);

        try {
            const response = await fetch('http://localhost:5000/api/attendance/proxy-mail-to-hod', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(selectedUnit),
            });

            const data = await response.json();

            if (data.success) {
                console.log(data)
                toast.success("Mail Sent to the Department HOD");
            } else {
                toast.error(data.message || "Error While sending the mail to the Department HOD");
            }
        } catch (error) {
            console.error('Error fetching students:', error);
            toast.error("Failed to fetch students");
        }
    };

    const extractDetails = (unit) => {
        const unitComponents = unit.split(' - ');
        return {
            level: unitComponents[0]?.trim(),
            school: unitComponents[1]?.trim(),
            branch: unitComponents[2]?.trim(),
            semester: unitComponents[3]?.trim(),
            division: unitComponents[4]?.trim(),
            subject: unitComponents[5]?.trim(),
        };
    };

    const startAttendance = async (attendanceDetails) => {
        try {
            const token = localStorage.getItem('token');
            console.log(token)
            const response = await fetch('http://localhost:5000/api/attendance/start-attendance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(attendanceDetails), // Send subject as JSON
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Success:", data.message);
                setDownloadDisabled(false); // Enable download button after starting attendance
            } else {
                console.error("Error:", data.message);
            }
        } catch (error) {
            console.error("Request failed:", error);
        }
    };

    const downloadExcel = async (attendanceDetails) => {
        const { school, branch, semester, division, subject, level } = attendanceDetails;

        try {
            // Construct query parameters
            const params = new URLSearchParams({
                school: branch,
                branch: school,
                semester,
                division,
                subject,
                level,
            });

            // Fetch the file from Flask backend
            const response = await fetch(`http://localhost:5001/download-excel?${params.toString()}`, {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`Failed to download file: ${response.statusText}`);
            }

            // Get the file name from Content-Disposition header
            const contentDisposition = response.headers.get('Content-Disposition');
            const fileNameMatch = contentDisposition?.match(/filename="?([^"]+)"?/);
            const fileName = fileNameMatch ? fileNameMatch[1] : 'download.xlsx';

            // Create a URL and trigger the download
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            setDownloadDisabled(true); // Disable download button after downloading the file
        } catch (error) {
            console.error('Error downloading Excel file:', error);
            alert('Failed to download the file.');
        }
    };

    return (
        <DashboardLayout>
            <div className="container mx-auto p-6">
                <h1 className="text-2xl font-semibold mb-4 dark:text-white">Proxy Attendance</h1>
                <form className="flex flex-col gap-4" onSubmit={handleUnitSubmission}>
                    <div className="flex flex-col gap-4">
                        <label htmlFor="unit" className="block text-sm font-medium text-gray-700 dark:text-white">
                            Select Unit
                        </label>
                        <div className="w-full flex flex-col md:flex-row items-center justify-evenly md:gap-4">
                            <select
                                name="unit"
                                id="unit"
                                value={formData.unit}
                                onChange={handleChange}
                                className="block w-full md:w-[90%] p-2 my-2 md:my-0 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 rounded-md dark:text-white"
                            >
                                <option value="">-- Select a Unit --</option>
                                {units.map((unit) => (
                                    <option key={unit._id} value={`${unit.Level} - ${unit.Branch} - ${unit.School} - Semester ${unit.Semester} - Division ${unit.Division} - ${unit.subject.name} - ${unit.subject.code}`}>
                                        {`${unit.Level} - ${unit.Branch} - ${unit.School} - Semester ${unit.Semester} - Division ${unit.Division} - ${unit.subject.name} - ${unit.subject.code}`}
                                    </option>
                                ))}
                            </select>

                            <button
                                type="submit"
                                className="block w-full md:w-[10%] bg-blue-500 text-white font-bold py-2 rounded-md hover:bg-blue-600 transition duration-200"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                    <p className='text-red-500 dark:text-red-400 text-sm text-justify'>NOTE: You are taking the proxy of another faculty as this will be informed to the HOD as well. You might be asked to give the valid reason in future. So kindly take the note of that.</p>
                </form>

                {/* Conditional rendering for student table */}
                {students.length > 0 ? (
                    <div className="mt-8">
                        <div className="flex flex-col items-start md:items-center justify-between w-full mb-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between w-full">
                                <h2 className="text-xl font-semibold mb-2 md:mb-0 dark:text-white">Student List</h2>
                                <div className="w-content flex items-center justify-center gap-4">
                                    {isLoading ? (
                                        <button className='p-4 text-sm md:text-md bg-green-500 text-white font-bold py-2 rounded-md hover:bg-green-600 transition duration-200'>
                                            <span>
                                                <svg
                                                    className="inline w-5 h-5 mr-2 text-white animate-spin"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    ></circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8v8z"
                                                    ></path>
                                                </svg>
                                                Sending Email and Starting Attendance Tracker...
                                            </span>
                                        </button>
                                    ) : (
                                        <button onClick={async () => {
                                            setIsLoading(true); // Disable the button and show "Starting..."
                                            try {
                                                await handleProxyMailToHOD(); // Wait for handleProxyMailToHOD to complete
                                                const attendanceDetails = extractDetails(formData.unit);
                                                startAttendance(attendanceDetails);
                                            } catch (error) {
                                                console.error("Error in handling attendance workflow:", error);
                                            } finally {
                                                setIsLoading(false); // Re-enable the button
                                            }
                                        }}
                                            className='p-4 text-sm md:text-md bg-green-500 text-white font-bold py-2 rounded-md hover:bg-green-600 transition duration-200'>

                                            Start Attendance Tracking
                                        </button>
                                    )}

                                    <button
                                        onClick={() => {
                                            const attendanceDetails = extractDetails(formData.unit);
                                            downloadExcel(attendanceDetails);
                                        }}
                                        className={`p-4 text-sm md:text-md font-bold py-2 rounded-md transition duration-200 ${downloadDisabled ? 'bg-blue-200 cursor-not-allowed text-white' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                                        disabled={downloadDisabled} // Disable the button if downloadDisabled is true
                                    >
                                        Download Excel Sheet
                                    </button>


                                </div>
                            </div>
                            <p className="text-red-500 dark:text-red-400">Please note that the file can only be downloaded once. Once the file is downloaded, it will be removed from the server and cannot be accessed again.</p>
                        </div>
                        <div className="overflow-x-auto max-w-full">
                            <table className="min-w-full bg-white dark:bg-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 text-center">
                                <thead>
                                    <tr>
                                        <th className="py-2 px-4 border-b">Student ID</th>
                                        <th className="py-2 px-4 border-b">Name</th>
                                        <th className="py-2 px-4 border-b">Level</th>
                                        <th className="py-2 px-4 border-b">Branch</th>
                                        <th className="py-2 px-4 border-b">School</th>
                                        <th className="py-2 px-4 border-b">Semester</th>
                                        <th className="py-2 px-4 border-b">Division</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map((student) => (
                                        <tr key={student._id}>
                                            <td className="py-2 px-4 border-b">{student.enrollmentId}</td>
                                            <td className="py-2 px-4 border-b">{student.fullName}</td>
                                            <td className="py-2 px-4 border-b">{student.level}</td>
                                            <td className="py-2 px-4 border-b">{student.branch}</td>
                                            <td className="py-2 px-4 border-b">{student.school}</td>
                                            <td className="py-2 px-4 border-b">{student.semester}</td>
                                            <td className="py-2 px-4 border-b">{student.division}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <p className="mt-8 text-gray-500">No students found for the selected unit.</p>
                )}
            </div>
        </DashboardLayout>
    );
}

export default ProxyAttendance