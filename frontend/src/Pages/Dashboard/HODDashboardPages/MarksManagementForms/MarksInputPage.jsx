import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../../Components/DashboardComponents/DashboardLayout';
import { toast } from 'react-hot-toast';

const MarksInputPage = () => {
    const [timer, setTimer] = useState(0);
    const [formData, setFormData] = useState({
        studentId: '',
        marks: ''
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prevTimer) => prevTimer + 1);
        }, 1000); // Increment timer every second

        // Cleanup the timer when the component unmounts
        return () => clearInterval(interval);
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/marksManagement/marksEntry', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                credentials: 'include', // Send cookies
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                toast.success(result.message);
            } else {
                toast.error(result.message || 'Failed to enter marks');
            }
        } catch (error) {
            console.error('Error submitting marks:', error);
            toast.error('Error submitting marks');
        }
    };

    const handleSessionLogout = () => {
        window.location.href = '/api/dashboard/marks-management/addmarks';
    };

    return (

        <DashboardLayout>
            <div className="max-w-lg mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    Marks Input Page
                </h1>
                <p className="text-center text-lg text-gray-600 mb-4">
                    Timer: {Math.floor(timer / 60)}:{timer % 60}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="studentId"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Student ID:
                        </label>
                        <input
                            type="text"
                            name="studentId"
                            id="studentId"
                            value={formData.studentId}
                            onChange={handleChange}
                            required
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="marks"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Marks:
                        </label>
                        <input
                            type="number"
                            name="marks"
                            id="marks"
                            value={formData.marks}
                            onChange={handleChange}
                            required
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Submit Marks
                    </button>
                </form>

                <button
                    onClick={handleSessionLogout}
                    className="w-full mt-4 px-4 py-2 bg-red-600 text-white font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                    Log Out of Session
                </button>
                <p className="text-red-500 mt-3">NOTE: Don't leave this page at any cost as this page will not be retrived again if you are leaving... then leave via clicking on the log out session button to terminate your session</p>
            </div>
        </DashboardLayout>
    );
};

export default MarksInputPage;
