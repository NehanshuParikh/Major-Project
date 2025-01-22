import { Line } from "react-chartjs-2";

const LineChart = ({ attendanceData, studentId }) => {
  // Filter data for the specific student
  const studentData = attendanceData.filter((record) => record.studentId === attendanceData.enrollment);

  // Group data by date
  const countByDate = studentData.reduce((acc, record) => {
    acc[record.date] = (acc[record.date] || 0) + 1;
    return acc;
  }, {});

  const labels = Object.keys(countByDate); // Dates
  const dataValues = Object.values(countByDate); // Attendance counts

  const data = {
    labels,
    datasets: [
      {
        label: `Attendance Trend Over Time for Student ${studentId}`,
        data: dataValues,
        fill: false,
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="chart-container">
      <Line data={data} />
    </div>
  );
};

export default LineChart;
