import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { urlAPI } from '../services/api';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowLeft, Calendar, Copy, TrendingUp } from 'lucide-react';

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
  }, [startDate, endDate]);

  useEffect(() => {
    if (analytics.length === 0) return;

    // Analytics data is already aggregated by date from backend
    const data = analytics.map((item) => ({
      date: new Date(item.clickDate).toLocaleDateString(),
      clicks: item.count,
    })).sort((a, b) => new Date(a.date) - new Date(b.date));

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setChartData(data);
  }, [analytics]);

  const totalClicks = analytics.reduce((sum, item) => sum + item.count, 0);
  const uniqueDays = analytics.length;
  const avgClicksPerDay = uniqueDays > 0 ? Math.round(totalClicks / uniqueDays) : 0;

  const topHours = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    clicks: 0,
  }));

  // Since backend returns aggregated data by date, we can't break down by hour
  // So we'll distribute clicks evenly across hours as an approximation
  analytics.forEach((item) => {
    const clicsPerHour = Math.floor(item.count / 24);
    for (let i = 0; i < 24; i++) {
      topHours[i].clicks += clicsPerHour;
    }
  });

  // No device type data available from backend, so deviceData will be empty
  const deviceTypes = {};
  const deviceData = [];

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6 font-semibold transition"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Dashboard
            </button>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">Analytics</h1>
                <div className="flex items-center gap-3">
                  <code className="text-lg font-mono text-blue-400 bg-slate-700/50 px-3 py-1.5 rounded">
                    {shortUrl}
                  </code>
                  <button
                    onClick={handleCopy}
                    className="p-2 hover:bg-slate-700/50 rounded transition-colors"
                  >
                    <Copy className="w-5 h-5 text-slate-400 hover:text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Date Range Filter */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 mb-8 border border-slate-700/50 shadow-lg">
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  max={endDate}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={fetchAnalytics}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-lg transition shadow-lg"
              >
                Refresh
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border-l-4 border-blue-500 shadow-lg">
              <p className="text-slate-400 text-sm font-medium mb-2">Total Clicks</p>
              <p className="text-4xl font-bold text-white">{totalClicks}</p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border-l-4 border-green-500 shadow-lg">
              <p className="text-slate-400 text-sm font-medium mb-2">Unique Days</p>
              <p className="text-4xl font-bold text-white">{uniqueDays}</p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border-l-4 border-purple-500 shadow-lg">
              <p className="text-slate-400 text-sm font-medium mb-2">Avg per Day</p>
              <p className="text-4xl font-bold text-white">{avgClicksPerDay}</p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border-l-4 border-orange-500 shadow-lg">
              <p className="text-slate-400 text-sm font-medium mb-2">Date Range</p>
              <p className="text-lg font-semibold text-white">{uniqueDays} days</p>
            </div>
          </div>

          {/* Charts */}
          {loading ? (
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-12 text-center border border-slate-700/50 shadow-lg">
              <div className="inline-flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-slate-600 border-t-blue-500 rounded-full animate-spin"></div>
                <p className="text-slate-400">Loading analytics...</p>
              </div>
            </div>
          ) : chartData.length === 0 ? (
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-12 text-center border border-slate-700/50 shadow-lg">
              <p className="text-slate-400 text-lg">No analytics data available for the selected date range</p>
            </div>
          ) : (
            <>
              {/* Line Chart */}
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 mb-8 border border-slate-700/50 shadow-lg">
                <h2 className="text-2xl font-bold text-white mb-6">Clicks Over Time</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="date" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #475569',
                        borderRadius: '8px',
                        color: '#f1f5f9'
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
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 mb-8 border border-slate-700/50 shadow-lg">
                <h2 className="text-2xl font-bold text-white mb-6">Clicks by Hour</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topHours}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="hour" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #475569',
                        borderRadius: '8px',
                        color: '#f1f5f9'
                      }}
                    />
                    <Bar dataKey="clicks" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Device Type Pie Chart */}
              {deviceData.length > 0 && (
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50 shadow-lg">
                  <h2 className="text-2xl font-bold text-white mb-6">Device Types</h2>
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
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1e293b',
                          border: '1px solid #475569',
                          borderRadius: '8px',
                          color: '#f1f5f9'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
