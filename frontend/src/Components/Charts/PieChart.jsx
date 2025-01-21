import { Pie } from "react-chartjs-2";

const PieChart = ({ attendanceData }) => {
  const labels = [...new Set(attendanceData.map((record) => record.subject))];
  const data = {
    labels,
    datasets: [
      {
        label: "Attendance by Subject",
        data: labels.map(
          (subject) => attendanceData.filter((record) => record.subject === subject).length
        ),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
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
