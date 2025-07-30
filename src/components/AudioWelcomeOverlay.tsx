'use client'

import React from 'react';
import { Volume2, Clock, CheckCircle2, ArrowRight } from 'lucide-react';

interface AudioWelcomeOverlayProps {
  onStart: () => void;
}

export const AudioWelcomeOverlay: React.FC<AudioWelcomeOverlayProps> = ({ onStart }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-8 text-center">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome to the NY Youth Jobs Program
          </h1>

          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center space-x-3 text-gray-600">
              <Volume2 className="w-6 h-6 flex-shrink-0 text-blue-600" />
              <p className="text-left">This is an audio-guided form. Please make sure your sound is turned on.</p>
            </div>

            <div className="flex items-center space-x-3 text-gray-600">
              <Clock className="w-6 h-6 flex-shrink-0 text-blue-600" />
              <p className="text-left">The process will only take a few minutes to complete.</p>
            </div>

            <div className="flex items-center space-x-3 text-gray-600">
              <CheckCircle2 className="w-6 h-6 flex-shrink-0 text-blue-600" />
              <p className="text-left">You&apos;ll be asked a few simple questions about your employment status.</p>
            </div>
          </div>

          <button
            onClick={onStart}
            className="w-full px-8 py-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-lg font-semibold transition-colors inline-flex items-center justify-center space-x-2"
          >
            <span>Begin Audio Guide</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
