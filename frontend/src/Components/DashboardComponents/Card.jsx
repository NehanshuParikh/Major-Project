import React from 'react';
import { useNavigate } from 'react-router';

const Card = ({ title, description, action }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white transition-colors duration-500 ease-in-out dark:bg-gray-800 p-4 rounded static shadow-md w-auto full md:w-1/4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
    onClick={()=>{ navigate(action) }}>
      <h3 className="text-lg font-bold dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
};

export default Card;
