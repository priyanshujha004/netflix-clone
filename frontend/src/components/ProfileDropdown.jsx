import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRound, LogOut } from "lucide-react";

const ProfileDropdown = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
    navigate('/login', { replace: true });
  };

  if (!user) return null;

  const initial = user.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 focus:outline-none group cursor-pointer"
        aria-label="User Menu"
      >
        <div className="w-8 h-8 rounded bg-red-600 flex items-center justify-center text-white font-bold text-xs uppercase shadow ring-2 ring-transparent group-hover:ring-red-500 transition-all">
          {initial}
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 group-hover:text-white transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
            }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-30 bg-[#141414] border border-zinc-800 rounded-md shadow-2xl py-1 z-50 animate-fadeIn">
          <Link
            to="/profile"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center gap-2.5 px-4 py-2.5 text-sm text-gray-200 hover:bg-zinc-800 hover:text-white transition"
          >
            <UserRound size={17} strokeWidth={1.8} />
            <span>Profile</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full text-left flex items-center justify-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-600/10 hover:text-red-400 transition cursor-pointer"
          >
            <LogOut size={17} strokeWidth={1.8} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
