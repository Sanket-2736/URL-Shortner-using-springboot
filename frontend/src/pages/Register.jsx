import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Lock, Mail, User } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors above');
      return;
    }

    setLoading(true);
    try {
      await authAPI.register(formData.username, formData.email, formData.password);
      toast.success('Account created successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Registration failed';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center px-4 py-12">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob-2"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Card shadow="lg-soft" className="animate-slide-in-up">
          <CardHeader>
            <div className="flex items-center justify-center mb-6">
              <div className="w-14 h-14 gradient-primary rounded-xl flex items-center justify-center shadow-md-soft">
                <span className="text-2xl font-bold text-white">✨</span>
              </div>
            </div>
            <CardTitle className="text-center text-2xl">Get Started</CardTitle>
            <CardDescription className="text-center">
              Create your account to start shortening URLs
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Username"
                placeholder="Choose a username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                error={errors.username}
                icon={User}
                required
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
                icon={Mail}
                required
              />

              <Input
                label="Password"
                type="password"
                placeholder="At least 6 characters"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                error={errors.password}
                icon={Lock}
                required
              />

              <Input
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                error={errors.confirmPassword}
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
                Create Account
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-2 bg-white text-sm text-slate-600">
                  Already have an account?
                </span>
              </div>
            </div>

            <Link to="/login">
              <Button variant="outline" fullWidth size="lg">
                Sign In
              </Button>
            </Link>
          </CardContent>
        </Card>

        <p className="text-center text-slate-600 text-sm mt-6">
          By creating an account, you agree to our Terms
        </p>
      </div>
    </div>
  );
}
