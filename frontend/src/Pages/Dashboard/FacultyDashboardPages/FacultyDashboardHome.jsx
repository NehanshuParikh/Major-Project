import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import DashboardLayout from "../../../Components/DashboardComponents/DashboardLayout";

const BASEURL = 'http://localhost:5000/api';


const FacultyDashboardHome = () => {
  const navigate = useNavigate();

  const [duties, setDuties] = useState([]);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        navigate("/api/auth/login");
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  useEffect(() => {
    const fetchDuties = async () => {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      if (!token) {
        console.error("No valid token found");
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
          throw new Error("Failed to fetch duties");
        }

        const data = await response.json();
        const sortedDuties = data.permissions.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setDuties(sortedDuties);
      } catch (error) {
        console.error("Error fetching duties:", error);
      }
    };

    fetchDuties();
  }, []);

  const modules = [
    {
      title: "Marks Module",
      description: "Enter and analyze student marks for different subjects.",
      actionText: "Go to Marks",
      action: () => navigate("/api/dashboard/marks-management/addmarks"),
    },
    {
      title: "Attendance Module",
      description: "Mark attendance and view attendance reports for students.",
      actionText: "Go to Attendance",
      action: () => navigate("/api/dashboard/attendance/view-units"),
    },
    {
      title: "Duties Assigned",
      description: "View duties assigned by HODs for marks.",
      actionText: "View Duties",
      action: () =>
        navigate(
          "/api/dashboard/marks-management/permissions/Faculty-viewing-panel"
        ),
    },
  ];

  return (
    <>
      <DashboardLayout>
        <div className="p-6">
          {/* Modules Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {modules.map((module, index) => (
              <div
                key={index}
                className="p-6 bg-white dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white border rounded shadow hover:shadow-lg transition"
              >
                <h2 className="text-xl font-semibold mb-2">{module.title}</h2>
                <p className="text-gray-600 dark:text-white mb-4">{module.description}</p>
                <button
                  onClick={module.action}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  {module.actionText}
                </button>
              </div>
            ))}
          </div>

          {/* Duties Section */}
          <div>
            <h2 className="text-2xl font-bold mb-4 dark:text-white">Recent Duties</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {duties.slice(0, 2).map((duty, index) => (
                <div
                  key={index}
                  className={`p-4 bg-gray-100 border rounded shadow hover:shadow-md transition relative ${duty.status === 'Completed' ? 'bg-green-200 shadow-green-800' : 'bg-red-200 shadow-red-800'} cursor-pointer`}
                  
                >
                  <h3 className="text-lg font-semibold capitalize">{duty.subject} - {duty.examType}</h3>
                  <p className="text-gray-600"><span className="capitalize">{duty.level}</span> <span className="uppercase">{duty.branch}</span> <span className="uppercase"> {duty.school}</span></p>
                  <p className="text-sm text-gray-500 mt-2">
                    Expires At: {new Date(duty.expiresAt).toLocaleDateString()}
                  </p>
                  <span className={`absolute bottom-2 right-1 w-18 px-2 py-1 text-center text-xs rounded-full text-white ${duty.status === 'Completed' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {duty.status}
                  </span>
                </div>
              ))}
            </div>
            {duties.length > 2 && (
              <div className="mt-4">
                <button
                  onClick={() =>
                    navigate(
                      "/api/dashboard/marks-management/permissions/Faculty-viewing-panel"
                    )
                  }
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  See All Duties
                </button>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default FacultyDashboardHome;
