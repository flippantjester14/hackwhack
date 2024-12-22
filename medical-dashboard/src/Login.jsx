import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, Activity } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    onLogin();
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <Activity className="h-12 w-12 text-blue-500 mx-auto" />
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Enter your credentials to access your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-100 dark:bg-red-900/30 rounded-lg text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2
                           focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2
                           focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600
                           dark:hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember-me"
                className="h-4 w-4 text-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 text-sm text-gray-600 dark:text-gray-400"
              >
                Remember me
              </label>
            </div>
            <button
              type="button"
              className="text-sm text-blue-500 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 text-white bg-blue-500 hover:bg-blue-600 rounded-lg
                       transition duration-200 font-medium text-sm focus:outline-none
                       focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sign in to your account
          </button>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <button type="button" className="text-blue-500 hover:text-blue-600 font-medium">
              Create an account
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
