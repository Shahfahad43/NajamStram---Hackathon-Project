import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { useApp } from '../context/AppContext';

const Signup: React.FC = () => {
  const { signup } = useApp();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setIsLoading(true);
    const { error: signUpError } = await signup(email, password, name);
    setIsLoading(false);

    if (signUpError) {
      setError(signUpError.message || 'Failed to sign up');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full space-y-8 p-10">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Create an Account
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Join the NajamStream community today
          </p>
        </div>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
              {error}
            </div>
          )}
          <Input 
            id="name" 
            name="name" 
            type="text" 
            required 
            placeholder="Full Name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input 
            id="email-address" 
            name="email" 
            type="email" 
            required 
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
          />
          <Input 
            id="password" 
            name="password" 
            type="password" 
            required 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input 
            id="confirm-password" 
            name="confirm-password" 
            type="password" 
            required 
            placeholder="Confirm Password" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 text-saudi-green focus:ring-saudi-green border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
              I agree to the <a href="#" className="text-saudi-green">Terms of Service</a> and <a href="#" className="text-saudi-green">Privacy Policy</a>
            </label>
          </div>

          <div>
            <Button className="w-full" size="lg" isLoading={isLoading}>
              Create Account
            </Button>
          </div>
          
          <div className="text-center text-sm">
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-saudi-green hover:text-saudi-dark">
                Log in
              </Link>
            </p>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Signup;