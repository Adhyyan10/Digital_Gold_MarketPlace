import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, TrendingDown, Sparkles, RefreshCw } from 'lucide-react';
import api from '../api';

const AIRecommendations = () => {
    const [loading, setLoading] = useState(true);
    const [recommendation, setRecommendation] = useState(null);
    const [error, setError] = useState(null);

    const fetchRecommendation = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/chat/recommendation');
            setRecommendation({
                action: response.data.action,
                probability: response.data.confidence, // Backend sends "confidence"
                response: response.data.recommendation // Backend sends "recommendation"
            });
        } catch (err) {
            console.error('Failed to fetch recommendation:', err);
            setError('Unable to fetch AI recommendation');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecommendation();
        // Refresh every 5 minutes
        const interval = setInterval(fetchRecommendation, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const getActionColor = (action) => {
        switch (action) {
            case 'BUY': return 'from-green-500 to-green-600';
            case 'SELL': return 'from-red-500 to-red-600';
            case 'HOLD': return 'from-yellow-500 to-yellow-600';
            default: return 'from-gray-500 to-gray-600';
        }
    };

    const getActionIcon = (action) => {
        switch (action) {
            case 'BUY': return <TrendingUp className="w-8 h-8" />;
            case 'SELL': return <TrendingDown className="w-8 h-8" />;
            default: return <Brain className="w-8 h-8" />;
        }
    };

    if (loading) {
        return (
            <div className="bg-white backdrop-blur-xl border border-gray-200 rounded-2xl p-8 shadow-xl">
                <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="relative">
                        <div className="absolute inset-0 bg-yellow-500 blur-xl opacity-20 animate-pulse"></div>
                        <Brain className="w-16 h-16 text-yellow-500 animate-bounce relative z-10" />
                    </div>
                    <p className="text-gray-500 ">Analyzing market conditions...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white backdrop-blur-xl border border-gray-200 rounded-2xl p-8 shadow-xl">
                <div className="text-center">
                    <p className="text-red-500">{error}</p>
                    <button
                        onClick={fetchRecommendation}
                        className="mt-4 px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-600 transition"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white backdrop-blur-xl border border-gray-200 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <Brain className="w-6 h-6 mr-2 text-yellow-500" />
                    <h2 className="text-xl font-bold text-gray-900 ">AI Recommendation</h2>
                </div>
                <button
                    onClick={fetchRecommendation}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                    title="Refresh recommendation"
                >
                    <RefreshCw className="w-5 h-5 text-gray-500" />
                </button>
            </div>

            {/* Main Recommendation Card */}
            <div className={`bg-gradient-to-br ${getActionColor(recommendation.action)} p-6 rounded-xl text-white mb-4`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                            {getActionIcon(recommendation.action)}
                        </div>
                        <div>
                            <p className="text-sm opacity-90">Market Signal</p>
                            <h3 className="text-3xl font-bold">{recommendation.action}</h3>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm opacity-90">Confidence</p>
                        <p className="text-4xl font-bold">{recommendation.probability}</p>
                    </div>
                </div>
            </div>

            {/* Analysis Details */}
            <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-start space-x-2">
                    <Sparkles className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                    <div className="text-sm text-gray-700 leading-relaxed">
                        {recommendation.response.split('\n').slice(0, 5).map((line, idx) => (
                            <p key={idx} className="mb-1">{line.replace(/\*\*/g, '').replace(/📈|📉|⏸️/g, '')}</p>
                        ))}
                    </div>
                </div>
            </div>

            <p className="text-xs text-gray-400 mt-4 text-center">
                AI-powered analysis • Updates every 5 minutes
            </p>
        </div>
    );
};

export default AIRecommendations;
