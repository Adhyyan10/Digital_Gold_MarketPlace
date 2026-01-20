import React, { useEffect, useState } from 'react';
import api from '../api';
import { Clock, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

const OrderHistory = () => {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await api.get('/trade/history');
                setTransactions(response.data);
            } catch (error) {
                console.error('Error fetching history:', error);
            }
        };

        fetchHistory();
        const interval = setInterval(fetchHistory, 5000);
        return () => clearInterval(interval);
    }, []);

    if (transactions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <Clock className="w-12 h-12 mb-4 opacity-50" />
                <p>No transactions yet. Start trading!</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="text-gray-400 text-sm border-b border-gray-800">
                        <th className="pb-4 font-medium pl-4">Type</th>
                        <th className="pb-4 font-medium">Asset</th>
                        <th className="pb-4 font-medium">Weight (grams)</th>
                        <th className="pb-4 font-medium">Price/gram</th>
                        <th className="pb-4 font-medium">Total</th>
                        <th className="pb-4 font-medium pr-4 text-right">Date</th>
                    </tr>
                </thead>
                <tbody className="text-sm">
                    {transactions.map((tx) => (
                        <tr key={tx.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors group">
                            <td className="py-4 pl-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tx.type === 'BUY'
                                    ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                    }`}>
                                    {tx.type === 'BUY' ? <ArrowDownLeft className="w-3 h-3 mr-1" /> : <ArrowUpRight className="w-3 h-3 mr-1" />}
                                    {tx.type}
                                </span>
                            </td>
                            <td className="py-4 font-bold text-white">{tx.symbol}</td>
                            <td className="py-4 text-gray-300 font-mono">{tx.amount}g</td>
                            <td className="py-4 text-gray-300 font-mono">₹{tx.price.toLocaleString('en-IN')}</td>
                            <td className="py-4 font-bold text-white font-mono">₹{(tx.amount * tx.price).toFixed(2)}</td>
                            <td className="py-4 pr-4 text-right text-gray-500">
                                {new Date(tx.timestamp).toLocaleString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrderHistory;
