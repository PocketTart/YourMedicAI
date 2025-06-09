import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = ({ onToggle }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 
    try {
      await login(email, password);
      navigate('/home');
    } catch (err) {
      setError(err.message || 'Failed to log in. Please check your credentials.');
    }
  };

  return (
    <div className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full text-center border border-blue-100">
      <h1 className="text-4xl font-extrabold text-blue-700 mb-4 font-inter">
        YourMedicAI Chatbot
      </h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-8">Access Your Health Assistant</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <input
            type="email"
            placeholder="Your Email Address"
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-blue-300 text-lg font-inter"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Your Password"
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-blue-300 text-lg font-inter"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition duration-300 text-xl font-bold shadow-md"
        >
          Log In to Chat
        </button>
      </form>
      <p className="mt-8 text-gray-600 text-md">
        New to YourMedicAI?{" "}
        <button
          onClick={onToggle}
          className="text-blue-600 hover:underline font-semibold focus:outline-none cursor-pointer"
        >
          Create an Account
        </button>
      </p>
    </div>
  );
};

const Signup = ({ onToggle }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await signup(username, email, password);
      navigate('/home'); 
    } catch (err) {
      setError(err.message || 'Failed to sign up. Please try again.');
    }
  };

  return (
    <div className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full text-center border border-green-100">
      <h1 className="text-4xl font-extrabold text-green-700 mb-4 font-inter">
        YourMedicAI
      </h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-8">Register for AI Health Support</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <input
            type="text"
            placeholder="Choose a Username"
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-green-300 text-lg font-inter"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="Your Email Address"
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-green-300 text-lg font-inter"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Create a Password"
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-green-300 text-lg font-inter"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Confirm Your Password"
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-green-300 text-lg font-inter"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <button
          type="submit"
          className="w-full bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition duration-300 text-xl font-bold shadow-md"
        >
          Sign Up Now
        </button>
      </form>
      <p className="mt-8 text-gray-600 text-md">
        Already have an account?{" "}
        <button
          onClick={onToggle}
          className="text-green-600 hover:underline font-semibold focus:outline-none cursor-pointer"
        >
          Log In
        </button>
      </p>
    </div>
  );
};


const AuthPage = () => {
  const [loginPage, setLoginPage] = useState(true);

  const toggleAuthMode = () => {
    setLoginPage((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center p-4 font-inter">
      {loginPage ? (
        <Login onToggle={toggleAuthMode} />
      ) : (
        <Signup onToggle={toggleAuthMode} />
      )}
    </div>
  );
};

export default AuthPage;
