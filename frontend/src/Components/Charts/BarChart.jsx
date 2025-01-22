import { Bar } from "react-chartjs-2";

const BarChart = ({ attendanceData, studentId }) => {
  // Filter data for the specific student
  const studentData = attendanceData.filter((record) => record.studentId === attendanceData.enrollment);

  // Group data by division
  const countByDivision = studentData.reduce((acc, record) => {
    acc[record.division] = (acc[record.division] || 0) + 1;
    return acc;
  }, {});

  const labels = Object.keys(countByDivision); // Division names
  const dataValues = Object.values(countByDivision); // Attendance counts

  const data = {
    labels,
    datasets: [
      {
        label: `Attendance Count by Division for Student ${studentId}`,
        data: dataValues,
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="chart-container">
      <Bar data={data} />
    </div>
  );
};

export default BarChart;
