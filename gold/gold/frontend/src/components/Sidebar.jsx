import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, History, Settings, LogOut, TrendingUp } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    const { logout } = useAuth();

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: History, label: 'History', path: '/dashboard?tab=history' },
    ];

    return (
        <div className="w-20 lg:w-64 bg-white border-r border-gray-200 flex flex-col justify-between transition-all duration-300 z-20 flex-shrink-0">
            <div>
                <div className="h-20 flex items-center justify-center lg:justify-start lg:px-6 border-b border-gray-200">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/20">
                        <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <span className="hidden lg:block ml-3 text-xl font-bold tracking-tight text-gray-900">
                        Gold<span className="text-yellow-500">Market</span>
                    </span>
                </div>

                <nav className="mt-8 px-2 lg:px-4 space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.label}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center px-3 py-3 rounded-xl transition-all duration-200 group ${isActive
                                    ? 'bg-yellow-500/10 text-yellow-600'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }`
                            }
                        >
                            <item.icon className="w-6 h-6 lg:mr-3 group-hover:scale-110 transition-transform" />
                            <span className="hidden lg:block font-medium">{item.label}</span>

                            {/* Active Indicator */}
                            <div className="ml-auto hidden lg:block opacity-0 group-[.active]:opacity-100">
                                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                            </div>
                        </NavLink>
                    ))}
                </nav>
            </div>

            <div className="p-4 border-t border-gray-200">
                <button
                    onClick={logout}
                    className="w-full flex items-center justify-center lg:justify-start px-3 py-3 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                    <LogOut className="w-6 h-6 lg:mr-3" />
                    <span className="hidden lg:block font-medium">Sign Out</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
