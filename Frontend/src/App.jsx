import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home'; // Your Home page
import AuthPage from './components/Auth'; 
import ProtectedRoute from './ProtectedRoute'; // The new ProtectedRoute component
import { AuthProvider, useAuth } from './context/AuthContext'; // Auth Context

const About = () => {
  const { isLoggedIn } = useAuth();
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">About Us</h2>
      <p className="text-gray-600">This is the about page. It can be accessed by anyone.</p>
      {isLoggedIn && <p className="text-green-500 mt-2">You are logged in!</p>}
      {!isLoggedIn && <p className="text-orange-500 mt-2">You are NOT logged in!</p>}
      <Link to="/" className="mt-4 text-blue-600 hover:underline">Go Home</Link>
    </div>
  );
};


function App() {
  return (
    <Router>
      <AuthProvider> 
        <Routes>
          {/* public routes accessible by everyone */}
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/about" element={<About />} />

          {/* protected routes which require auth */}
          <Route element={<ProtectedRoute />}>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/home" element={<Home />} />
          </Route>
          
          {/* 404 page to route for any unknown page  */}
          <Route path="*" element={
            <div className="min-h-screen bg-gray-100 flex items-center justify-center text-2xl font-bold text-gray-700">
              404 - Page Not Found
            </div>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
