import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authAPI, urlAPI } from '../services/api';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Alert } from '../components/ui/Alert';
import { EmptyState } from '../components/ui/EmptyState';
import { SkeletonTable } from '../components/ui/Skeleton';
import {
  Link as LinkIcon,
  Eye,
  BarChart3,
  Copy,
  Trash2,
  Plus,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';

export default function Dashboard() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalClicks, setTotalClicks] = useState(0);
  const [dateRange, setDateRange] = useState('7days');
  const [error, setError] = useState(null);
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
      setError(null);
      setLoading(true);
      const response = await authAPI.getMyUrls();
      setUrls(response.data || []);
    } catch (error) {
      if (error.response?.status === 403) {
        setError('Session expired. Please login again.');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError('Failed to load URLs');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

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
    fetchUrls();
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

  const handleDelete = async (urlId) => {
    if (!window.confirm('Are you sure you want to delete this URL?')) {
      return;
    }

    try {
      toast.success('URL deleted successfully!');
      await fetchUrls();
    } catch {
      toast.error('Failed to delete URL');
    }
  };

  const avgClicks = urls.length > 0 ? Math.round(totalClicks / urls.length) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Error Alert */}
        {error && (
          <Alert
            variant="danger"
            icon={AlertCircle}
            title="Error"
            description={error}
            className="mb-6"
          />
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12 animate-slide-in-up">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Dashboard</h1>
            <p className="text-lg text-slate-600">
              Manage and track all your shortened URLs
            </p>
          </div>
          <Button
            onClick={() => navigate('/create')}
            size="lg"
            icon={Plus}
            className="w-full sm:w-auto"
          >
            Create New URL
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card hoverEffect shadow="md-soft" className="animate-slide-in-up">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2">
                  Total URLs
                </p>
                <p className="text-4xl font-bold text-slate-900">{urls.length}</p>
              </div>
              <div className="w-14 h-14 gradient-primary rounded-xl flex items-center justify-center">
                <LinkIcon className="w-7 h-7 text-white" />
              </div>
            </div>
          </Card>

          <Card hoverEffect shadow="md-soft" className="animate-slide-in-up">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2">
                  Total Clicks
                </p>
                <p className="text-4xl font-bold text-slate-900">
                  {totalClicks.toLocaleString()}
                </p>
              </div>
              <div className="w-14 h-14 gradient-success rounded-xl flex items-center justify-center">
                <Eye className="w-7 h-7 text-white" />
              </div>
            </div>
          </Card>

          <Card hoverEffect shadow="md-soft" className="animate-slide-in-up">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2">
                  Avg. Per URL
                </p>
                <p className="text-4xl font-bold text-slate-900">{avgClicks}</p>
              </div>
              <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br from-purple-100 to-purple-50">
                <TrendingUp className="w-7 h-7 text-purple-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Date Range Filter */}
        <div className="mb-8 flex flex-wrap gap-3">
          {[
            { value: '7days', label: 'Last 7 Days' },
            { value: '30days', label: 'Last 30 Days' },
            { value: '90days', label: 'Last 90 Days' },
            { value: 'alltime', label: 'All Time' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setDateRange(option.value)}
              className={`
                px-4 py-2 rounded-lg font-medium transition-all duration-200
                ${
                  dateRange === option.value
                    ? 'gradient-primary text-white shadow-md-soft'
                    : 'bg-white text-slate-700 border border-slate-300 hover:border-slate-400'
                }
              `}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* URLs Table */}
        <Card shadow="lg-soft" className="animate-slide-in-up overflow-hidden">
          {loading ? (
            <div className="p-8">
              <SkeletonTable rows={5} />
            </div>
          ) : urls.length === 0 ? (
            <CardContent className="py-12">
              <EmptyState
                icon={LinkIcon}
                title="No URLs yet"
                description="Create your first shortened URL to get started"
                action={() => navigate('/create')}
                actionLabel="Create URL"
              />
            </CardContent>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Short URL
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Original URL
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Clicks
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {urls.map((url) => (
                    <tr
                      key={url.id}
                      className="hover:bg-slate-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="primary" size="md">
                          {url.shortUrl}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <p
                          className="text-sm text-slate-700 truncate max-w-xs"
                          title={url.originalUrl}
                        >
                          {url.originalUrl}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-slate-900">
                          {url.clickCount}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {new Date(url.createdDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleCopy(url.shortUrl)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                            title="Copy URL"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => navigate(`/analytics/${url.shortUrl}`)}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
                            title="View Analytics"
                          >
                            <BarChart3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(url.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
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
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
