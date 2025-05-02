import React, { useState } from 'react';
import ChatInterface from './ChatInterface';
import { FaRobot } from 'react-icons/fa'; // Import robot icon

const AIButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button
        onClick={toggleChat}
        className="bg-blue-500 text-white p-4 rounded-full fixed bottom-6 right-6 shadow-lg hover:bg-blue-600 flex items-center justify-center"
          title="AI Helpdesk"
        aria-label="AI Helpdesk"
      >
        <FaRobot size={24} />{/* You can adjust size as needed */}
      </button>

      {isOpen && <ChatInterface toggleChat={toggleChat} />}
    </div>
  );
};

export default AIButton;
