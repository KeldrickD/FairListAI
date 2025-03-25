import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useToast } from '@/components/ui/use-toast';
import { sendVerificationEmail, sendWelcomeEmail } from '@/lib/services/emailService';
import { v4 as uuidv4 } from 'uuid';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate registration
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In a real app, you would call your auth API here
      // const response = await apiRequest('/api/auth/register', {
      //   method: 'POST',
      //   body: JSON.stringify({ name, email, password }),
      // });

      // Generate a verification token
      const verificationToken = uuidv4();
      
      // Send verification email
      await sendVerificationEmail(email, verificationToken);
      
      // Send welcome email
      await sendWelcomeEmail(email, name);

      // Show success message
      toast({
        title: 'Registration Successful!',
        description: 'Please check your email to verify your account.',
      });

      // Set registration complete
      setRegistrationComplete(true);
      
      // In a real app, you would redirect to a verification page
      // For demo purposes, we'll redirect to login after a delay
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (error) {
      toast({
        title: 'Registration Failed',
        description: error instanceof Error ? error.message : 'An error occurred during registration.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create an Account</h1>
          <p className="mt-2 text-gray-600">Join FairListAI to create AI-powered property listings</p>
        </div>

        {registrationComplete ? (
          <div className="text-center">
            <div className="mb-4 text-green-500 text-6xl">✓</div>
            <h2 className="text-2xl font-semibold mb-2">Registration Complete!</h2>
            <p className="mb-4 text-gray-600">
              We've sent a verification email to <strong>{email}</strong>. 
              Please check your inbox and verify your account.
            </p>
            <p className="text-sm text-gray-500">
              Redirecting you to the login page...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>

            <div className="text-center text-sm">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        )}
        
        {/* Tutorial Tooltip */}
        <div className="mt-8 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
          <h3 className="font-medium text-indigo-800 mb-2">Why create an account?</h3>
          <ul className="text-sm text-indigo-700 space-y-1">
            <li>• Save your AI-generated property listings</li>
            <li>• Access your listings from anywhere</li>
            <li>• Track performance of your property marketing</li>
            <li>• Get personalized recommendations</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 