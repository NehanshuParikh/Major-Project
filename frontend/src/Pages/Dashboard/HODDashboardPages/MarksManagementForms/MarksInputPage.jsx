import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../../Components/DashboardComponents/DashboardLayout';
import { toast } from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';

const MarksInputPage = () => {
    const [timer, setTimer] = useState(0);
    const [students, setStudents] = useState([]);
    const [marksData, setMarksData] = useState({});
    const location = useLocation();
    const metaData = location.state || JSON.parse(localStorage.getItem("marksMetaData"));
    const Navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prevTimer) => prevTimer + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            console.log("Meta data", metaData);
            const res = await fetch('http://localhost:5000/api/marksManagement/getStudentsByClass', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                credentials: 'include',
                body: JSON.stringify(metaData),
            });

            const data = await res.json();
            if (res.ok) {
                setStudents(data.students);
            } else {
                toast.error(data.message || 'Failed to fetch students');
            }
        } catch (error) {
            console.error('Error fetching students:', error);
            toast.error('Error fetching students');
        }
    };

    const handleMarksChange = (studentId, value) => {
        setMarksData({ ...marksData, [studentId]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // start loading
        try {
            const res = await fetch('http://localhost:5000/api/marksManagement/marksEntry', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                credentials: 'include',
                body: JSON.stringify({
                    meta: metaData,
                    marks: Object.entries(marksData).map(([studentId, marks]) => ({
                        studentId,
                        marks
                    }))
                })
            });

            const result = await res.json();
            if (res.ok) {
                toast.success(result.message);
                toast.success("Now you can Exit the session")
                setLoading(false); // stop loading
            } else {
                toast.error(result.message || 'Failed to enter marks');
            }
        } catch (error) {
            console.error('Error submitting marks:', error);
            toast.error('Error submitting marks');
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Marks Input Page</h1>
                <p className="text-center text-lg text-gray-600 mb-4">Session Timer: {Math.floor(timer / 60)}:{timer % 60}</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <table className="w-full table-auto border border-gray-300 mt-4">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-4 py-2 text-left">Student</th>
                                <th className="px-4 py-2 text-left">Enter Marks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student) => (
                                <tr key={student._id} className="border-t">
                                    <td className="px-4 py-2">
                                        {student.fullName} ({student.enrollmentId})
                                    </td>
                                    <td className="px-4 py-2">
                                        <input
                                            type="number"
                                            placeholder="Enter marks"
                                            value={marksData[student._id] || ''}
                                            onChange={(e) => handleMarksChange(student._id, e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>


                    <button
                        type="submit"
                        className={`w-full px-4 py-2 font-medium rounded-md ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                        disabled={loading}
                    >
                        {loading ? 'Submitting...' : 'Submit Marks'}
                    </button>
                </form>

                <button onClick={() => window.location.href = '/api/dashboard/marks-management/addmarks'} className="mt-4 w-full px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700">
                    Exit the session
                </button>

                <p className="text-red-500 mt-3 text-sm">NOTE: Do not leave this page unless you use the "Exit the Session" button.</p>
            </div>
        </DashboardLayout>
    );
};

export default MarksInputPage;
