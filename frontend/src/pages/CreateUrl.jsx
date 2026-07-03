import { useState } from 'react';
import toast from 'react-hot-toast';
import { urlAPI } from '../services/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Alert } from '../components/ui/Alert';
import { Link as LinkIcon, Copy, CheckCircle2, Calendar } from 'lucide-react';

export default function CreateUrl() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [shortUrl, setShortUrl] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!originalUrl.trim()) {
      setError('Please enter a URL');
      return;
    }

    let urlToShorten = originalUrl.trim();

    if (!urlToShorten.startsWith('http://') && !urlToShorten.startsWith('https://')) {
      urlToShorten = 'https://' + urlToShorten;
    }

    try {
      new URL(urlToShorten);
    } catch {
      setError('Please enter a valid URL');
      return;
    }

    setLoading(true);
    try {
      const response = await urlAPI.shortenUrl(urlToShorten);

      if (response.data && response.data.shortUrl) {
        setShortUrl(response.data);
        setOriginalUrl('');
        toast.success('URL shortened successfully!');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to shorten URL';
      setError(errorMsg);
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
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {!shortUrl ? (
          <>
            <div className="text-center mb-12 animate-slide-in-up">
              <div className="inline-flex items-center justify-center w-16 h-16 gradient-primary rounded-2xl shadow-lg mb-6">
                <LinkIcon className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-slate-900 mb-3">
                Shorten Your URL
              </h1>
              <p className="text-lg text-slate-600 max-w-md mx-auto">
                Convert long, complex URLs into short, shareable links with a single click
              </p>
            </div>

            <Card shadow="lg-soft" className="animate-slide-in-up">
              <CardHeader>
                <CardTitle>Create New Short Link</CardTitle>
                <CardDescription>
                  Paste a URL and we'll generate a short link for you
                </CardDescription>
              </CardHeader>

              <CardContent>
                {error && (
                  <Alert
                    variant="danger"
                    title="Error"
                    description={error}
                    className="mb-6"
                  />
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input
                    label="Long URL"
                    placeholder="https://example.com/very/long/url/path"
                    value={originalUrl}
                    onChange={(e) => {
                      setOriginalUrl(e.target.value);
                      if (error) setError(null);
                    }}
                    icon={LinkIcon}
                    helperText="We'll automatically add https:// if you don't include a protocol"
                    required
                  />

                  <Button
                    type="submit"
                    fullWidth
                    size="lg"
                    isLoading={loading}
                    disabled={loading || !originalUrl.trim()}
                  >
                    Generate Short URL
                  </Button>
                </form>
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="animate-slide-in-up">
            <Card shadow="lg-soft">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                    <CardTitle>URL Shortened Successfully!</CardTitle>
                  </div>
                </div>
                <CardDescription>
                  Your short link is ready to share
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-3">
                    Original URL
                  </label>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <p className="text-sm text-slate-700 break-all font-mono">
                      {shortUrl.originalUrl}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-3">
                    Short URL
                  </label>
                  <div className="flex gap-3">
                    <div className="flex-1 bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-900 break-all font-mono font-semibold">
                        {window.location.origin}/{shortUrl.shortUrl}
                      </p>
                    </div>
                    <Button
                      onClick={handleCopy}
                      size="lg"
                      icon={Copy}
                      iconPosition="right"
                    >
                      {copied ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">
                      Clicks
                    </p>
                    <p className="text-3xl font-bold text-slate-900">
                      {shortUrl.clickCount}
                    </p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Created
                    </p>
                    <p className="text-lg font-semibold text-slate-900">
                      {new Date(shortUrl.createdDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  onClick={handleReset}
                  variant="secondary"
                  size="lg"
                  fullWidth
                >
                  Create Another URL
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
