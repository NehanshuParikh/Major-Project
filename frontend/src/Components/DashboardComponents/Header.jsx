// Header.js
import React, { useState } from 'react';
import { useTheme } from '../../Context/ThemeContext';
import { FaSun, FaMoon, FaBars } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import InternetStatus from "../InternetStatus"; // 👈 import here

const Header = ({ toggleSidebar }) => {
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate()


  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })

      const data = await response.json();

      if (data.success) {
        navigate('/api/auth/login')
      } else {
        console.error(data.error)
      }

    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  return (
<header className={`p-4 transition-colors duration-500 ease-in-out ${darkMode ? 'bg-[#24303F]' : 'bg-[#FFFFFF]'} flex flex-col lg:flex-row lg:justify-between items-center w-full`}>
      
      {/* Top section: Dashboard + Theme Toggle + Sidebar Toggle */}
      <div className="flex justify-between items-center w-full lg:w-auto mb-4 lg:mb-0 gap-3">
        <h1 className="text-lg font-bold text-black dark:text-white">Dashboard</h1>
        
        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-all">
            {darkMode ? <FaSun className="text-yellow-500" /> : <FaMoon className="text-blue-500" />}
          </button>
          <button onClick={toggleSidebar} className="text-black dark:text-white p-2 rounded block lg:hidden">
            <FaBars />
          </button>
        </div>
      </div>

      {/* Bottom section: Internet Status + Logout */}
      <div className="w-full flex justify-between lg:justify-end items-center gap-4">
        <InternetStatus />
        <button onClick={handleLogout} className="bg-red-500 text-white p-2 px-4 rounded">
          Logout
        </button>
      </div>

    </header>
  );
};

export default Header