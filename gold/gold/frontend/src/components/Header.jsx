import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, User, LogOut, Settings as SettingsIcon, Wallet, Edit2, X, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = ({ onSearch }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [searchQuery, setSearchQuery] = useState('');

    // Mock notifications for the dropdown
    const [notifications, setNotifications] = useState([
        { id: 1, title: 'Gold Price Alert', message: 'Gold up 2.5%', time: '5m ago', read: false },
        { id: 2, title: 'Trade Executed', message: 'Bought 1oz Gold', time: '1h ago', read: false },
        { id: 3, title: 'Welcome', message: 'Account created successfully', time: '1d ago', read: true },
    ]);

    const profileRef = useRef(null);
    const notificationRef = useRef(null);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setShowProfileMenu(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (onSearch) onSearch(query);
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAsRead = (id) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    };

    return (
        <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-gray-200 px-6 flex items-center justify-between z-30 relative">
            {/* Left Section - Title (Moved from Sidebar for mobile, or just keep empty if Sidebar has it) */}
            <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-6 ml-6">
                {/* Profile */}
                <div className="relative" ref={profileRef}>
                    <button
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className="flex items-center gap-3 p-1.5 pr-3 rounded-xl hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200 "
                    >
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center text-gray-900 font-bold shadow-lg shadow-yellow-500/20">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="hidden md:block text-left">
                            <p className="text-sm font-bold text-gray-700 leading-none mb-1">{user?.name || 'User'}</p>
                            <p className="text-xs text-gray-500 leading-none">Investor</p>
                        </div>
                    </button>

                    {/* Profile Dropdown */}
                    {showProfileMenu && (
                        <div className="absolute right-0 mt-4 w-64 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                            <div className="p-4 border-b border-gray-200 bg-gray-50 ">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center text-gray-900 font-bold text-xl">
                                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 ">{user?.name || 'User'}</p>
                                        <p className="text-xs text-gray-500 ">{user?.email || 'user@example.com'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-2 border-t border-gray-200 ">
                                <button
                                    onClick={logout}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 text-red-400 hover:text-red-500 transition text-sm font-medium"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
