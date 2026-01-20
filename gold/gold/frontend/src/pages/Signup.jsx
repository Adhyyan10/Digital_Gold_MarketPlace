import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, Mail, Lock, User, ArrowLeft } from 'lucide-react';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await signup(formData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-yellow-50 via-white to-yellow-50 text-gray-900 font-sans">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden justify-center items-center bg-gradient-to-br from-yellow-400 to-yellow-600">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2070')] bg-cover bg-center opacity-10"></div>
                <div className="relative z-10 p-12 text-center">
                    <div className="mb-6 flex justify-center">
                        <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-2xl transform rotate-12">
                            <TrendingUp className="w-10 h-10 text-yellow-600 -rotate-12" />
                        </div>
                    </div>
                    <h1 className="text-5xl font-bold mb-6 tracking-tight text-white">
                        Join the Future of <span className="text-gray-900">Gold Trading</span>
                    </h1>
                    <p className="text-xl text-white/90 max-w-md mx-auto leading-relaxed">
                        Start your journey with AI-powered insights, real-time analytics, and secure digital gold investments.
                    </p>
                </div>
            </div>

            {/* Right Side - Signup Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="max-w-md w-full space-y-8">
                    <div>
                        <Link to="/login" className="inline-flex items-center text-gray-600 hover:text-gray-900 transition mb-6">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Login
                        </Link>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
                        <p className="text-gray-600">Start trading digital gold today</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-white border border-gray-300 rounded-xl py-3 px-12 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-white border border-gray-300 rounded-xl py-3 px-12 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    minLength="6"
                                    className="w-full bg-white border border-gray-300 rounded-xl py-3 px-12 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
                                    placeholder="••••••••"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-bold py-3 px-6 rounded-xl hover:from-yellow-400 hover:to-yellow-500 transition duration-200 shadow-lg shadow-yellow-500/30 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                        >
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-yellow-600 hover:text-yellow-700 font-semibold">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
