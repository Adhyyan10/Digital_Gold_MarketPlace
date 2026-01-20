import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import PriceChart from '../components/PriceChart';
import TradePanel from '../components/TradePanel';
import OrderHistory from '../components/OrderHistory';
import Settings from '../components/Settings';
import Profile from '../components/Profile';
import Wallet from '../components/Wallet';
import Notifications from '../components/Notifications';
import AIRecommendations from '../components/AIRecommendations';
import api from '../api';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

const Dashboard = () => {
    const [searchParams] = useSearchParams();
    const currentTab = searchParams.get('tab') || 'home';

    // State
    const [prices, setPrices] = useState({ GOLD: 12426, GOLD_24K: 12426, GOLD_22K: 11390, GOLD_18K: 9319 });
    const [priceHistory, setPriceHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('1D');

    // Generate realistic mock history
    useEffect(() => {
        setIsLoading(true);
        const initialHistory = [];
        const now = new Date().getTime();
        let points = 50;
        let interval = 60000;

        if (timeRange === '1D') interval = 30 * 60000;
        if (timeRange === '1W') interval = 4 * 60 * 60000;

        let lastGold = 12426 + (Math.random() - 0.5) * 200;

        for (let i = points; i >= 0; i--) {
            const time = now - i * interval;
            lastGold += (Math.random() - 0.5) * 20;
            if (lastGold > 13500) lastGold = 13400;
            if (lastGold < 11500) lastGold = 11600;

            initialHistory.push({
                timestamp: time,
                name: new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                GOLD: parseFloat(lastGold.toFixed(2))
            });
        }
        setPriceHistory(initialHistory);
        setIsLoading(false);
    }, [timeRange]);

    // Live updates
    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const response = await api.get('/market/prices');
                const newPrices = response.data;
                setPrices(newPrices);

                setPriceHistory(prev => {
                    const now = new Date();
                    const newPoint = {
                        timestamp: now.getTime(),
                        name: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        GOLD: newPrices.GOLD
                    };

                    const newHistory = [...prev, newPoint];
                    if (newHistory.length > 60) newHistory.shift();
                    return newHistory;
                });
            } catch (error) {
                console.error('Error fetching prices:', error);
            }
        };

        fetchPrices();
        const interval = setInterval(fetchPrices, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleSearch = (query) => {
        console.log('Searching for:', query);
    };

    const renderContent = () => {
        switch (currentTab) {
            case 'history':
                return (
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-2xl font-bold mb-1">Transaction History</h2>
                            <p className="text-gray-400 text-sm">View all your past transactions</p>
                        </div>
                        <div className="bg-white backdrop-blur-xl border border-gray-200 rounded-2xl p-6 shadow-xl">
                            <OrderHistory />
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="space-y-6">
                        {/* Top Row: Wallet & AI - Most important for demo */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white backdrop-blur-xl border border-gray-200 rounded-2xl p-6 shadow-xl">
                                <Wallet />
                            </div>
                            <div className="bg-white backdrop-blur-xl border border-gray-200 rounded-2xl p-6 shadow-xl">
                                <AIRecommendations />
                            </div>
                        </div>

                        {/* Middle Row: Buy/Sell & Chart */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="lg:col-span-2 bg-white backdrop-blur-xl border border-gray-200 rounded-2xl p-6 shadow-xl flex flex-col"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-bold flex items-center text-gray-900 ">
                                        <TrendingUp className="w-5 h-5 mr-2 text-yellow-500" />
                                        Gold Market Chart (24K per gram)
                                    </h2>
                                    <div className="flex gap-2">
                                        {['1H', '1D', '1W'].map(range => (
                                            <button
                                                key={range}
                                                onClick={() => setTimeRange(range)}
                                                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${timeRange === range
                                                    ? 'bg-yellow-500 text-gray-900'
                                                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                                    }`}
                                            >
                                                {range}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex-1 min-h-[350px]">
                                    {isLoading ? (
                                        <div className="h-full flex items-center justify-center text-gray-500">Loading Market Data...</div>
                                    ) : (
                                        <PriceChart data={priceHistory} />
                                    )}
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="lg:col-span-1 h-full"
                            >
                                <TradePanel prices={prices} />
                            </motion.div>
                        </div>

                        {/* Bottom Row: Recent Activity */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="bg-white backdrop-blur-xl border border-gray-200 rounded-2xl p-6 shadow-xl"
                        >
                            <h2 className="text-lg font-bold mb-4 flex items-center text-gray-900 ">
                                <span className="w-1.5 h-6 bg-blue-500 rounded-full mr-3"></span>
                                Recent Activity
                            </h2>
                            <OrderHistory />
                        </motion.div>
                    </div>
                );
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden font-sans">
            <Sidebar />

            <div className="flex-1 flex flex-col overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-gray-200 to-transparent pointer-events-none z-0"></div>

                <Header onSearch={handleSearch} />

                <main className="flex-1 overflow-y-auto p-4 md:p-6 z-10 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                    <div className="max-w-7xl mx-auto">
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
