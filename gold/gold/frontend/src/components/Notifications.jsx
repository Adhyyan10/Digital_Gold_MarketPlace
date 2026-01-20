import React, { useState, useEffect } from 'react';
import { Bell, TrendingUp, TrendingDown, DollarSign, CheckCircle, X } from 'lucide-react';

const Notifications = () => {
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: 'price_alert',
            title: 'Gold Price Alert',
            message: 'Gold price increased by 2.5% in the last hour',
            time: '5 minutes ago',
            read: false,
            icon: TrendingUp,
            color: 'green'
        },
        {
            id: 2,
            type: 'transaction',
            title: 'Transaction Successful',
            message: 'You successfully bought 2 oz of Gold for $4,100',
            time: '1 hour ago',
            read: false,
            icon: CheckCircle,
            color: 'blue'
        },
        {
            id: 3,
            type: 'price_alert',
            title: 'BTC Price Drop',
            message: 'Bitcoin dropped by 3.2% - Good time to buy?',
            time: '3 hours ago',
            read: true,
            icon: TrendingDown,
            color: 'red'
        },
        {
            id: 4,
            type: 'wallet',
            title: 'Deposit Confirmed',
            message: '$5,000 has been added to your wallet',
            time: '1 day ago',
            read: true,
            icon: DollarSign,
            color: 'yellow'
        },
    ]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAsRead = (id) => {
        setNotifications(notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        ));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const deleteNotification = (id) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    // Simulate live notifications
    useEffect(() => {
        const interval = setInterval(() => {
            const newNotification = {
                id: Date.now(),
                type: 'price_alert',
                title: 'Live Price Update',
                message: `Gold price: $${(2050 + Math.random() * 100).toFixed(2)}`,
                time: 'Just now',
                read: false,
                icon: TrendingUp,
                color: 'green'
            };
            setNotifications(prev => [newNotification, ...prev].slice(0, 10));
        }, 60000); // Every minute

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold mb-2 flex items-center">
                        <Bell className="w-7 h-7 mr-2" />
                        Notifications
                        {unreadCount > 0 && (
                            <span className="ml-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                {unreadCount}
                            </span>
                        )}
                    </h2>
                    <p className="text-gray-400">Stay updated with market changes</p>
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={markAllAsRead}
                        className="text-yellow-500 hover:text-yellow-400 font-semibold transition"
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            {/* Notifications List */}
            <div className="space-y-3">
                {notifications.length === 0 ? (
                    <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-12 text-center">
                        <Bell className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                        <p className="text-gray-400">No notifications yet</p>
                    </div>
                ) : (
                    notifications.map(notification => {
                        const Icon = notification.icon;
                        const colorClasses = {
                            green: 'bg-green-500/20 text-green-500',
                            blue: 'bg-blue-500/20 text-blue-500',
                            red: 'bg-red-500/20 text-red-500',
                            yellow: 'bg-yellow-500/20 text-yellow-500'
                        };

                        return (
                            <div
                                key={notification.id}
                                className={`bg-gray-900/50 backdrop-blur-xl border rounded-2xl p-4 transition hover:bg-gray-800/50 ${notification.read ? 'border-gray-800' : 'border-yellow-500/30 bg-yellow-500/5'
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${colorClasses[notification.color]}`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1">
                                                <h4 className="font-semibold mb-1">{notification.title}</h4>
                                                <p className="text-sm text-gray-400 mb-2">{notification.message}</p>
                                                <p className="text-xs text-gray-500">{notification.time}</p>
                                            </div>
                                            <button
                                                onClick={() => deleteNotification(notification.id)}
                                                className="text-gray-500 hover:text-red-500 transition"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                        {!notification.read && (
                                            <button
                                                onClick={() => markAsRead(notification.id)}
                                                className="mt-2 text-sm text-yellow-500 hover:text-yellow-400 font-medium transition"
                                            >
                                                Mark as read
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Notification Settings */}
            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
                <div className="space-y-3">
                    <label className="flex items-center justify-between cursor-pointer">
                        <span>Price Alerts</span>
                        <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
                    </label>
                    <label className="flex items-center justify-between cursor-pointer">
                        <span>Transaction Updates</span>
                        <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
                    </label>
                    <label className="flex items-center justify-between cursor-pointer">
                        <span>Market News</span>
                        <input type="checkbox" className="w-5 h-5 rounded" />
                    </label>
                </div>
            </div>
        </div>
    );
};

export default Notifications;
