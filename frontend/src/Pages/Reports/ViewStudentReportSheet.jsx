import React, { useState } from 'react'
import DashboardLayout from '../../Components/DashboardComponents/DashboardLayout'
import { useLoading } from '../../Context/LoadingContext';
import toast from 'react-hot-toast';


const BASEURL = 'http://localhost:5000/api';
const STUDENT_SEARCH_URL = 'http://localhost:5000/api/user/student-search'; // Ensure this is the correct endpoint

const ViewStudentReportSheet = () => {
  const [formData, setFormData] = useState({
    studentNameOrId: '' // Field to handle faculty name or ID
  });
  const [details, setDetails] = useState({
    name: '',
    enrollmentNumber: '',
    email: '',
    mobile: '',
    profilePhoto: '',
  });

  const [isDownloading, setIsDownloading] = useState(false)

  const [marksDetails, setMarksDetails] = useState([]);

  const examTypes = ['mid-sem-1', 'mid-sem-2', 'external'];
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

  const uniqueSubjects = Array.from(new Set(marksDetails.map(mark => mark.subject)));

  const [selectedExamType, setSelectedExamType] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  // Update handleFilterChange to include 'subject'
  const handleFilterChange = (filterType, value) => {
    if (filterType === 'examType') {
      setSelectedExamType(value); // Update selected exam type
    } else if (filterType === 'semester') {
      setSelectedSemester(value); // Update selected semester
    } else if (filterType === 'subject') {
      setSelectedSubject(value); // Update selected subject
    }
  };

  // Update filteredMarksDetails to respect all filters
  const filteredMarksDetails = marksDetails.filter((mark) => {
    return (
      (selectedExamType ? mark.examType === selectedExamType : true) &&
      (selectedSemester ? mark.semester === selectedSemester : true) &&
      (selectedSubject ? mark.subject === selectedSubject : true)
    );
  });

  console.log(filteredMarksDetails)

  const [suggestions, setSuggestions] = useState([]); // To store user suggestions
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { setLoading } = useLoading();


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // Fetch suggestions when typing in the faculty input
    if (e.target.name === "studentNameOrId" && e.target.value.length > 1) {
      fetchSuggestions(e.target.value);
    } else {
      setShowSuggestions(false); // Hide suggestions when input is less than 2 characters
    }
  };


  const fetchSuggestions = async (query) => {
    const token = localStorage.getItem('token'); // Get the token at the beginning

    try {
      const response = await fetch(`${STUDENT_SEARCH_URL}?query=${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Filter out student user types
          const filteredUsers = data.users.filter(user => user.userType !== 'student');
          setSuggestions(filteredUsers); // Set filtered users or empty array
          setShowSuggestions(true); // Show the suggestions
        } else {
          setSuggestions([]); // No success, no suggestions
          setShowSuggestions(true); // Still show empty suggestions
        }
      } else {
        console.error('Error fetching suggestions:', response.statusText);
        setSuggestions([]); // Error means no suggestions
        setShowSuggestions(true); // Still show empty suggestions
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]); // If error, no suggestions
      setShowSuggestions(true); // Still show empty suggestions
    }
  };

  const handleSelectSuggestion = (student) => {
    setFormData({ ...formData, studentNameOrId: `${student.enrollmentId}` });
    setShowSuggestions(false); // Hide suggestions after selection
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('No token found. Please log in.');
      setLoading(false);
      return;
    }



    try {
      const queryParams = new URLSearchParams({
        searchQuery: formData.studentNameOrId,
        examType: formData.examType || '', // Include if exists
        semester: formData.semester || '' // Include if exists
      }).toString();

      const response = await fetch(`${BASEURL}/reports/view/studentReportSheet?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });


      const responseData = await response.json();
      setLoading(false);

      if (response.ok && responseData.success) {
        toast.success('Report fetched successfully');
        setDetails(responseData.data.studentDetails);
        setMarksDetails(responseData.data.marksDetails);
        setFormData({
          examType: '',
          subject: '',
          branch: '',
          level: '',
          school: '',
          division: '',
          semester: '',
          facultyNameOrId: ''
        });
        setSuggestions([]);
      } else {
        toast.error(responseData.message || 'Failed to fetch report');
      }
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
      toast.error('An error occurred');
    }
  };

  const handleDownloadButton = async (e, query) => {
    e.preventDefault();
    console.log('Query passed to handleDownloadButton:', query);
    if (!query) {
      alert('Search query is required.');
      return;
    }

    if (!details.name || filteredMarksDetails.length === 0) {
      alert('No data available to generate the report.');
      return;
    }

    setIsDownloading(true);

    const token = localStorage.getItem('token');
    const searchQuery = encodeURIComponent(query);
    console.log('Encoded Search Query:', searchQuery);

    try {
      const response = await fetch(`http://localhost:5000/api/reports/student-report?searchQuery=${searchQuery}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          marksDetails: filteredMarksDetails,
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Report_${searchQuery}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        setIsDownloading(false);
      } else {
        console.error('Failed to download report:', response.statusText);
        alert('Failed to download the report. Please try again.');
        setIsDownloading(false);
      }
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('An error occurred while downloading the report.');
      setIsDownloading(false);
    }
  };
  return (
    <DashboardLayout>
      <label className="text-sm font-medium text-gray-700 dark:text-white">Student Name or ID</label>
      <form onSubmit={handleSubmit} method="post" className='w-full flex items-center justify-start gap-2'>
        {/* Student Name or ID with auto-suggestion */}
        <div className='w-10/12'>
          <input
            type="text"
            name="studentNameOrId"
            value={formData.studentNameOrId}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md"
            placeholder="Enter Student Name or ID"
            required
          />
          {showSuggestions && (
            <ul className="border border-gray-300  dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md mt-2">
              {/* Check if there are suggestions */}
              {suggestions.length > 0 ? (
                suggestions.map((student) => (
                  <li
                    key={student._id}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => handleSelectSuggestion(student)}
                  >
                    {student.fullName} ({student.enrollmentId})
                  </li>
                ))
              ) : (
                // Display 'No match found' if no suggestions are available
                <li className="p-2 text-gray-500">No match found</li>
              )}
            </ul>
          )}
        </div>
        <button
          type="submit"
          className=" w-auto inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Search
        </button>
      </form>
      <div className="w-full flex flex-col items-start justify-evenly mt-3 bg-gray-50 dark:bg-gray-800 dark:text-white rounded-lg p-4 shadow-lg">
        <h3 className="text-lg w-full border-b-2 border-b-gray-200 dark:border-b-gray-500 pb-2">Filters:</h3>
        <div className="flex w-full items-center justify-start gap-4 mt-2">
          {/* Exam Type Filter */}
          <div className=''>
            <h4 className="font-medium mb-1">Exam Type</h4>
            <div className="flex gap-2">
              <button
                onClick={() => handleFilterChange('examType', '')} // "All" resets the filter
                className={`px-3 py-1 border rounded-md ${!selectedExamType ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
              >
                All
              </button>
              {examTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => handleFilterChange('examType', type)}
                  className={`px-3 py-1 border rounded-md capitalize ${selectedExamType === type ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Semester Filter */}
          <div>
            <h4 className="font-medium mb-1">Semester</h4>
            <div className="flex gap-2">
              <button
                onClick={() => handleFilterChange('semester', '')} // "All" resets the filter
                className={`px-3 py-1 border rounded-md  ${!selectedSemester ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
              >
                All
              </button>
              {semesters.map((sem) => (
                <button
                  key={sem}
                  onClick={() => handleFilterChange('semester', sem)}
                  className={`px-3 py-1 border rounded-md ${selectedSemester === sem ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                >
                  {sem}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Subject Filter */}
        <div className='mt-3'>
          <h4 className='font-medium mb-1'>Subject</h4>
          <div className='flex gap-2'>
            <button
              onClick={() => handleFilterChange('subject', '')}
              className={`px-3 py-1 border rounded-md  ${!selectedSubject ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
              All
            </button>
            {uniqueSubjects.map((subject) => (
              <button
                key={subject}
                onClick={() => handleFilterChange('subject', subject)}
                className={`px-3 py-1 border rounded-md ${selectedSubject === subject ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
              >
                {subject}
              </button>
            ))}
          </div>
        </div>
      </div>

      {details.name && (
        <div className="mt-8 p-4 border border-gray-300 dark:border-gray-700 dark:text-white rounded-md shadow-md">

          <div className="w-full flex items-center justify-between">
            <h2 className="text-xl font-bold mb-4 text-gray-700 dark:text-white">Student Report</h2>
            <button
      onClick={(e) => handleDownloadButton(e, details.enrollmentNumber)}
      disabled={isDownloading} // Disable button while loading
      className={`w-auto inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
        isDownloading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
      }`}
    >
      {isDownloading ? 'Downloading...' : 'Download as PDF'}
    </button>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <img
              src={details.profilePhoto || 'https://via.placeholder.com/100'}
              alt="Profile"
              className="w-24 h-24 rounded-full border"
            />
            <div>
              <p><strong>Name:</strong> {details.name}</p>
              <p><strong>Enrollment Number:</strong> {details.enrollmentNumber}</p>
              <p><strong>Email:</strong> {details.email}</p>
              <p><strong>Mobile:</strong> {details.mobile || 'Not provided'}</p>
            </div>
          </div>

          <h3 className="text-lg font-medium mt-4">Marks Details</h3>
          {marksDetails.length > 0 ? (
            <table className="w-full mt-2 border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="border border-gray-200 dark:border-gray-500 p-2">Subject</th>
                  <th className="border border-gray-200 dark:border-gray-500 p-2">Exam Type</th>
                  <th className="border border-gray-200 dark:border-gray-500 p-2">Marks</th>
                  <th className="border border-gray-200 dark:border-gray-500 p-2">Semester</th>
                </tr>
              </thead>
              <tbody>
                {filteredMarksDetails.map((mark) => (
                  <tr key={mark._id} className='text-center'>
                    <td className="border border-gray-200 dark:border-gray-500 p-2 capitalize">{mark.subject}</td>
                    <td className="border border-gray-200 dark:border-gray-500 p-2 capitalize">{mark.examType}</td>
                    <td className="border border-gray-200 dark:border-gray-500 p-2">{mark.marks}</td>
                    <td className="border border-gray-200 dark:border-gray-500 p-2">{mark.semester}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 mt-2">No marks data available.</p>
          )}
        </div>
      )}
    </DashboardLayout>
  )
}

export default ViewStudentReportSheet