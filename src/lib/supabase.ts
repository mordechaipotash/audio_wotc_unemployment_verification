import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_URL');
}
if (!supabaseAnonKey) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

// Log configuration for debugging
console.log('Supabase Configuration:', {
  url: supabaseUrl,
  hasAnonKey: !!supabaseAnonKey,
  envVars: {
    hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  }
});

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Test database connection
const testConnection = async () => {
  console.log('Testing database connection...');
  try {
    const { data, error } = await supabase
      .from('audio_form_responses')
      .select('id')
      .limit(1);

    if (error) {
      console.error('Database connection error:', error);
      return false;
    }

    console.log('Database connection successful');
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
};

// Listen for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', {
    event,
    hasSession: !!session,
    sessionDetails: session ? {
      userId: session.user.id,
      expiresAt: session.expires_at
    } : null
  });
});

// Initial setup
(async () => {
  const databaseConnected = await testConnection();
  const { data: { session } } = await supabase.auth.getSession();
  
  console.log('Initial setup complete:', {
    databaseConnected,
    hasSession: !!session
  });
})();

export interface FormData {
  firstName: string;
  lastName: string;
  dob: string;
  employmentStatus: boolean | undefined;
  startTime: number | string;
}

export interface AudioMetrics {
  introAudioPlayed: boolean;
  employmentAudioPlayed: boolean;
  introAudioCompletionTime: number | null;
  employmentAudioCompletionTime: number | null;
  totalAudioListenTimeSeconds: number;
}

export const saveAudioFormSubmission = async (formData: any, audioMetrics?: AudioMetrics) => {
  try {
    // First, let's check if we can access the table
    const { data: testData, error: testError } = await supabase
      .from('audio_form_responses')
      .select('id')
      .limit(1);
    
    if (testError) {
      console.error('Table access test failed:', testError);
    } else {
      console.log('Table access test successful');
    }
    
    const now = new Date().toISOString();
    
    // Helper function to truncate strings
    const truncate = (str: string | null, maxLength: number) => {
      if (!str) return null;
      return str.substring(0, maxLength);
    };
    
    // Get browser details
    const userAgent = navigator.userAgent;
    const browserDetails = {
      name: navigator.userAgent.split(' ')[0],
      version: navigator.appVersion,
      os: navigator.platform,
      language: navigator.language,
    };

    // Get screen and window details
    const screenDetails = {
      resolution: `${window.screen.width}x${window.screen.height}`,
      windowSize: `${window.innerWidth}x${window.innerHeight}`,
      colorDepth: window.screen.colorDepth,
    };

    // Ensure form start time exists and calculate completion time
    const startTime = formData.formStartTime || now;
    const completionTimeSeconds = formData.formStartTime ? 
      Math.round((Date.now() - new Date(formData.formStartTime).getTime()) / 1000) : 
      0;

    const submissionData = {
      first_name: truncate(formData.firstName?.trim(), 50),
      last_name: truncate(formData.lastName?.trim(), 50),
      dob: formData.dob ? new Date(formData.dob).toISOString().split('T')[0] : null,
      company: truncate(formData.company, 50),
      employment_status: formData.employmentStatus,
      
      // Timestamps
      submission_date: now,
      created_at: now,
      updated_at: now,
      form_start_time: startTime,
      form_completion_time_seconds: completionTimeSeconds,
      
      // Browser information
      user_agent: truncate(userAgent, 50),
      browser_name: truncate(browserDetails.name, 50),
      browser_version: truncate(browserDetails.version, 50),
      operating_system: truncate(browserDetails.os, 50),
      device_type: truncate(/Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile/.test(userAgent) ? 'mobile' : 'desktop', 50),
      
      // Screen and window information
      screen_resolution: truncate(screenDetails.resolution, 50),
      window_size: truncate(screenDetails.windowSize, 50),
      
      // Language and timezone
      time_zone: truncate(Intl.DateTimeFormat().resolvedOptions().timeZone, 50),
      language: truncate(browserDetails.language, 50),
      
      // Audio interaction tracking
      intro_audio_played: formData.introAudioPlayed === true,
      employment_audio_played: formData.employmentAudioPlayed === true,
      intro_audio_completion_time: formData.introAudioCompletionTime || null,
      employment_audio_completion_time: formData.employmentAudioCompletionTime || null,
      total_audio_listen_time_seconds: audioMetrics?.totalAudioListenTimeSeconds || 0,
      
      // Session tracking
      referrer: truncate(document.referrer, 50),
      session_id: truncate(formData.sessionId, 50),
    };

    console.log('Submitting data:', submissionData); // Debug log

    const { data, error } = await supabase
      .from('audio_form_responses')
      .insert([submissionData])
      .select();

    if (error) {
      console.error('Supabase error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw error;
    }
    return { data, error: null };
  } catch (error) {
    console.error('Error saving form submission:', error);
    return { data: null, error };
  }
};

export const saveFormSubmission = async (formData: any, signatureData: string) => {
  try {
    // Create a safe filename using only ASCII characters and timestamp
    const safeFileName = `${Date.now()}-${formData.firstName.replace(/[^a-zA-Z0-9]/g, '')}-${formData.lastName.replace(/[^a-zA-Z0-9]/g, '')}.png`;
    
    // First, upload the signature image to Supabase storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('signatures')
      .upload(safeFileName, signatureData, {
        contentType: 'image/png',
        cacheControl: '3600'
      });

    if (uploadError) throw uploadError;

    // Get the public URL for the uploaded signature
    const signatureUrl = supabase.storage
      .from('signatures')
      .getPublicUrl(safeFileName).data.publicUrl;

    // Get browser details
    const userAgent = navigator.userAgent;
    const browserDetails = {
      name: navigator.userAgent.split(' ')[0],
      version: navigator.appVersion,
      os: navigator.platform,
      language: navigator.language,
    };

    // Get screen and window details
    const screenDetails = {
      resolution: `${window.screen.width}x${window.screen.height}`,
      windowSize: `${window.innerWidth}x${window.innerHeight}`,
    };

    const now = new Date().toISOString();
    const startTime = formData.formStartTime || now;
    const completionTimeSeconds = formData.formStartTime ? 
      Math.round((Date.now() - new Date(formData.formStartTime).getTime()) / 1000) : 
      0;

    // Generate a UUID for the id field
    const uuid = crypto.randomUUID();

    const submissionData = {
      id: uuid,
      // Personal Information
      first_name: formData.firstName?.trim(),
      last_name: formData.lastName?.trim(),
      date_of_birth: formData.dob ? new Date(formData.dob).toISOString().split('T')[0] : null,
      
      // SNAP Benefits
      snap_benefits: formData.snapBenefits === 'yes',
      snap_primary_recipient: formData.snapPrimaryRecipient === 'yes' ? formData.snapRecipientName || '' : '',
      snap_city: formData.snapBenefitCity || null,
      snap_state: formData.snapBenefitState || null,
      
      // TANF Benefits
      tanf_benefits: formData.tanfBenefits === 'yes',
      tanf_nine_months: formData.tanfNineMonths === 'yes',
      tanf_recipient: formData.tanfRecipientName || null,
      
      // Other Benefits
      ssi_benefits: formData.ssiBenefits === 'yes',
      unemployment_benefits: formData.unemploymentBenefits === 'yes',
      unemployment_state: formData.unemploymentState || null,
      
      // Signature
      signature_data_url: signatureUrl,
      signature_storage_path: safeFileName,
      
      // Language
      language: browserDetails.language,
      
      // Timestamps
      submission_date: now,
      created_at: now,
      updated_at: now,
      
      // Browser information
      user_agent: userAgent,
      
      // Processing status
      processing_status: 'pending',
      
      // IP address
      ip_address: null
    };

    console.log('Submitting data to Supabase:', submissionData);

    const { data, error } = await supabase
      .from('hsc_8850_special_submissions')
      .insert([submissionData]);

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error saving form submission:', error);
    const typedError = error instanceof Error ? error : new Error('Unknown error occurred');
    return { data: null, error: typedError };
  }
};
