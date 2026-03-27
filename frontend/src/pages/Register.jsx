import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function Register() {
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center text-2xl font-bold text-slate-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white mr-2">C</div>
          CivicFlow
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-slate-200 sm:rounded-xl sm:px-10">
          <form className="space-y-6" onSubmit={handleRegister}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                Full Name
              </label>
              <div className="mt-1">
                <Input id="name" name="name" type="text" autoComplete="name" required />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email address
              </label>
              <div className="mt-1">
                <Input id="email" name="email" type="email" autoComplete="email" required />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="mt-1">
                <Input id="password" name="password" type="password" autoComplete="new-password" required />
              </div>
            </div>

            <div>
              <Button type="submit" className="w-full">
                Register
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
