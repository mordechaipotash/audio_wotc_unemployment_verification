'use client'

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { saveAudioFormSubmission, type AudioMetrics } from '@/lib/supabase';
import { AlertCircle } from 'lucide-react';
import { ProgressSteps } from './ui/ProgressSteps';
import { AudioWelcomeOverlay } from './AudioWelcomeOverlay';
import { DateInput } from './DateInput';

interface FormData {
  firstName: string;
  lastName: string;
  dob: string;
  employmentStatus: boolean;
  company: string;
  formStartTime: string;
  introAudioPlayed: boolean;
  employmentAudioPlayed: boolean;
  introAudioCompletionTime: number | null;
  employmentAudioCompletionTime: number | null;
  sessionId: string;
}

interface AudioFormProps {
  companyName: string;
  companyColor?: string;
}

export const AudioForm: React.FC<AudioFormProps> = ({ companyName }) => {
  const router = useRouter();
  const [step, setStep] = useState<'welcome' | 'intro' | 'employment'>('welcome');
  const [error, setError] = useState<string | null>(null);
  const [formStartTime] = useState(new Date().toISOString());
  const [audioStartTime, setAudioStartTime] = useState<number | null>(null);
  
  const [audioMetrics, setAudioMetrics] = useState<AudioMetrics>({
    introAudioPlayed: false,
    employmentAudioPlayed: false,
    totalAudioListenTimeSeconds: 0,
    introAudioCompletionTime: null,
    employmentAudioCompletionTime: null
  });

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    dob: '',
    company: companyName,
    employmentStatus: false,
    formStartTime: formStartTime,
    introAudioPlayed: false,
    employmentAudioPlayed: false,
    introAudioCompletionTime: null,
    employmentAudioCompletionTime: null,
    sessionId: crypto.randomUUID()
  });

  const [isButtonEnabled, setIsButtonEnabled] = useState(true);

  const handleAudioStart = (audioType: 'intro' | 'employment') => {
    setAudioStartTime(Date.now());
  };

  const handleAudioEnd = useCallback((audioType: 'intro' | 'employment') => {
    if (audioStartTime) {
      const listenTime = Math.round((Date.now() - audioStartTime) / 1000);
      setAudioMetrics(prev => ({
        ...prev,
        [`${audioType}AudioPlayed`]: true,
        totalAudioListenTimeSeconds: prev.totalAudioListenTimeSeconds + listenTime,
        [`${audioType}AudioCompletionTime`]: Date.now()
      }));
      setFormData(prev => ({
        ...prev,
        [`${audioType}AudioPlayed`]: true,
        [`${audioType}AudioCompletionTime`]: Date.now()
      }));
    }
  }, [audioStartTime]);

  const playIntroAudio = () => {
    console.log('Playing intro audio');
    setIsButtonEnabled(false);
    const audio = document.getElementById('introAudio') as HTMLAudioElement;
    if (audio) {
      audio.currentTime = 0;
      handleAudioStart('intro');
      audio.play()
        .then(() => {
          setIsButtonEnabled(true);
        })
        .catch(e => {
          console.error('Error playing intro audio:', e);
          setIsButtonEnabled(true);
        });
    }
  };

  const playEmploymentAudio = () => {
    console.log('Playing employment audio');
    // Don't disable buttons for employment audio
    const audio = document.getElementById('employmentAudio') as HTMLAudioElement;
    if (audio) {
      audio.currentTime = 0;
      handleAudioStart('employment');
      audio.play()
        .then(() => {
          console.log('Employment audio started successfully');
        })
        .catch(e => {
          console.error('Error playing employment audio:', e);
        });
    } else {
      console.error('Employment audio element not found');
    }
  };

  // Add event listeners for audio completion
  useEffect(() => {
    const introAudio = document.getElementById('introAudio') as HTMLAudioElement;
    const employmentAudio = document.getElementById('employmentAudio') as HTMLAudioElement;

    const handleIntroEnd = () => handleAudioEnd('intro');
    const handleEmploymentEnd = () => handleAudioEnd('employment');

    introAudio?.addEventListener('ended', handleIntroEnd);
    employmentAudio?.addEventListener('ended', handleEmploymentEnd);

    return () => {
      introAudio?.removeEventListener('ended', handleIntroEnd);
      employmentAudio?.removeEventListener('ended', handleEmploymentEnd);
    };
  }, [audioStartTime, handleAudioEnd]); // Dependencies

  const handleStart = () => {
    setStep('intro');
    playIntroAudio();
  };

  const stopCurrentAudio = () => {
    const introAudio = document.getElementById('introAudio') as HTMLAudioElement;
    const employmentAudio = document.getElementById('employmentAudio') as HTMLAudioElement;
    
    if (introAudio) {
      introAudio.pause();
      introAudio.currentTime = 0;
    }
    if (employmentAudio) {
      employmentAudio.pause();
      employmentAudio.currentTime = 0;
    }
  };

  const handleContinue = () => {
    if (!formData.firstName || !formData.lastName) {
      setError('Please enter your first and last name');
      return;
    }
    setError('');
    stopCurrentAudio();
    setStep('employment');
    playEmploymentAudio();
  };

  const handleEmploymentSelection = async (status: boolean) => {
    console.log('handleEmploymentSelection called with status:', status);
    
    stopCurrentAudio();
    setError(null); // Clear any existing errors
    
    try {
      const completionTime = new Date();
      const formCompletionData = {
        ...formData,
        employmentStatus: status,
        formCompletionTime: completionTime.toISOString(),
        formCompletionTimeSeconds: Math.round(
          (completionTime.getTime() - new Date(formStartTime).getTime()) / 1000
        )
      };

      console.log('Submitting form data:', formCompletionData);
      console.log('Audio metrics:', audioMetrics);
      
      const result = await saveAudioFormSubmission(formCompletionData, audioMetrics);
      
      console.log('Save result:', result);
      
      if (result.error) {
        console.error('Error in result:', result.error);
        throw result.error;
      }
      
      console.log('Form submitted successfully:', result.data);
      console.log('Navigating to thank you page...');
      router.replace('/thank-you');
    } catch (error) {
      console.error('Error from saveAudioFormSubmission:', error);
      setError('An error occurred while submitting the form. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <audio id="introAudio" src="/audio/intro.mp3" />
      <audio id="employmentAudio" src="/audio/employment.mp3" />
      <ProgressSteps currentStep={step} />
      
      {step === 'welcome' && <AudioWelcomeOverlay onStart={handleStart} />}

      {error && (
        <div className="fixed top-4 right-4 bg-red-50 text-red-700 px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2">
          <AlertCircle className="h-5 w-5" />
          <p>{error}</p>
          <button 
            onClick={() => setError(null)}
            className="ml-2 text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      <div className="container mx-auto px-4 py-24">
        <div className="max-w-xl mx-auto space-y-6">
          {step === 'intro' && (
            <>
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Please Listen to the Instructions
                </h2>
                <div className="mt-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="mt-4">
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="mt-4">
                    <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
                      Date of Birth
                    </label>
                    <DateInput
                      name="dob"
                      value={formData.dob}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div className="mt-8">
                    <button
                      onClick={handleContinue}
                      disabled={!isButtonEnabled}
                      className={`w-full p-4 rounded-lg ${
                        isButtonEnabled 
                          ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer' 
                          : 'bg-gray-400 cursor-not-allowed'
                      } text-white font-semibold transition-colors`}
                    >
                      Continue
                    </button>
                    
                    <div className="text-center text-sm text-gray-500 mt-1">
                      {!formData.firstName || !formData.lastName 
                        ? "Please fill in your details above"
                        : "Please click Continue to proceed"
                      }
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {step === 'employment' && (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
              <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-6 text-center">Employment Status</h2>
                <p className="mb-6 text-center">Are any of the following statements true?</p>
                
                <ul className="mb-8 space-y-4">
                  <li>When I applied for this job, I was unemployed.</li>
                  <li>When I applied for this job, I did not have enough paid work.</li>
                  <li>At my previous job, my skills and training were not being fully utilized.</li>
                </ul>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Yes button clicked - event captured');
                      handleEmploymentSelection(true);
                    }}
                    className="w-full p-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors cursor-pointer z-10 relative"
                  >
                    Yes
                    <div className="text-sm">At least one statement is true</div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('No button clicked - event captured');
                      handleEmploymentSelection(false);
                    }}
                    className="w-full p-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors cursor-pointer z-10 relative"
                  >
                    No
                    <div className="text-sm">None of the statements are true</div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AudioForm;
