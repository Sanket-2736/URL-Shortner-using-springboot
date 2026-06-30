import { useState } from 'react';
import toast from 'react-hot-toast';
import { urlAPI } from '../services/api';
import { Link, Copy, CheckCircle } from 'lucide-react';

export default function CreateUrl() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [shortUrl, setShortUrl] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!originalUrl) {
      toast.error('Please enter a URL');
      return;
    }

    try {
      new URL(originalUrl);
    } catch {
      toast.error('Please enter a valid URL');
      return;
    }

    setLoading(true);
    try {
      const response = await urlAPI.shortenUrl(originalUrl);
      
      if (response.data && response.data.shortUrl) {
        setShortUrl(response.data);
        setOriginalUrl('');
        toast.success('URL shortened successfully!');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to shorten URL';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    const fullShortUrl = `${window.location.origin}/${shortUrl.shortUrl}`;
    try {
      await navigator.clipboard.writeText(fullShortUrl);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  const handleReset = () => {
    setShortUrl(null);
    setOriginalUrl('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-blue-100 rounded-full mb-4">
              <Link className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Shorten Your URL</h1>
            <p className="text-gray-600 mt-2">Convert long URLs into short, shareable links</p>
          </div>

          {!shortUrl ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                  Enter Long URL
                </label>
                <input
                  id="url"
                  type="text"
                  value={originalUrl}
                  onChange={(e) => setOriginalUrl(e.target.value)}
                  placeholder="https://example.com/very/long/url/path"
                  className="input-field text-lg"
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Paste any long URL and we'll create a short link for you
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || !originalUrl}
                className="w-full btn-primary font-semibold text-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Shortening...' : 'Shorten URL'}
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                <div className="flex items-center justify-center mb-4">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <p className="text-center text-gray-600 mb-4">Your URL has been shortened!</p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Original URL
                    </label>
                    <div className="bg-white p-3 rounded border border-gray-300 break-all text-sm text-gray-700">
                      {shortUrl.originalUrl}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Short URL
                    </label>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-white p-3 rounded border border-gray-300 break-all text-sm font-mono text-blue-600">
                        {window.location.origin}/{shortUrl.shortUrl}
                      </div>
                      <button
                        onClick={handleCopy}
                        className="px-4 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-2 whitespace-nowrap"
                      >
                        <Copy className="w-4 h-4" />
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-3 rounded border border-gray-300">
                      <p className="text-xs text-gray-600">Click Count</p>
                      <p className="text-2xl font-bold text-gray-900">{shortUrl.clickCount}</p>
                    </div>
                    <div className="bg-white p-3 rounded border border-gray-300">
                      <p className="text-xs text-gray-600">Created Date</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {new Date(shortUrl.createdDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="w-full btn-secondary font-semibold text-lg py-3"
              >
                Shorten Another URL
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
