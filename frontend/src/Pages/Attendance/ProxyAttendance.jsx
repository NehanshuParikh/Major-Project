import React, { useState, useEffect } from 'react'
import DashboardLayout from '../../Components/DashboardComponents/DashboardLayout'
import toast from 'react-hot-toast';

const ProxyAttendance = () => {
    const [units, setUnits] = useState([]);
    const [students, setStudents] = useState([]); // State to store student data
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
            } else {
                setStudents([]); // Clear students if no data found
                toast.error(data.message || "No students found");
            }
        } catch (error) {
            console.error('Error fetching students:', error);
            toast.error("Failed to fetch students");
        }
    };

    const startAttendance = async (subject) => {
        try {
            const response = await fetch('http://localhost:5000/api/attendance/start-attendance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ subject }), // Send subject as JSON
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Success:", data.message);
            } else {
                console.error("Error:", data.message);
            }
        } catch (error) {
            console.error("Request failed:", error);
        }
    };

    const downloadExcel = async (subject) => {
        try {
            const response = await fetch(`http://localhost:5001/download-excel?subject=${encodeURIComponent(subject)}`, {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error('Failed to download file');
            }

            // Convert response to a blob
            const blob = await response.blob();

            // Create a temporary URL for the blob
            const url = window.URL.createObjectURL(blob);

            // Create a temporary link and trigger download
            const link = document.createElement('a');
            link.href = url;
            link.download = `${subject}.xlsx`; // Dynamically set the filename
            document.body.appendChild(link);
            link.click();

            // Clean up the URL and link element
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading file:', error);
            alert('Failed to download the file.');
        }
    };

    // Function to extract the subject from the selected unit string
    const extractSubject = (unit) => {
        const unitComponents = unit.split(' - ');
        return unitComponents[5]?.trim(); // The subject is the 6th component in the unit string
    };


    return (
        <DashboardLayout>
            <div className="container mx-auto p-6">
                <h1 className="text-2xl font-semibold mb-4">Proxy Attendance</h1>
                <form className="flex flex-col gap-4" onSubmit={handleUnitSubmission}>
                    <div className="flex flex-col gap-4">
                        <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
                            Select Unit
                        </label>
                        <div className="w-full flex flex-col md:flex-row items-center justify-evenly md:gap-4">
                            <select
                                name="unit"
                                id="unit"
                                value={formData.unit}
                                onChange={handleChange}
                                className="block w-full md:w-[90%] p-2 my-2 md:my-0 border border-gray-300 rounded-md"
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
                    <p className='text-red-500 text-sm text-justify'>NOTE: You are taking the proxy of another faculty as this will be informed to the HOD as well. You might be asked to give the valid reason in future. So kindly take the note of that.</p>
                </form>

                {/* Conditional rendering for student table */}
                {students.length > 0 ? (
                    <div className="mt-8">
                        <div className="flex flex-col items-start md:items-center justify-between w-full mb-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between w-full">
                                <h2 className="text-xl font-semibold mb-2 md:mb-0">Student List</h2>
                                <div className="w-content flex items-center justify-center gap-4">
                                    <button onClick={() => { startAttendance(extractSubject(formData.unit)) }} className='p-4 text-sm md:text-md bg-green-500 text-white font-bold py-2 rounded-md hover:bg-green-600 transition duration-200'>Start Attendance Tracking</button>
                                    <button onClick={() => { downloadExcel(extractSubject(formData.unit)) }} className='p-4 text-sm md:text-md bg-blue-500 text-white font-bold py-2 rounded-md hover:bg-blue-600 transition duration-200'>Download Excel Sheet </button>
                                </div>
                            </div>
                            <p className="text-red-500">Please note that the file can only be downloaded once. Once the file is downloaded, it will be removed from the server and cannot be accessed again.</p>
                        </div>
                        <div className="overflow-x-auto max-w-full">
                            <table className="min-w-full bg-white border border-gray-200 text-center">
                                <thead>
                                    <tr>
                                        <th className="py-2 px-4 border-b">Student ID</th>
                                        <th className="py-2 px-4 border-b">Name</th>
                                        <th className="py-2 px-4 border-b">Level</th>
                                        <th className="py-2 px-4 border-b">Branch</th>
                                        <th className="py-2 px-4 border-b">School</th>
                                        <th className="py-2 px-4 border-b">Semester</th>
                                        <th className="py-2 px-4 border-b">Division</th>
                                        <th className="py-2 px-4 border-b">Attendance Status</th>
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
                                            <td className="py-2 px-4 border-b">Present / Absent</td>
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