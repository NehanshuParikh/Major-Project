import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa"; // Importing the React Icons for up and down arrows

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqData = [
    {
      question: "What is the purpose of the education tracking system?",
      answer:
        "The purpose of the education tracking system is to provide real-time insights and data-driven solutions that enhance student outcomes and simplify educational management.",
    },
    {
      question: "How do I use this platform?",
      answer:
        "You can sign up, log in, and start tracking your educational progress through various tools provided by the platform. We offer analytics, real-time feedback, and personalized learning paths.",
    },
    {
      question: "Is the system free to use?",
      answer:
        "The platform offers both free and paid tiers, with the free tier providing basic features, and the premium tier unlocking advanced features such as detailed reports and real-time collaboration.",
    },
    {
      question: "How does the platform benefit educators?",
      answer:
        "Educators can use the system to make informed decisions based on real-time data, track student progress, and personalize learning paths to ensure better outcomes for their students.",
    },
  ];

  const toggleAnswer = (index) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index)); // Toggle active index
  };

  return (
    <div className="w-full h-screen bg-black text-white flex items-center justify-center py-8 sm:py-16">
      <div className="faq-section w-full max-w-4xl px-4 sm:px-8">
        <div className="text-center text-2xl sm:text-3xl lg:text-[4rem] font-bold text-white mb-12">
          FAQ
        </div>

        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="faq-item bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition"
            >
              <div
                className="faq-question text-lg sm:text-xl font-semibold cursor-pointer flex justify-between items-center"
                onClick={() => toggleAnswer(index)}
              >
                {faq.question}

                {/* Show the arrow icon based on the active index */}
                {activeIndex === index ? (
                  <FaChevronUp className="text-white" />
                ) : (
                  <FaChevronDown className="text-white" />
                )}
              </div>

              <div
                className="faq-answer mt-2 text-base sm:text-lg text-gray-300"
                style={{
                  display: activeIndex === index ? "block" : "none", // Only show the active answer
                }}
              >
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
