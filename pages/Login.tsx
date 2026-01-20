import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { useApp } from '../context/AppContext';

const Login: React.FC = () => {
  const { login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    const { error } = await login(email, password);
    
    setIsLoading(false);
    
    if (error) {
      setError(error.message || 'Failed to login');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full space-y-8 p-10">
        <div className="text-center flex flex-col items-center">
          {/* New Logo Implementation */}
          <div className="relative mb-4">
            <div className="w-14 h-14 bg-gradient-to-tr from-saudi-dark to-saudi-green rounded-2xl shadow-lg flex items-center justify-center border border-saudi-light/20">
                <svg className="w-7 h-7 text-white fill-current ml-1" viewBox="0 0 24 24">
                  <path d="M5 3l14 9-14 9V3z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
            <div className="absolute -top-2 -right-2 bg-white dark:bg-gray-800 rounded-full p-0.5 shadow-sm">
              <svg className="w-6 h-6 text-gold fill-current" viewBox="0 0 24 24">
                <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z"/>
              </svg>
            </div>
          </div>
          
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign in to continue your World Cup journey
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
              {error}
            </div>
          )}
          <div className="rounded-md shadow-sm space-y-4">
            <Input 
              id="email-address" 
              name="email" 
              type="email" 
              autoComplete="email" 
              required 
              placeholder="Email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input 
              id="password" 
              name="password" 
              type="password" 
              autoComplete="current-password" 
              required 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-saudi-green focus:ring-saudi-green border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-saudi-green hover:text-saudi-dark">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <Button className="w-full" size="lg" isLoading={isLoading}>
              Sign in
            </Button>
          </div>
          
          <div className="text-center text-sm">
            <p className="text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-saudi-green hover:text-saudi-dark">
                Sign up for free
              </Link>
            </p>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Login;