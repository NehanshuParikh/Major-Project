import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa'; // Importing close icon from react-icons
import { marked } from 'marked'; // Import marked to parse markdown

const ChatInterface = ({ toggleChat }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false); // Track if AI is typing
  const [error, setError] = useState(null); // Track error state
  const [userHasNotInteracted, setUserHasNotInteracted] = useState(true); // Track if user has interacted

  // Initialize with a demo message when chat first loads
  useEffect(() => {
    if (userHasNotInteracted) {
      setMessages([
        {
          text: "If you want to check the attendance of a student, please use the following format:",
          sender: 'bot-instruction'
        },
        {
          text: "Example: 'Was student with enrollment: 123 present on 01-01-2025 for subject: xyz?'",
          sender: 'bot-instruction'
        }
      ]);
    }
  }, [userHasNotInteracted]);

  const handleSend = async () => {
    const userMessage = input;
    setMessages([...messages, { text: userMessage, sender: 'user' }]);
    setInput(""); // Clear input field
    setError(null); // Reset error state

    // Mark that the user has interacted
    setUserHasNotInteracted(false);

    // Show typing animation
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:5000/api/getAIResponse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: userMessage }),
      });

      const data = await response.json();
      console.log(data); // Debugging to see the response
      // Parse AI response as Markdown to HTML
      const formattedResponse = marked(data.answer);

      setMessages([
        ...messages,
        { text: userMessage, sender: 'user' },
        { text: formattedResponse, sender: 'ai' },
      ]);
    } catch (error) {
      setError('Something went wrong! Please check your internet connection and try again.');
      setMessages([
        ...messages,
        { text: userMessage, sender: 'user' },
        { text: 'Sorry, there was an error fetching the response.', sender: 'ai' },
      ]);
    } finally {
      setIsTyping(false); // Stop typing animation
    }
  };

  return (
    <div className="fixed bottom-0 left-0 w-full h-full bg-gradient-to-t from-blue-100 via-indigo-100 to-purple-200 shadow-lg rounded-t-lg p-4 overflow-hidden">
      {/* Header */}
      <div className="bg-blue-500 text-white py-2 px-4 rounded-t-lg flex justify-between items-center">
        <span className="text-lg font-bold">Edu System</span>
        <span className="text-sm">Google Gemini Integrated AI</span>
        <button
          onClick={toggleChat}
          className="text-white hover:text-red-500 transition duration-300 ease-in-out"
        >
          <FaTimes size={20} />
        </button>
      </div>

      <div className="overflow-y-auto h-[calc(100%-160px)] mb-4 p-2 rounded-lg bg-white shadow-md">
        {messages.map((message, index) => (
          <div key={index} className={message.sender === 'user' ? "text-right" : "text-left"}>
            {/* Only show instructions if the user hasn't interacted */}
            {(message.sender !== 'bot-instruction' || userHasNotInteracted) && (
             <div
             className={`inline-block p-3 my-2 rounded-lg ${
               message.sender === 'user'
                 ? 'bg-blue-500 text-white'
                 : message.sender === 'bot-instruction'
                 ? 'bg-gray-200 text-black font-semibold'
                 : message.sender === 'ai' && message.text.toLowerCase().includes("absent")
                 ? 'bg-red-200 text-red-800 font-semibold'
                 : message.sender === 'ai'
                 ? 'bg-green-100 text-black'
                 : 'bg-gray-200'
             }`}
             dangerouslySetInnerHTML={{ __html: message.text }}
           ></div>
           
            )}
          </div>
        ))}

        {isTyping && (
          <div className="text-left">
            <div className="inline-block p-3 my-2 rounded-lg bg-gray-200 text-gray-500">
              <div className="typing-animation">...</div>
            </div>
          </div>
        )}

        {error && (
          <div className="text-left">
            <div className="inline-block p-3 my-2 rounded-lg bg-red-500 text-white">
              {error}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center mt-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
          className="w-full p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
        />
        <button
          onClick={handleSend}
          className="p-3 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition duration-300 ease-in-out"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
