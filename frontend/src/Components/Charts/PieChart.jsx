import { Pie } from "react-chartjs-2";

const PieChart = ({ attendanceData, studentId }) => {
  // Filter data for the specific student
  const studentData = attendanceData.filter((record) => record.studentId === attendanceData.enrollment);

  // Calculate attendance count for each subject
  const labels = [...new Set(studentData.map((record) => record.subject))];
  const counts = labels.map(
    (subject) => studentData.filter((record) => record.subject === subject).length
  );
  const total = counts.reduce((sum, count) => sum + count, 0);
  const percentages = counts.map((count) => ((count / total) * 100).toFixed(1)); // Percentage for each subject

  const data = {
    labels: labels.map((label, i) => `${label} (${percentages[i]}%)`), // Add percentage to labels
    datasets: [
      {
        label: `Attendance by Subject for Student ${studentId}`,
        data: counts,
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
      },
    ],
  };

  return (
    <div className="chart-container">
      <Pie data={data} />
    </div>
  );
};

export default PieChart;
