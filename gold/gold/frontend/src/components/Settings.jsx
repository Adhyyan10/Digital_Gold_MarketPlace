import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Bell, Globe, Save } from 'lucide-react';

const Settings = () => {
    const { theme, toggleTheme } = useTheme();
    const [settings, setSettings] = useState({
        notifications: true,
        emailAlerts: false,
        priceAlerts: true,
        language: 'en'
    });

    const handleSave = () => {
        // Save settings to backend
        console.log('Settings saved:', settings);
        alert('Settings saved successfully!');
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold mb-2">Settings</h2>
                <p className="text-gray-600">Manage your account preferences</p>
            </div>

            {/* Theme Settings */}
            <div className="bg-white backdrop-blur-xl border border-gray-200 rounded-2xl p-6 shadow-xl">
                <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900">
                    {theme === 'dark' ? <Moon className="w-5 h-5 mr-2" /> : <Sun className="w-5 h-5 mr-2" />}
                    Appearance
                </h3>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium text-gray-900">Theme</p>
                        <p className="text-sm text-gray-500">Choose your preferred theme</p>
                    </div>
                    <button
                        onClick={toggleTheme}
                        className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${theme === 'dark' ? 'bg-yellow-500' : 'bg-gray-200'}`}
                    >
                        <span
                            className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-9' : 'translate-x-1'}`}
                        />
                    </button>
                </div>
                <div className="mt-4 flex gap-4">
                    <div className={`flex-1 p-4 rounded-xl border-2 cursor-pointer transition-all ${theme === 'dark' ? 'border-yellow-500 bg-gray-800 text-white' : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'}`} onClick={() => theme !== 'dark' && toggleTheme()}>
                        <Moon className="w-6 h-6 mb-2" />
                        <p className="font-medium">Dark</p>
                        <p className="text-xs opacity-70">Easy on the eyes</p>
                    </div>
                    <div className={`flex-1 p-4 rounded-xl border-2 cursor-pointer transition-all ${theme === 'light' ? 'border-yellow-500 bg-gray-50 text-gray-900' : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'}`} onClick={() => theme !== 'light' && toggleTheme()}>
                        <Sun className="w-6 h-6 mb-2" />
                        <p className="font-medium">Light</p>
                        <p className="text-xs opacity-70">Classic look</p>
                    </div>
                </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-white backdrop-blur-xl border border-gray-200 rounded-2xl p-6 shadow-xl">
                <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900">
                    <Bell className="w-5 h-5 mr-2" />
                    Notifications
                </h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-900">Push Notifications</p>
                            <p className="text-sm text-gray-500">Receive notifications in browser</p>
                        </div>
                        <input
                            type="checkbox"
                            checked={settings.notifications}
                            onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
                            className="w-5 h-5 rounded"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-900">Email Alerts</p>
                            <p className="text-sm text-gray-500">Get important updates via email</p>
                        </div>
                        <input
                            type="checkbox"
                            checked={settings.emailAlerts}
                            onChange={(e) => setSettings({ ...settings, emailAlerts: e.target.checked })}
                            className="w-5 h-5 rounded"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-900">Price Alerts</p>
                            <p className="text-sm text-gray-500">Notify when prices change significantly</p>
                        </div>
                        <input
                            type="checkbox"
                            checked={settings.priceAlerts}
                            onChange={(e) => setSettings({ ...settings, priceAlerts: e.target.checked })}
                            className="w-5 h-5 rounded"
                        />
                    </div>
                </div>
            </div>

            {/* Language Settings */}
            <div className="bg-white backdrop-blur-xl border border-gray-200 rounded-2xl p-6 shadow-xl">
                <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900">
                    <Globe className="w-5 h-5 mr-2" />
                    Language & Region
                </h3>
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Language</label>
                    <select
                        value={settings.language}
                        onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                        className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    >
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                    </select>
                </div>
            </div>

            {/* Save Button */}
            <button
                onClick={handleSave}
                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-bold py-3 px-6 rounded-xl hover:from-yellow-400 hover:to-yellow-500 transition duration-200 shadow-lg shadow-yellow-500/30 flex items-center justify-center"
            >
                <Save className="w-5 h-5 mr-2" />
                Save Settings
            </button>
        </div>
    );
};

export default Settings;
