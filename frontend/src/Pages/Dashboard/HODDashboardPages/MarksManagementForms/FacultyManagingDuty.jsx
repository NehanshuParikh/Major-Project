import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../../Components/DashboardComponents/DashboardLayout';
import { toast } from 'react-hot-toast';

const BASEURL = 'http://localhost:5000/api';

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const token = parts.pop().split(';').shift();
    console.log(`Token retrieved from cookies: ${token}`); // Log the token
    return token;
  }
  console.log('Token not found in cookies');
  return null;
};


// Helper function to calculate days remaining until expiration
const calculateDaysRemaining = (expiresAt) => {
  const expirationDate = new Date(expiresAt);
  const currentDate = new Date();
  const diffTime = expirationDate - currentDate;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
};

const FacultyManagingDuty = () => {
  const [duties, setDuties] = useState([]);
  const token = getCookie('token');

  useEffect(() => {
    const fetchDuties = async () => {
      if (!token) {
        toast.error('No valid token found');
        return;
      }

      try {
        const response = await fetch(`${BASEURL}/marksManagement/faculty/duties`, {
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

    fetchDuties();
  }, [token]);

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-5 text-center dark:text-white">Faculty Duty Management</h1>
        {duties.length > 0 ? (
          <div className="overflow-x-auto rounded-lg shadow-lg">
            <table className="min-w-full bg-white dark:bg-gray-800 dark:text-white border border-gray-200 dark:border-gray-800 ">
              <thead className="bg-gray-100 dark:bg-gray-800 dark:text-white">
                <tr>
                  <th className="py-2 px-4 border-b dark:border-gray-500 text-left text-gray-600 dark:text-white">S. No.</th>
                  <th className="py-2 px-4 border-b dark:border-gray-500 text-left text-gray-600 dark:text-white">Duty Title</th>
                  <th className="py-2 px-4 border-b dark:border-gray-500 text-left text-gray-600 dark:text-white">Assigned On</th>
                  <th className="py-2 px-4 border-b dark:border-gray-500 text-left text-gray-600 dark:text-white">Assigned By</th>
                  <th className="py-2 px-4 border-b dark:border-gray-500 text-left text-gray-600 dark:text-white">Status</th>
                  <th className="py-2 px-4 border-b dark:border-gray-500 text-left text-gray-600 dark:text-white">Expires In</th>
                </tr>
              </thead>
              <tbody>
                {duties.map((duty, index) => (
                  <tr key={duty.id} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                    <td className="py-2 px-4">{index + 1}</td>
                    <td className="py-2 px-4 capitalize">{duty.dutyName}</td>
                    <td className="py-2 px-4">
                      {new Date(duty.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </td>
                    <td>{duty.hodId.fullName}</td>
                    <td className="py-2 px-4">
                      <span className={`inline-block px-2 py-1 rounded-full text-white ${duty.status === 'Completed' ? 'bg-green-500' : 'bg-red-500'}`}>
                        {duty.status}
                      </span>
                    </td>
                    <td className="py-2 px-4">
                      {calculateDaysRemaining(duty.expiresAt)} days
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
    </DashboardLayout>
  );
};

export default FacultyManagingDuty;
