import React from "react";

const Footer = () => {
  return (
    <div className="footer bg-black text-white py-8 px-4 sm:px-8">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        {/* Edu Tracking System Animated Text */}
        <div className="edu-tracking-system text-2xl sm:text-3xl font-bold sm:mb-0 animate__animated animate__fadeIn">
          Edu Tracking System
        </div>

        {/* Copyright */}
        <div className="copyright text-xs md:text-md text-gray-400 p-4">
          &copy; {new Date().getFullYear()} Edu Tracking System. All rights reserved.
        </div>
        {/* Footer Links */}
        <div className="footer-links flex flex-col sm:flex-row gap-4 sm:mb-0">
          <a href="#about" className="footer-link hover:text-gray-300">
            Made By Code Red Developers with 💛
          </a>
        </div>

      </div>
    </div>
  );
};

export default Footer;
