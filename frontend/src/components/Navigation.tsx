import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navigation() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <nav className="fixed w-full bg-white shadow-md z-50">
      <div className="container mx-auto px-4 sm:px-6 py-4 flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600 text-center md:text-left">FindAMech</Link>
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-8">
          <a href="#features" className="text-gray-700 hover:text-blue-600 transition">Features</a>
          <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 transition">How It Works</a>
          <a href="#testimonials" className="text-gray-700 hover:text-blue-600 transition">Reviews</a>
          {loggedIn && (
            <Link to="/bookings" className="text-gray-700 hover:text-blue-600 transition">My Bookings</Link>
          )}
        </div>
        <div className="flex flex-wrap justify-center gap-3 md:justify-end">
          {!loggedIn && (
            <>
              <Link to="/signin" className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition">
                Sign In
              </Link>
              <Link to="/signup" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Get Started
              </Link>
            </>
          )}
          {loggedIn && (
            <button onClick={handleLogout} className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition">
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}