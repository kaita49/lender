// LoginForm.js
import React, { useState } from 'react';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Use Firebase authentication to sign in the user
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful!');

      // Redirect to the dashboard or any other route on successful login
      navigate('/home');
    } catch (error) {
      console.error('Error logging in:', error.message);
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleLogin} className="bg-white p-8 shadow-md rounded-md w-96">
        <h2 className="text-2xl font-semibold mb-4 flex justify-center">Login</h2>

        {error && <p className="text-red500 mb-4">{error}</p>}

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray600">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="mt-1 p-2 w-full border rounded-md"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray600">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="mt-1 p-2 w-full border rounded-md"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-gray500 text-white p-2 rounded-md hover:bg-blue600 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
