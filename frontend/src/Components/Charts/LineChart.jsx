import { Line } from "react-chartjs-2";

const LineChart = ({ attendanceData }) => {
  const labels = attendanceData.map((record) => record.date);
  const data = {
    labels,
    datasets: [
      {
        label: "Attendance Over Time",
        data: attendanceData.map(() => 1), // Example data
        fill: false,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
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
