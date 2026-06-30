import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { urlAPI } from '../services/api';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowLeft, Calendar, Copy } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function Analytics() {
  const { shortUrl } = useParams();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(getDefaultStartDate());
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [chartData, setChartData] = useState([]);

  function getDefaultStartDate() {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0];
  }

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const startDateTime = `${startDate}T00:00:00`;
      const endDateTime = `${endDate}T23:59:59`;

      const response = await urlAPI.getAnalytics(shortUrl, startDateTime, endDateTime);
      setAnalytics(response.data || []);
    } catch (error) {
      toast.error('Failed to load analytics');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, shortUrl]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);

  useEffect(() => {
    if (analytics.length === 0) return;

    const dateMap = new Map();

    analytics.forEach((click) => {
      const date = new Date(click.timestamp).toLocaleDateString();
      dateMap.set(date, (dateMap.get(date) || 0) + 1);
    });

    const data = Array.from(dateMap, ([date, count]) => ({
      date,
      clicks: count,
    })).sort((a, b) => new Date(a.date) - new Date(b.date));

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setChartData(data);
  }, [analytics]);

  const totalClicks = analytics.length;
  const uniqueDays = new Set(analytics.map((c) => new Date(c.timestamp).toLocaleDateString())).size;
  const avgClicksPerDay = uniqueDays > 0 ? Math.round(totalClicks / uniqueDays) : 0;

  const topHours = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    clicks: 0,
  }));

  analytics.forEach((click) => {
    const hour = new Date(click.timestamp).getHours();
    topHours[hour].clicks += 1;
  });

  const deviceTypes = {};
  analytics.forEach((click) => {
    const device = click.deviceType || 'Unknown';
    deviceTypes[device] = (deviceTypes[device] || 0) + 1;
  });

  const deviceData = Object.entries(deviceTypes).map(([device, count]) => ({
    name: device,
    value: count,
  }));

  const handleCopy = async () => {
    try {
      const fullUrl = `${window.location.origin}/${shortUrl}`;
      await navigator.clipboard.writeText(fullUrl);
      toast.success('URL copied to clipboard!');
    } catch {
      toast.error('Failed to copy');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Analytics</h1>
              <div className="flex items-center gap-2 mt-2">
                <code className="text-lg font-mono text-blue-600 bg-blue-50 px-3 py-1 rounded">
                  {shortUrl}
                </code>
                <button
                  onClick={handleCopy}
                  className="p-2 hover:bg-gray-300 rounded transition-colors"
                >
                  <Copy className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                max={endDate}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                max={new Date().toISOString().split('T')[0]}
                className="input-field"
              />
            </div>
            <button
              onClick={fetchAnalytics}
              className="btn-primary"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
            <p className="text-gray-600 text-sm font-medium">Total Clicks</p>
            <p className="text-4xl font-bold text-blue-600 mt-2">{totalClicks}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-600">
            <p className="text-gray-600 text-sm font-medium">Unique Days</p>
            <p className="text-4xl font-bold text-green-600 mt-2">{uniqueDays}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-600">
            <p className="text-gray-600 text-sm font-medium">Avg per Day</p>
            <p className="text-4xl font-bold text-purple-600 mt-2">{avgClicksPerDay}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-600">
            <p className="text-gray-600 text-sm font-medium">Date Range</p>
            <p className="text-lg font-semibold text-orange-600 mt-2">{uniqueDays} days</p>
          </div>
        </div>

        {/* Charts */}
        {loading ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">Loading analytics...</p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">No analytics data available for the selected date range</p>
          </div>
        ) : (
          <>
            {/* Line Chart */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Clicks Over Time</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="clicks"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Clicks by Hour</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topHours}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="hour" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="clicks" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Device Type Pie Chart */}
            {deviceData.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Device Types</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={deviceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {deviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
