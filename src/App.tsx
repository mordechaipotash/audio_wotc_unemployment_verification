import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import AudioForm from './components/AudioForm';
import AudioThankYouPage from './pages/AudioThankYouPage';

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          {/* Default route */}
          <Route path="/" element={<AudioForm companyName="Default Company" companyColor="bg-blue-600" />} />
          
          {/* Company-specific routes */}
          <Route path="/af_2" element={<AudioForm companyName="Empeon Group" companyColor="bg-orange-600" />} />
          <Route path="/af_x7k9v" element={<AudioForm companyName="Emergency Ambulance" companyColor="red-600" />} />
          <Route path="/af_m4r2t" element={<AudioForm companyName="The W Group" companyColor="purple-600" />} />
          <Route path="/audio_form" element={<AudioForm companyName="HCS" companyColor="bg-blue-600" />} />
          <Route path="/af_royal" element={<AudioForm companyName="Royal" companyColor="bg-purple-600" />} />
          
          {/* Thank you page */}
          <Route path="/thank-you" element={<AudioThankYouPage />} />
          
          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;