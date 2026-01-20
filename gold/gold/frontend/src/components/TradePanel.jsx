import React, { useState } from 'react';
import api from '../api';
import { ArrowRightLeft, CheckCircle, AlertCircle, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Indian cities with price variations (in %)
const INDIAN_CITIES = {
    'Mumbai': { variation: 0, state: 'Maharashtra' },
    'Delhi': { variation: -0.5, state: 'Delhi' },
    'Bangalore': { variation: 0.3, state: 'Karnataka' },
    'Chennai': { variation: 0.2, state: 'Tamil Nadu' },
    'Kolkata': { variation: -0.3, state: 'West Bengal' },
    'Hyderabad': { variation: 0.1, state: 'Telangana' },
    'Pune': { variation: 0.2, state: 'Maharashtra' },
    'Ahmedabad': { variation: -0.2, state: 'Gujarat' },
    'Jaipur': { variation: 0.4, state: 'Rajasthan' },
    'Surat': { variation: -0.1, state: 'Gujarat' }
};

const GOLD_CARATS = {
    '24K': { purity: 1.0, name: '24 Karat (99.9% Pure)' },
    '22K': { purity: 0.9167, name: '22 Karat (91.67% Pure)' },
    '18K': { purity: 0.75, name: '18 Karat (75% Pure)' }
};

const TradePanel = ({ prices }) => {
    const [type, setType] = useState('BUY');
    const [weightGrams, setWeightGrams] = useState('');
    const [carat, setCarat] = useState('24K');
    const [city, setCity] = useState('Mumbai');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleTrade = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        try {
            await api.post('/trade/execute', {
                type,
                symbol: 'GOLD',
                amount: parseFloat(weightGrams) // Send grams directly
            });
            setMessage({ type: 'success', text: 'Trade executed successfully!' });
            setWeightGrams('');

            // Refresh page to update wallet balance and transaction history
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Trade failed. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    // Get base price per gram for selected carat
    const basePrice = prices[`GOLD_${carat}`] || prices.GOLD || 12426;

    // Apply city variation
    const cityVariation = INDIAN_CITIES[city]?.variation || 0;
    const pricePerGram = basePrice * (1 + cityVariation / 100);

    // Calculate total
    const weight = parseFloat(weightGrams) || 0;
    const total = (weight * pricePerGram).toFixed(2);

    return (
        <div className="bg-white backdrop-blur-xl border border-gray-200 rounded-2xl p-6 shadow-xl h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                    <ArrowRightLeft className="w-5 h-5 mr-2 text-yellow-500" />
                    Quick Trade
                </h3>
                <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-xs font-mono text-green-500 flex items-center">
                    Live
                </div>
            </div>

            {/* Buy/Sell Toggle */}
            <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
                <button
                    onClick={() => setType('BUY')}
                    className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all duration-200 ${type === 'BUY'
                        ? 'bg-green-500 text-white shadow-lg shadow-green-500/20'
                        : 'text-gray-500 hover:text-gray-900'
                        }`}
                >
                    Buy
                </button>
                <button
                    onClick={() => setType('SELL')}
                    className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all duration-200 ${type === 'SELL'
                        ? 'bg-red-500 text-white shadow-lg shadow-red-500/20'
                        : 'text-gray-500 hover:text-gray-900'
                        }`}
                >
                    Sell
                </button>
            </div>

            <form onSubmit={handleTrade} className="space-y-5 flex-1 flex flex-col">
                {/* Carat Selection */}
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Gold Purity</label>
                    <select
                        value={carat}
                        onChange={(e) => setCarat(e.target.value)}
                        className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all font-medium"
                    >
                        {Object.entries(GOLD_CARATS).map(([key, value]) => (
                            <option key={key} value={key}>{value.name}</option>
                        ))}
                    </select>
                </div>

                {/* City Selection */}
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        City
                    </label>
                    <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all font-medium"
                    >
                        {Object.entries(INDIAN_CITIES).map(([cityName, data]) => (
                            <option key={cityName} value={cityName}>
                                {cityName}, {data.state} {data.variation !== 0 && `(${data.variation > 0 ? '+' : ''}${data.variation}%)`}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Weight Input */}
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Weight (Grams)</label>
                    <div className="relative">
                        <input
                            type="number"
                            step="0.01"
                            value={weightGrams}
                            onChange={(e) => setWeightGrams(e.target.value)}
                            className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all font-mono"
                            placeholder="0.00"
                            required
                        />
                        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm font-medium">grams</span>
                    </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mt-auto space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500 ">Price per Gram ({carat})</span>
                        <span className="text-gray-900 font-mono">₹{pricePerGram.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>

                    {weight > 0 && (
                        <>
                            <div className="flex justify-between text-sm border-t border-gray-200 pt-2">
                                <span className="text-gray-500 ">Weight</span>
                                <span className="text-gray-900 font-mono">{weight.toFixed(2)} grams</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 ">Location</span>
                                <span className="text-gray-900 font-medium">{city}</span>
                            </div>
                        </>
                    )}

                    <div className="flex justify-between items-end border-t border-gray-200 pt-2">
                        <span className="text-gray-500 text-sm">Total Amount</span>
                        <span className="text-2xl font-bold text-yellow-500 font-mono">₹{parseFloat(total).toLocaleString('en-IN')}</span>
                    </div>
                </div>

                <AnimatePresence>
                    {message && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className={`p-3 rounded-lg text-sm flex items-center ${message.type === 'success'
                                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                }`}
                        >
                            {message.type === 'success' ? <CheckCircle className="w-4 h-4 mr-2" /> : <AlertCircle className="w-4 h-4 mr-2" />}
                            {message.text}
                        </motion.div>
                    )}
                </AnimatePresence>

                <button
                    type="submit"
                    disabled={loading || !weightGrams || parseFloat(weightGrams) <= 0}
                    className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${type === 'BUY'
                        ? 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 shadow-green-500/20'
                        : 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 shadow-red-500/20'
                        }`}
                >
                    {loading ? (
                        <div className="flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Processing...
                        </div>
                    ) : (
                        `${type} ${weight > 0 ? weight.toFixed(2) + 'g' : ''} GOLD NOW`
                    )}
                </button>
            </form>
        </div>
    );
};

export default TradePanel;
