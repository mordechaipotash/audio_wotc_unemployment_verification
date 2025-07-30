import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { formatToEST } from '../utils/dateUtils';
import { Download } from 'lucide-react';

export const AudioFormResponses = () => {
  const [formData, setFormData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [companyFilter, setCompanyFilter] = useState<string>('all');
  const [employmentFilter, setEmploymentFilter] = useState<'all' | 'unemployed' | 'other'>('all');
  const [companies, setCompanies] = useState<string[]>([]);

  useEffect(() => {
    const fetchFormResponses = async () => {
      try {
        const { data, error } = await supabase
          .from('audio_form_responses')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setFormData(data || []);
        setFilteredData(data || []);
        
        // Extract unique companies
        const uniqueCompanies = Array.from(new Set(data?.map(item => item.company) || []));
        setCompanies(uniqueCompanies);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFormResponses();
  }, []);

  useEffect(() => {
    // Apply both company and employment filters
    let filtered = formData;

    // Apply company filter
    if (companyFilter !== 'all') {
      filtered = filtered.filter(response => response.company === companyFilter);
    }

    // Apply employment filter
    if (employmentFilter !== 'all') {
      filtered = filtered.filter(response => 
        employmentFilter === 'unemployed' ? response.employment_status : !response.employment_status
      );
    }

    setFilteredData(filtered);
  }, [companyFilter, employmentFilter, formData]);

  const handleDownloadCSV = () => {
    // Convert filtered data to CSV
    const headers = [
      'First Name',
      'Last Name',
      'Date of Birth',
      'Company',
      'Employment Status',
      'Intro Audio Played',
      'Employment Audio Played',
      'Audio Listen Time (seconds)',
      'Form Start Time (EST)',
      'Submission Date (EST)'
    ];

    const csvData = filteredData.map(response => [
      response.first_name,
      response.last_name,
      response.dob || '',
      response.company,
      response.employment_status ? 'Unemployed' : '',
      response.intro_audio_played ? 'Yes' : 'No',
      response.employment_audio_played ? 'Yes' : 'No',
      response.total_audio_listen_time_seconds,
      formatToEST(response.form_start_time),
      formatToEST(response.created_at)
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `audio-form-responses-${companyFilter}-${new Date().toISOString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">Error: {error}</div>;
  }

  // Calculate statistics
  const totalResponses = filteredData.length;
  const employedCount = filteredData.filter(r => r.employment_status).length;
  const avgAudioTime = Math.round(
    filteredData.reduce((acc, curr) => acc + (curr.total_audio_listen_time_seconds || 0), 0) / totalResponses
  );
  const introCompletionRate = Math.round(
    (filteredData.filter(r => r.intro_audio_played).length / totalResponses) * 100
  );
  const employmentCompletionRate = Math.round(
    (filteredData.filter(r => r.employment_audio_played).length / totalResponses) * 100
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Audio Form Responses</h1>
        <div className="flex gap-4 items-center">
          <select
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Companies</option>
            {companies.map(company => (
              <option key={company} value={company}>{company}</option>
            ))}
          </select>
          <select
            value={employmentFilter}
            onChange={(e) => setEmploymentFilter(e.target.value as 'all' | 'unemployed' | 'other')}
            className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Employment Status</option>
            <option value="unemployed">Unemployed</option>
            <option value="other">Other</option>
          </select>
          <button
            onClick={handleDownloadCSV}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <Download className="h-4 w-4 mr-2" />
            Download CSV
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm text-gray-500">Total Submissions</h3>
          <p className="text-2xl font-bold">{totalResponses}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm text-gray-500">Employment Rate</h3>
          <p className="text-2xl font-bold text-blue-600">
            {totalResponses ? Math.round((employedCount / totalResponses) * 100) : 0}%
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm text-gray-500">Avg. Audio Time</h3>
          <p className="text-2xl font-bold text-green-600">{avgAudioTime}s</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm text-gray-500">Intro Completion</h3>
          <p className="text-2xl font-bold text-purple-600">{introCompletionRate}%</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm text-gray-500">Employment Section</h3>
          <p className="text-2xl font-bold text-orange-600">{employmentCompletionRate}%</p>
        </div>
      </div>

      {/* Responses Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employment Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submission Date (EST)</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((response) => (
              <tr key={response.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {response.first_name} {response.last_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                    {response.company}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {response.employment_status ? (
                    <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Unemployed</span>
                  ) : (
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {formatToEST(response.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 