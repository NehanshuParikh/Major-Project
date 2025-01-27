import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CalendarComponent = ({ attendanceData }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState("All"); // Subject filter state
  const [selectedSemester, setSelectedSemester] = useState("All"); // Semester filter state
  const [selectedDivision, setSelectedDivision] = useState("All"); // Division filter state
  const [startDate, setStartDate] = useState(null); // Start date for custom date range
  const [endDate, setEndDate] = useState(null); // End date for custom date range

  // Extract unique values for filtering dropdowns
  const subjects = ["All", ...new Set(attendanceData.map((record) => record.subject))];
  const semesters = ["All", ...new Set(attendanceData.map((record) => record.semester))];
  const divisions = ["All", ...new Set(attendanceData.map((record) => record.division))];

  // Filter attendance data based on selected filters (subject, semester, division)
  const filteredAttendanceData = attendanceData.filter((record) => {
    const subjectMatch = selectedSubject === "All" || record.subject === selectedSubject;
    const semesterMatch = selectedSemester === "All" || record.semester === selectedSemester;
    const divisionMatch = selectedDivision === "All" || record.division === selectedDivision;
    const dateMatch = (!startDate || new Date(record.date) >= startDate) &&
      (!endDate || new Date(record.date) <= endDate);
    return subjectMatch && semesterMatch && divisionMatch && dateMatch;
  });

  // Format filtered attendance data to mark dates
  const attendanceDates = filteredAttendanceData.map((record) => record.date);

  const isPresent = (date) => {
    // Adjust the selected date to remove the time part, convert to local date (no timezone shifts)
    const formattedDate = new Date(date).toLocaleDateString("en-CA"); // 'en-CA' gives 'YYYY-MM-DD' format
    return attendanceDates.includes(formattedDate);
  };
  const handleDateClick = (date) => {
    // Format the selected date to 'YYYY-MM-DD' (using 'en-CA' locale)
    const formattedDate = date.toLocaleDateString("en-CA"); // This ensures 'YYYY-MM-DD' format
  
    // Set the formatted date as the selected date
    setSelectedDate(formattedDate);
  };
  
  // Get attendance records for the selected date
  const recordsForSelectedDate = filteredAttendanceData.filter(
    (record) => record.date === selectedDate
  );

  return (
    <div className="flex flex-col overflow-auto w-full">
      <div className="flex w-full flex-col md:flex-row items-center justify-center my-4">
        <div className="filter-section px-4 py-2">
          {/* Filter Dropdowns */}
          <div className="mb-4">
            <label htmlFor="subjectFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Filter by Subject:
            </label>
            <select
              id="subjectFilter"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-white"
            >
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="semesterFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Filter by Semester:
            </label>
            <select
              id="semesterFilter"
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-white"
            >
              {semesters.map((semester) => (
                <option key={semester} value={semester}>
                  {semester}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="divisionFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Filter by Division:
            </label>
            <select
              id="divisionFilter"
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-white"
            >
              {divisions.map((division) => (
                <option key={division} value={division}>
                  {division}
                </option>
              ))}
            </select>
          </div>

          {/* Custom Date Range Filter */}
          <div className="mb-4">
            <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Filter by Date Range:
            </label>
            <div className="flex space-x-4">
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                placeholderText="Start Date"
                className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-white"
              />
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                placeholderText="End Date"
                className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>
        {/* Calendar */}
        <div className="calendar-container bg-gray-100 dark:bg-gray-800 p-4 rounded w-full overflow-auto flex items-center justify-center flex-col">
          <Calendar
            onChange={handleDateClick}
            tileClassName={({ date }) => {
              // Ensure that the date being passed to isPresent is correctly formatted
              return isPresent(date) ? "bg-green-500 text-white dark:bg-green-500" : "";
            }}
          />
          {/* Message for small screens */}
          <p className="text-red-500 text-sm mt-2">
            For a better viewing experience, switch to a larger device.(Preffered Device: Tablet or Laptop)
          </p>
        </div>

      </div>

      {/* Attendance Records for the Selected Date */}
      <div className="records-container bg-gray-100 dark:bg-gray-800 dark:text-white p-4 my-4 rounded flex-1 max-w-full overflow-auto">
        <h3 className="text-lg font-semibold mb-2">
          {selectedDate
            ? `Attendance Records for ${selectedDate} (${selectedSubject}, ${selectedSemester}, ${selectedDivision})`
            : "Select a date to view attendance"}
        </h3>
        {selectedDate && recordsForSelectedDate.length > 0 ? (
          <table className="w-full border-collapse border border-gray-200 dark:border-gray-700">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="border border-gray-200 dark:border-gray-500 p-2">Time</th>
                <th className="border border-gray-200 dark:border-gray-500 p-2">Subject</th>
                <th className="border border-gray-200 dark:border-gray-500 p-2">Semester</th>
                <th className="border border-gray-200 dark:border-gray-500 p-2">Division</th>
                <th className="border border-gray-200 dark:border-gray-500 p-2">Attendance Taken By</th>
              </tr>
            </thead>
            <tbody>
              {recordsForSelectedDate.map((record) => (
                <tr key={record._id}>
                  <td className="border border-gray-200 dark:border-gray-500 p-2">{record.time}</td>
                  <td className="border border-gray-200 dark:border-gray-500 p-2">{record.subject}</td>
                  <td className="border border-gray-200 dark:border-gray-500 p-2">{record.semester}</td>
                  <td className="border border-gray-200 dark:border-gray-500 p-2">{record.division}</td>
                  <td className="border border-gray-200 dark:border-gray-500 p-2">{record.attendanceTakenBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : selectedDate ? (
          <p className="text-gray-500">No attendance records for this date.</p>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default CalendarComponent;
