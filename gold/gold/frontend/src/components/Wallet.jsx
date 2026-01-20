import React, { useState, useEffect } from 'react';
import { Wallet as WalletIcon, Plus, TrendingUp, TrendingDown, CreditCard, Loader2 } from 'lucide-react';
import api from '../api';

const Wallet = () => {
    const [balance, setBalance] = useState(0);
    const [showAddMoney, setShowAddMoney] = useState(false);
    const [amount, setAmount] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        fetchWalletData();
    }, []);

    const fetchWalletData = async () => {
        try {
            const response = await api.get('/trade/wallet');
            setBalance(response.data.balance || 0);

            // Fetch transaction history
            const historyResponse = await api.get('/trade/history');
            setTransactions(historyResponse.data || []);
        } catch (error) {
            console.error('Failed to fetch wallet data:', error);
        }
    };

    const handleAddMoney = async () => {
        const addAmount = parseFloat(amount);
        if (addAmount <= 0 || isNaN(addAmount)) {
            alert('Please enter a valid amount');
            return;
        }

        setIsProcessing(true);

        try {
            // Call mock payment API
            const response = await api.post('/payment/mock-deposit', {
                amount: addAmount
            });

            if (response.data.success) {
                setBalance(response.data.newBalance);
                setShowAddMoney(false);
                setAmount('');
                alert(response.data.message);
                // Refresh wallet data to get updated transactions
                fetchWalletData();
            }
        } catch (error) {
            console.error('Payment failed:', error);
            alert('Payment failed. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };


    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold mb-2">Wallet</h2>
                <p className="text-gray-400">Manage your funds and transactions</p>
            </div>

            {/* Balance Card */}
            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-6 text-gray-900">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <WalletIcon className="w-8 h-8 mr-3" />
                        <div>
                            <p className="text-sm opacity-80">Available Balance</p>
                            <h3 className="text-3xl font-bold">₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h3>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowAddMoney(true)}
                        className="bg-gray-900 text-yellow-500 px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Add Money
                    </button>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                        <p className="text-sm opacity-80">This Month</p>
                        <p className="text-xl font-bold">+₹7,100</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                        <p className="text-sm opacity-80">Total Deposits</p>
                        <p className="text-xl font-bold">₹8,000</p>
                    </div>
                </div>
            </div>

            {/* Add Money Modal */}
            {showAddMoney && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">Add Money to Wallet</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Amount (INR)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">₹</span>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0.00"
                                        disabled={isProcessing}
                                        className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-8 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-50"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {[100, 500, 1000].map(val => (
                                    <button
                                        key={val}
                                        onClick={() => setAmount(val.toString())}
                                        disabled={isProcessing}
                                        className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl py-2 transition disabled:opacity-50"
                                    >
                                        ₹{val}
                                    </button>
                                ))}
                            </div>
                            <div className="flex gap-3 mt-4">
                                <button
                                    onClick={() => {
                                        setShowAddMoney(false);
                                        setAmount('');
                                    }}
                                    disabled={isProcessing}
                                    className="flex-1 bg-gray-800 hover:bg-gray-700 text-white px-4 py-3 rounded-xl font-semibold transition disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddMoney}
                                    disabled={isProcessing || !amount || parseFloat(amount) <= 0}
                                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-3 rounded-xl font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        'Add Money'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Transaction History */}
            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
                <div className="space-y-3">
                    {transactions.length === 0 ? (
                        <p className="text-gray-400 text-center py-8">No transactions yet</p>
                    ) : (
                        transactions.map(tx => (
                            <div key={tx.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'BUY' ? 'bg-red-500/20' : 'bg-green-500/20'}`}>
                                        {tx.type === 'BUY' ?
                                            <TrendingDown className="w-5 h-5 text-red-500" /> :
                                            <TrendingUp className="w-5 h-5 text-green-500" />
                                        }
                                    </div>
                                    <div>
                                        <p className="font-medium">
                                            {tx.type === 'BUY' ? `Bought ${tx.symbol}` : `Sold ${tx.symbol}`}
                                        </p>
                                        <p className="text-sm text-gray-400">{new Date(tx.timestamp).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`font-bold ${tx.type === 'BUY' ? 'text-red-500' : 'text-green-500'}`}>
                                        {tx.type === 'BUY' ? '-' : '+'}₹{(tx.amount * tx.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                    </p>
                                    <p className="text-sm text-gray-400">{tx.amount}g @ ₹{tx.price.toLocaleString('en-IN')}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Wallet;
