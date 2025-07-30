'use client'

import React, { useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const AudioThankYouPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // After 5 seconds, navigate back to menu if user was authenticated
    const timer = setTimeout(() => {
      const hasPin = sessionStorage.getItem('lastPinEntry');
      if (hasPin) {
        router.push('/menu');
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
      <div className="max-w-md w-full mx-auto text-center p-8">
        <div className="mb-8">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Thank You!
          </h1>
          <p className="text-lg text-gray-600">
            Your employment information has been successfully submitted.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-gray-600 mb-4">
            We appreciate your participation in the NY Youth Jobs Program.
          </p>
          <div className="text-sm text-gray-500">
            You will be automatically redirected in a few seconds...
          </div>
        </div>
      </div>
    </div>
  );
};
