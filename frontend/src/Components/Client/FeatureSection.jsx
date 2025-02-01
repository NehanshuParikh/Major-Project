import React, { useState } from 'react';

const FeatureSection = () => {
  // State to track which tab is selected
  const [selectedTab, setSelectedTab] = useState('attendance');

  // Sample content for each tab
  const featuresContent = {
    attendance: {
      videoUrl: '/Video.mp4', // Local video URL
      description: 'Attendance system allows teachers to manage student attendance effectively.',
    },
    smartAttendance: {
      videoUrl: '/videos/smartAttendance.mp4', // Local video URL
      description: 'Smart Attendance uses facial recognition technology to mark student attendance.',
    },
    manageMarks: {
      videoUrl: '/videos/manageMarks.mp4', // Local video URL
      description: 'Easily manage and track student marks for better academic progress monitoring.',
    },
    generateReports: {
      videoUrl: '/videos/generateReports.mp4', // Local video URL
      description: 'Generate detailed academic reports based on attendance and marks.',
    },
  };

  // Handler to change the selected tab
  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  return (
    <div className="feature-section py-16 px-4 sm:px-6 lg:px-8">
      <h2 className="text-white text-center font-bold text-[2rem] sm:text-[4rem] py-6">FEATURES:</h2>
      <div className="tabs flex gap-6 justify-center mb-10 flex-wrap">
        {/* Tab Buttons */}
        <button
          onClick={() => handleTabClick('attendance')}
          className={`tab-button px-6 py-3 text-lg font-semibold rounded-lg transition-all w-full sm:w-auto mb-4 sm:mb-0 ${
            selectedTab === 'attendance' ? 'bg-teal-600 text-white' : 'bg-white text-teal-600 border border-teal-600'
          }`}
        >
          Attendance
        </button>
        <button
          onClick={() => handleTabClick('smartAttendance')}
          className={`tab-button px-6 py-3 text-lg font-semibold rounded-lg transition-all w-full sm:w-auto mb-4 sm:mb-0 ${
            selectedTab === 'smartAttendance' ? 'bg-teal-600 text-white' : 'bg-white text-teal-600 border border-teal-600'
          }`}
        >
          Smart Attendance
        </button>
        <button
          onClick={() => handleTabClick('manageMarks')}
          className={`tab-button px-6 py-3 text-lg font-semibold rounded-lg transition-all w-full sm:w-auto mb-4 sm:mb-0 ${
            selectedTab === 'manageMarks' ? 'bg-teal-600 text-white' : 'bg-white text-teal-600 border border-teal-600'
          }`}
        >
          Manage Marks
        </button>
        <button
          onClick={() => handleTabClick('generateReports')}
          className={`tab-button px-6 py-3 text-lg font-semibold rounded-lg transition-all w-full sm:w-auto mb-4 sm:mb-0 ${
            selectedTab === 'generateReports' ? 'bg-teal-600 text-white' : 'bg-white text-teal-600 border border-teal-600'
          }`}
        >
          Generate Reports
        </button>
      </div>

      {/* Content Section */}
      <div className="feature-content bg-white p-8 rounded-lg shadow-xl mx-auto max-w-4xl">
        <h2 className="text-3xl font-bold text-center mb-6">
          {selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1).replace(/([A-Z])/g, ' $1')}
        </h2>

        {/* Video */}
        <div className="video-container mb-6">
          <video
            width="100%"
            height="auto"
            controls
            className="rounded-lg"
          >
            <source src={featuresContent[selectedTab].videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Description */}
        <p className="text-lg text-gray-700">{featuresContent[selectedTab].description}</p>
      </div>
    </div>
  );
};

export default FeatureSection;
