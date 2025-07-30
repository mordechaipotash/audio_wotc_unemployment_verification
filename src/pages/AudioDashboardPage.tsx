import React from 'react';
import { Link } from 'react-router-dom';

interface Company {
  id: string;
  name: string;
  responses?: number;
  unemployed?: number;
}

const AudioDashboardPage = () => {
  const companies: Company[] = [
    { id: 'all', name: 'All Companies' },
    { id: 'hcs', name: 'HCS' },
    { id: 'empeon', name: 'Empeon Group' },
    { id: 'emergency', name: 'Emergency Ambulance' },
    { id: 'wgroup', name: 'The W Group' }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-6">Companies</h2>
          <nav className="space-y-1">
            {companies.map(company => (
              <Link
                key={company.id}
                to={company.id === 'all' ? '#' : `/audio_form/${company.id}`}
                className={`block px-4 py-2 rounded-lg transition-colors ${
                  company.id === 'all' 
                    ? 'bg-blue-500 text-white' 
                    : 'hover:bg-blue-50'
                }`}
              >
                <div className="flex items-center">
                  <span className="material-icons-outlined mr-2">
                    {company.id === 'all' ? 'dashboard' : 'business'}
                  </span>
                  {company.name}
                </div>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">All Companies</h1>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-500 text-sm">Last 24 Hours</h3>
              <p className="text-2xl font-bold">2</p>
              <p className="text-sm text-gray-600">2 unemployed</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-500 text-sm">Last 7 Days</h3>
              <p className="text-2xl font-bold">33</p>
              <p className="text-sm text-gray-600">25 unemployed</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-500 text-sm">Total Responses</h3>
              <p className="text-2xl font-bold">33</p>
              <p className="text-sm text-gray-600">all time</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-500 text-sm">Total Unemployed</h3>
              <p className="text-2xl font-bold">25</p>
              <p className="text-sm text-gray-600">75.8%</p>
            </div>
          </div>

          {/* Last Response */}
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h3 className="text-gray-500 text-sm mb-2">Last Response</h3>
            <p className="text-gray-900">1/14/2025, 10:18 PM EST</p>
            <p className="text-sm text-orange-500">(13 hours ago)</p>
          </div>

          {/* Sheets Access */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-4">Sheets Access</h3>
            <div className="flex gap-4">
              <button className="flex items-center px-4 py-2 border rounded-lg hover:bg-gray-50">
                <span className="material-icons-outlined mr-2">content_copy</span>
                Copy Sheets Link
              </button>
              <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                <span className="material-icons-outlined mr-2">open_in_new</span>
                Open Sheets
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioDashboardPage;
