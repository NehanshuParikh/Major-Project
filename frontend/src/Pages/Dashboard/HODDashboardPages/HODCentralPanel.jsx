import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../Components/DashboardComponents/DashboardLayout';
import toast from 'react-hot-toast';
import { FaTrash } from 'react-icons/fa';

const BASEURL = 'http://localhost:5000/api';

// Helper function to get the token from cookies
const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
};

// Helper function to calculate days remaining until expiration
const calculateDaysRemaining = (expiresAt) => {
    const expirationDate = new Date(expiresAt);
    const currentDate = new Date();
    const diffTime = expirationDate - currentDate;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
};

const HODCentralPanel = () => {
    const [duties, setDuties] = useState([]);
    const [units, setUnits] = useState([]);
    const token = getCookie('token');

    const fetchDuties = async () => {
        if (!token) {
            toast.error('No valid token found');
            return;
        }

        try {
            const response = await fetch(`${BASEURL}/marksManagement/hod/assigned-duties`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to fetch duties');
            }

            const data = await response.json();
            const sortedDuties = data.permissions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setDuties(sortedDuties);
            toast.success('Duties fetched successfully');
        } catch (error) {
            console.error('Error fetching duties:', error);
            toast.error(error.message);
        }
    };

    const fetchUnitsAssignedByHOD = async () => {
        if (!token) {
            toast.error('No valid token found');
            return;
        }

        try {
            const response = await fetch(`${BASEURL}/units/view-particular-hod-assigned-units`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to fetch units');
            }

            const data = await response.json();
            setUnits(data.units);
            toast.success('Units fetched successfully');
        } catch (error) {
            console.error('Error fetching units:', error);
            toast.error(error.message);
        }
    };
    useEffect(() => {
        fetchDuties();
        fetchUnitsAssignedByHOD();
    }, [token]);

    const handleDelete = async (id) => {
        console.log(id);
        if (!token) {
            toast.error('No valid token found');
            return;
        }
    
        try {
            const response = await fetch(`${BASEURL}/units/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                credentials: 'include',
            });
    
            if (!response.ok) {
                throw new Error('Failed To Delete! Try Again');
            }
    
            toast.success('Record Deleted successfully');
            // Refetch data after deletion
            fetchDuties();
            fetchUnitsAssignedByHOD(); 
        } catch (error) {
            console.error('Error deleting the record:', error);
            toast.error(error.message);
        }
    };
    
    return (
        <DashboardLayout>
            <h1 className="text-3xl font-bold text-center dark:text-white">HOD Central Panel</h1>
            <div className="p-6">
                {/* Duties Table */}
                <h1 className="text-3xl font-bold mb-5 text-center dark:text-white">All Marks Entry Duties</h1>
                {duties.length > 0 ? (
                    <div className="overflow-x-auto rounded-lg shadow-lg">
                        <table className="min-w-full bg-white dark:bg-gray-800 border dark:text-white border-gray-200 dark:border-gray-700">
                            <thead className="bg-gray-100 dark:bg-gray-800">
                                <tr>
                                    <th className="py-2 px-4 border-b text-left text-gray-600 dark:text-white">S. No.</th>
                                    <th className="py-2 px-4 border-b text-left text-gray-600 dark:text-white">Faculty Name</th>
                                    <th className="py-2 px-4 border-b text-left text-gray-600 dark:text-white">Duty Title</th>
                                    <th className="py-2 px-4 border-b text-left text-gray-600 dark:text-white">Duty Assigned</th>
                                    <th className="py-2 px-4 border-b text-left text-gray-600 dark:text-white">Status</th>
                                    <th className="py-2 px-4 border-b text-left text-gray-600 dark:text-white">Expires In</th>
                                    <th className="py-2 px-4 border-b text-left text-gray-600 dark:text-white">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {duties.map((duty, index) => (
                                    <tr key={duty.id} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                                        <td className="py-2 px-4 border-b dark:border-b-gray-500">{index + 1}</td>
                                        <td className="py-2 px-4 border-b dark:border-b-gray-500">{duty.facultyName}</td>
                                        <td className="py-2 px-4 border-b dark:border-b-gray-500">{duty.dutyName}</td>
                                        <td className="py-2 px-4 border-b dark:border-b-gray-500">
                                            {new Date(duty.createdAt).toLocaleDateString('en-IN', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric'
                                            })}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            <span className={`inline-block px-2 py-1 rounded-full text-white ${duty.status === 'Completed' ? 'bg-green-500' : 'bg-red-500'}`}>
                                                {duty.status}
                                            </span>
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {calculateDaysRemaining(duty.expiresAt)} days
                                        </td>
                                        <td className="py-2 px-4 border-b cursor-pointer">
                                            <button onClick={()=>{ handleDelete(duty._id) }  } className='flex items-center justify-center bg-red-500 text-white p-2 gap-2 rounded-lg'>{<FaTrash />} Revoke </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center text-gray-500">No duties assigned yet.</p>
                )}
            </div>

            {/* Units Table */}
            <div className="p-6">
                <h1 className="text-3xl font-bold mb-5 text-center dark:text-white">All Assigned Attendance Units</h1>
                {units.length > 0 ? (
                    <div className="overflow-x-auto rounded-lg shadow-lg">
                        <table className="min-w-full bg-white dark:bg-gray-800 border dark:text-white border-gray-200 dark:border-gray-700">
                            <thead className="bg-gray-100 dark:bg-gray-800">
                                <tr>
                                    <th className="py-2 px-4 border-b text-left text-gray-600 dark:text-white">S. No.</th>
                                    <th className="py-2 px-4 border-b text-left text-gray-600 dark:text-white">Profile</th>
                                    <th className="py-2 px-4 border-b text-left text-gray-600 dark:text-white">Name</th>
                                    <th className="py-2 px-4 border-b text-left text-gray-600 dark:text-white">Email</th>
                                    <th className="py-2 px-4 border-b text-left text-gray-600 dark:text-white">Mobile</th>
                                    <th className="py-2 px-4 border-b text-left text-gray-600 dark:text-white">Level</th>
                                    <th className="py-2 px-4 border-b text-left text-gray-600 dark:text-white">Branch</th>
                                    <th className="py-2 px-4 border-b text-left text-gray-600 dark:text-white">Semester</th>
                                    <th className="py-2 px-4 border-b text-left text-gray-600 dark:text-white">Division</th>
                                    <th className="py-2 px-4 border-b text-left text-gray-600 dark:text-white">Subject</th>
                                    <th className="py-2 px-4 border-b text-left text-gray-600 dark:text-white">Code</th>
                                    <th className="py-2 px-4 border-b text-left text-gray-600 dark:text-white">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {units.map((unit, index) => (
                                    <tr key={unit._id} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                                        <td className="py-2 px-4 border-b dark:border-b-gray-500">{index + 1}</td>
                                        <td className="py-2 px-4 border-b dark:border-b-gray-500"><div className="w-20 h-20"><img src={unit.FacultyId.profilePhoto} alt="" srcset="" className='w-full h-full object-cover object-center' /></div></td>
                                        <td className="py-2 px-4 border-b dark:border-b-gray-500">{unit.FacultyId.fullName}</td>
                                        <td className="py-2 px-4 border-b dark:border-b-gray-500">{unit.FacultyId.email}</td>
                                        <td className="py-2 px-4 border-b dark:border-b-gray-500">{unit.FacultyId.mobile}</td>
                                        <td className="py-2 px-4 border-b dark:border-b-gray-500">{unit.Level}</td>
                                        <td className="py-2 px-4 border-b dark:border-b-gray-500">{unit.Branch}</td>
                                        <td className="py-2 px-4 border-b dark:border-b-gray-500">{unit.Semester}</td>
                                        <td className="py-2 px-4 border-b dark:border-b-gray-500">{unit.Division}</td>
                                        <td className="py-2 px-4 border-b dark:border-b-gray-500">{unit.Subject.SubjectName}</td>
                                        <td className="py-2 px-4 border-b dark:border-b-gray-500">{unit.Subject.SubjectCode}</td>
                                        <td className="py-2 px-4 border-b cursor-pointer">
                                        <button onClick={()=>{ handleDelete(duty._id) }  } className='flex items-center justify-center bg-red-500 text-white p-2 gap-2 rounded-lg'>{<FaTrash />} Revoke </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center text-gray-500">No units assigned yet.</p>
                )}
            </div>
        </DashboardLayout>
    );
};

export default HODCentralPanel;
