import React, { useEffect, useState } from "react";
import DashboardLayout from "../../Components/DashboardComponents/DashboardLayout";

const ViewUnits = () => {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Helper function to get a cookie by name
  function getCookie(name) {
    const cookieString = document.cookie;
    const cookies = cookieString.split("; ");
    for (let cookie of cookies) {
      const [key, value] = cookie.split("=");
      if (key === name) {
        return decodeURIComponent(value);
      }
    }
    return null;
  }

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        // Retrieve the token from cookies
        const token = getCookie("token"); // Replace "token" with the actual name of your cookie

        if (!token) {
          throw new Error("Token not found in cookies");
        }

        const response = await fetch("http://localhost:5000/api/units/view-units", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Attach the token from cookies
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Units data:", data);

        if (data.success) {
          setUnits(data.units); // Set the units in your state or component
          setLoading(false); // Stop loading
        } else {
          setError(data.message || "Failed to fetch units");
          setLoading(false); // Stop loading
        }
      } catch (error) {
        console.error("Error fetching units:", error);
        setError("Error fetching units.");
        setLoading(false); // Stop loading
      }
    };

    fetchUnits();
  }, []);

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4 dark:text-white">View Units</h1>
        {loading ? (
          <p className="dark:text-white">Loading units...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (units && units.length === 0) ? ( // Ensure units is defined before accessing its length
          <p>No units found.</p>
        ) : (
          <table className="table-auto border-collapse border border-gray-300 dark:border-gray-700 dark:text-white w-full">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">HOD</th>
                <th className="border border-gray-300 px-4 py-2">Subject</th>
                <th className="border border-gray-300 px-4 py-2">Faculty</th>
                <th className="border border-gray-300 px-4 py-2">Level</th>
                <th className="border border-gray-300 px-4 py-2">Branch</th>
                <th className="border border-gray-300 px-4 py-2">School</th>
                <th className="border border-gray-300 px-4 py-2">Semester</th>
                <th className="border border-gray-300 px-4 py-2">Division</th>
              </tr>
            </thead>
            <tbody>
              {units && units.length > 0 ? (
                units.map((unit, index) => (
                  <tr key={index} className="hover:bg-gray-200 dark:hover:bg-gray-700">
                    <td className="border border-gray-300 px-4 py-2 text-sm">{unit.hod?.fullName || 'N/A'}</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">
                      {unit.subject?.name || 'N/A'} ({unit.subject?.code || 'N/A'})
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">{unit.faculty?.fullName || 'N/A'}</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">{unit.Level || 'N/A'}</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">{unit.Branch || 'N/A'}</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">{unit.School || 'N/A'}</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">{unit.Semester || 'N/A'}</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">{unit.Division || 'N/A'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center border border-gray-300 px-4 py-2 text-sm">
                    No units found. HOD will assign you the unit very soon...
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ViewUnits;
