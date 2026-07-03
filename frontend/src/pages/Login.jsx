import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';
import { setToken } from '../services/auth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Lock, User } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!username.trim()) {
      newErrors.username = 'Username is required';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.login(username, password);

      if (response.data && (response.data.token || response.data.jwtToken)) {
        const token = response.data.token || response.data.jwtToken;
        setToken(token);
        toast.success('Welcome back!');
        navigate('/dashboard');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Login failed';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4 py-12">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob-2"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Card shadow="lg-soft" className="animate-slide-in-up">
          <CardHeader>
            <div className="flex items-center justify-center mb-6">
              <div className="w-14 h-14 gradient-primary rounded-xl flex items-center justify-center shadow-md-soft">
                <span className="text-2xl font-bold text-white">🔗</span>
              </div>
            </div>
            <CardTitle className="text-center text-2xl">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (errors.username) setErrors({ ...errors, username: null });
                }}
                error={errors.username}
                icon={User}
                required
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: null });
                }}
                error={errors.password}
                icon={Lock}
                required
              />

              <Button
                type="submit"
                fullWidth
                size="lg"
                isLoading={loading}
                disabled={loading}
              >
                Sign In
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-2 bg-white text-sm text-slate-600">
                  Don't have an account?
                </span>
              </div>
            </div>

            <Link to="/register">
              <Button variant="outline" fullWidth size="lg">
                Create Account
              </Button>
            </Link>
          </CardContent>
        </Card>

        <p className="text-center text-slate-600 text-sm mt-6">
          Protected by JWT security
        </p>
      </div>
    </div>
  );
}
