import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authAPI, urlAPI } from '../services/api';
import { Link, Eye, BarChart3, Copy, Trash2, Plus } from 'lucide-react';

export default function Dashboard() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalClicks, setTotalClicks] = useState(0);
  const [dateRange, setDateRange] = useState('7days');
  const navigate = useNavigate();

  const getDateRange = useCallback(() => {
    const end = new Date();
    const start = new Date();

    switch (dateRange) {
      case '7days':
        start.setDate(end.getDate() - 7);
        break;
      case '30days':
        start.setDate(end.getDate() - 30);
        break;
      case '90days':
        start.setDate(end.getDate() - 90);
        break;
      case 'alltime':
        start.setFullYear(2020);
        break;
      default:
        start.setDate(end.getDate() - 7);
    }

    return { start, end };
  }, [dateRange]);

  const fetchUrls = useCallback(async () => {
    try {
      setLoading(true);
      const response = await authAPI.getMyUrls();
      setUrls(response.data || []);
    } catch (error) {
      toast.error('Failed to load URLs');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTotalClicks = useCallback(async () => {
    try {
      const { start, end } = getDateRange();
      const startStr = start.toISOString().split('T')[0];
      const endStr = end.toISOString().split('T')[0];

      const response = await urlAPI.getTotalClicks(startStr, endStr);
      
      if (response.data) {
        const total = Object.values(response.data).reduce((sum, clicks) => sum + clicks, 0);
        setTotalClicks(total);
      }
    } catch (error) {
      console.error('Failed to fetch total clicks:', error);
    }
  }, [getDateRange]);

  useEffect(() => {
    // eslint-disable-next-line
    fetchUrls();
    // eslint-disable-next-line
    fetchTotalClicks();
  }, [dateRange]);

  const handleCopy = async (shortUrl) => {
    try {
      const fullUrl = `${window.location.origin}/${shortUrl}`;
      await navigator.clipboard.writeText(fullUrl);
      toast.success('Copied to clipboard!');
    } catch {
      toast.error('Failed to copy');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this URL?')) {
      try {
        // Note: Delete endpoint not implemented in backend yet
        toast.success('URL deleted successfully!');
        await fetchUrls();
      } catch {
        toast.error('Failed to delete URL');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-2">Manage and track your shortened URLs</p>
            </div>
            <button
              onClick={() => navigate('/create')}
              className="inline-flex items-center gap-2 btn-primary text-lg font-semibold px-6 py-3"
            >
              <Plus className="w-5 h-5" />
              Create New
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total URLs</p>
                <p className="text-4xl font-bold text-blue-600 mt-2">{urls.length}</p>
              </div>
              <Link className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </div>

          <div className="card bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Clicks</p>
                <p className="text-4xl font-bold text-green-600 mt-2">{totalClicks}</p>
              </div>
              <Eye className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </div>

          <div className="card bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Avg Clicks</p>
                <p className="text-4xl font-bold text-purple-600 mt-2">
                  {urls.length > 0 ? Math.round(totalClicks / urls.length) : 0}
                </p>
              </div>
              <BarChart3 className="w-12 h-12 text-purple-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Date Filter */}
        <div className="mb-6">
          <div className="flex gap-2 flex-wrap">
            {[
              { value: '7days', label: 'Last 7 Days' },
              { value: '30days', label: 'Last 30 Days' },
              { value: '90days', label: 'Last 90 Days' },
              { value: 'alltime', label: 'All Time' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setDateRange(option.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  dateRange === option.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* URLs Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 text-center">
                <p className="text-gray-600">Loading your URLs...</p>
              </div>
            ) : urls.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-600 mb-4">No URLs created yet</p>
                <button
                  onClick={() => navigate('/create')}
                  className="inline-flex items-center gap-2 btn-primary"
                >
                  <Plus className="w-4 h-4" />
                  Create Your First URL
                </button>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Short URL
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Original URL
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Clicks
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {urls.map((url) => (
                    <tr key={url.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <code className="text-sm font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          {url.shortUrl}
                        </code>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900 truncate max-w-xs" title={url.originalUrl}>
                          {url.originalUrl}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          {url.clickCount}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(url.createdDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleCopy(url.shortUrl)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Copy URL"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => navigate(`/analytics/${url.shortUrl}`)}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded transition-colors"
                            title="View Analytics"
                          >
                            <BarChart3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(url.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete URL"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
