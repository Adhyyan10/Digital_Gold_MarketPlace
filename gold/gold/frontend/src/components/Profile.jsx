import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Camera, Save, Edit2, Loader2 } from 'lucide-react';
import api from '../api';

const Profile = () => {
    const { user, checkAuth } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        phone: '',
        bio: '',
        avatar: null
    });

    useEffect(() => {
        if (user) {
            setProfile(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                bio: user.bio || '',
            }));
        }
    }, [user]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await api.post('/auth/update', {
                name: profile.name,
                phone: profile.phone,
                bio: profile.bio
            });
            await checkAuth(); // Refresh user data in context
            setIsEditing(false);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Failed to update profile:', error);
            alert('Failed to update profile. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfile({ ...profile, avatar: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold mb-2">Profile</h2>
                    <p className="text-gray-400">Manage your personal information</p>
                </div>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center gap-2 bg-yellow-500 text-gray-900 px-4 py-2 rounded-xl font-semibold hover:bg-yellow-400 transition"
                >
                    <Edit2 className="w-4 h-4" />
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
            </div>

            {/* Profile Card */}
            <div className="bg-white backdrop-blur-xl border border-gray-200 rounded-2xl p-6 shadow-xl">
                {/* Avatar Section */}
                <div className="flex flex-col items-center mb-6">
                    <div className="relative">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center text-4xl font-bold text-white overflow-hidden shadow-lg">
                            {profile.avatar ? (
                                <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                profile.name.charAt(0).toUpperCase()
                            )}
                        </div>
                        {isEditing && (
                            <label className="absolute bottom-0 right-0 bg-yellow-500 p-2 rounded-full cursor-pointer hover:bg-yellow-400 transition shadow-md">
                                <Camera className="w-5 h-5 text-gray-900" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                />
                            </label>
                        )}
                    </div>
                    <h3 className="text-2xl font-bold mt-4 text-gray-900 ">{profile.name}</h3>
                    <p className="text-gray-500 ">{profile.email}</p>
                </div>

                {/* Profile Fields */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2 flex items-center text-gray-700 ">
                            <User className="w-4 h-4 mr-2" />
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={profile.name}
                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                            disabled={!isEditing}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 flex items-center text-gray-700 ">
                            <Mail className="w-4 h-4 mr-2" />
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={profile.email}
                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                            disabled={!isEditing}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 flex items-center text-gray-700 ">
                            <Phone className="w-4 h-4 mr-2" />
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            value={profile.phone}
                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                            disabled={!isEditing}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 ">Bio</label>
                        <textarea
                            value={profile.bio}
                            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                            disabled={!isEditing}
                            rows={3}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-60 disabled:cursor-not-allowed resize-none transition-colors"
                        />
                    </div>
                </div>

                {/* Save Button */}
                {isEditing && (
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="w-full mt-6 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 font-bold py-3 px-6 rounded-xl hover:from-yellow-400 hover:to-yellow-500 transition duration-200 shadow-lg shadow-yellow-500/30 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSaving ? (
                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        ) : (
                            <Save className="w-5 h-5 mr-2" />
                        )}
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                )}
            </div>

            {/* Account Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white backdrop-blur-xl border border-gray-200 rounded-2xl p-4 text-center shadow-lg">
                    <p className="text-2xl font-bold text-yellow-500">24</p>
                    <p className="text-sm text-gray-500 ">Transactions</p>
                </div>
                <div className="bg-white backdrop-blur-xl border border-gray-200 rounded-2xl p-4 text-center shadow-lg">
                    <p className="text-2xl font-bold text-green-500">₹12,450</p>
                    <p className="text-sm text-gray-500 ">Total Invested</p>
                </div>
                <div className="bg-white backdrop-blur-xl border border-gray-200 rounded-2xl p-4 text-center shadow-lg">
                    <p className="text-2xl font-bold text-blue-500">15 days</p>
                    <p className="text-sm text-gray-500 ">Member Since</p>
                </div>
            </div>
        </div>
    );
};

export default Profile;
