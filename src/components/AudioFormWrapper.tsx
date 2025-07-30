import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface AudioFormWrapperProps {
  company: string;
  formPath: string;
  companyColor: string;
}

export const AudioFormWrapper: React.FC<AudioFormWrapperProps> = ({
  company,
  formPath,
  companyColor
}) => {
  const navigate = useNavigate();

  const handleSubmit = async (formData: any) => {
    try {
      const { error } = await supabase
        .from('audio_form_responses')
        .insert([
          {
            ...formData,
            company: company
          }
        ]);

      if (error) throw error;
      
      // Navigate to thank you page or handle success
      navigate('/thank-you');
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle error appropriately
    }
  };

  return (
    <div className={`min-h-screen ${companyColor}`}>
      {/* Your form content here */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">
          {company} Employment Verification
        </h1>
        {/* Add your form components here */}
      </div>
    </div>
  );
}; 