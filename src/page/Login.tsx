import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Invalid credentials. Try admin@betel.tv / password');
    }
  };

  return (
    <div className="min-h-screen bg-black bg-[url('https://picsum.photos/1920/1080?blur=10')] bg-cover bg-center flex items-center justify-center relative">
      <div className="absolute inset-0 bg-black/70"></div>
      
      <div className="relative z-10 w-full max-w-md bg-black/80 backdrop-blur-md p-8 rounded-lg shadow-2xl border border-zinc-800">
        <div className="text-center mb-8">
           <h1 className="text-3xl font-bold text-red-600 mb-2">BETEL_TV</h1>
           <p className="text-gray-400">Sign in to your account</p>
        </div>

        {error && <div className="bg-red-900/50 text-red-200 p-3 rounded text-sm mb-4 text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded p-3 text-white focus:border-red-600 focus:outline-none"
              placeholder="user@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded p-3 text-white focus:border-red-600 focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded transition">
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Mock Credentials:</p>
          <p className="font-mono mt-1">admin@betel.tv / password</p>
        </div>
      </div>
    </div>
  );
};