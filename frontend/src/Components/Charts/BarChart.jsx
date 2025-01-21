import { Bar } from "react-chartjs-2";

const BarChart = ({ attendanceData }) => {
  const labels = attendanceData.map((record) => record.date);
  const data = {
    labels,
    datasets: [
      {
        label: "Attendance Count",
        data: attendanceData.map(() => 1), // Assuming 1 attendance per record
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
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
