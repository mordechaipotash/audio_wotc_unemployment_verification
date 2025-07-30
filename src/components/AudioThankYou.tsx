import React from 'react';
import { useNavigate } from 'react-router-dom';

export const AudioThankYou: React.FC = () => {
  const navigate = useNavigate();

  // Automatically redirect to home after 5 seconds
  React.useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Thank You!
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Your form has been successfully submitted.
        </p>
        <div className="text-sm text-gray-500">
          You will be redirected in a few seconds...
        </div>
      </div>
    </div>
  );
};

export default AudioThankYou; 