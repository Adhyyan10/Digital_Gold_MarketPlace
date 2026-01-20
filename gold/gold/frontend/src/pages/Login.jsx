import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { TrendingUp, Shield, Globe, Mail, Lock } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(formData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Login failed. Please try again.');
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
            {/* Left Side - Hero / Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden justify-center items-center bg-gradient-to-br from-yellow-400 to-yellow-600">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1642543492481-44e81e3914a7?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
                <div className="relative z-10 p-12 text-center">
                    <div className="mb-6 flex justify-center">
                        <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-2xl transform rotate-12">
                            <TrendingUp className="w-10 h-10 text-yellow-600 -rotate-12" />
                        </div>
                    </div>
                    <h1 className="text-5xl font-bold mb-6 tracking-tight text-white">
                        Digital Gold <span className="text-gray-900">Marketplace</span>
                    </h1>
                    <p className="text-xl text-white/90 max-w-md mx-auto leading-relaxed">
                        Experience the future of asset trading. Real-time analytics, secure transactions, and AI-powered insights.
                    </p>

                    <div className="mt-12 flex justify-center space-x-8">
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3 border border-white/30">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-sm text-white/80">Secure</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3 border border-white/30">
                                <TrendingUp className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-sm text-white/80">Real-time</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3 border border-white/30">
                                <Globe className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-sm text-white/80">Global</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                        <p className="text-gray-600">Sign in to access your portfolio</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
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
                                    className="w-full bg-white border border-gray-300 rounded-xl py-3 px-12 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-bold py-3 px-6 rounded-xl hover:from-yellow-400 hover:to-yellow-500 transition duration-200 shadow-lg shadow-yellow-500/30 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>

                        <div className="relative flex items-center justify-center mt-6">
                            <div className="border-t border-gray-300 w-full absolute"></div>
                            <span className="bg-white px-3 text-xs text-gray-500 relative z-10">OR CONTINUE WITH</span>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                window.location.href = 'http://localhost:9090/oauth2/authorization/google';
                            }}
                            className="w-full bg-white border border-gray-300 text-gray-900 font-bold py-3 px-6 rounded-xl hover:bg-gray-50 transition duration-200 flex items-center justify-center gap-3"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Continue with Google
                        </button>

                        <button
                            type="button"
                            onClick={async () => {
                                try {
                                    setLoading(true);
                                    // Ensure demo user exists
                                    await api.get('/public/demo-login');
                                    // Login with demo credentials
                                    await login({ email: 'demo@example.com', password: 'demo123' });
                                    navigate('/dashboard');
                                } catch (err) {
                                    console.error("Demo login error:", err);
                                    setError('Demo login failed. Please try again.');
                                } finally {
                                    setLoading(false);
                                }
                            }}
                            className="w-full bg-gray-100 text-gray-900 font-bold py-3 px-6 rounded-xl hover:bg-gray-200 transition duration-200 flex items-center justify-center gap-3 mt-4"
                        >
                            <Shield className="w-5 h-5 text-green-600" />
                            Demo Login (No Password)
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-yellow-600 hover:text-yellow-700 font-semibold">
                            Sign Up
                        </Link>
                    </p>

                    <p className="text-center text-xs text-gray-500 mt-8">
                        By continuing, you agree to our{' '}
                        <a href="#" className="text-gray-600 hover:text-gray-900 underline">Terms of Service</a>
                        {' '}and{' '}
                        <a href="#" className="text-gray-600 hover:text-gray-900 underline">Privacy Policy</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
