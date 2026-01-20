import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useTheme } from '../context/ThemeContext';

const PriceChart = ({ data }) => {
    const { theme } = useTheme();

    if (!data || data.length === 0) {
        return (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
                Loading chart data...
            </div>
        );
    }

    const isDark = theme === 'dark';
    const gridColor = isDark ? '#374151' : '#E5E7EB';
    const axisColor = isDark ? '#9CA3AF' : '#6B7280';
    const tooltipBg = isDark ? '#1F2937' : '#FFFFFF';
    const tooltipText = isDark ? '#F3F4F6' : '#111827';

    const avgPrice = data.reduce((sum, point) => sum + point.GOLD, 0) / data.length;

    return (
        <div className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                    <defs>
                        <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#EAB308" stopOpacity={0.8} />
                            <stop offset="100%" stopColor="#F59E0B" stopOpacity={0.8} />
                        </linearGradient>
                        <filter id="shadow">
                            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#EAB308" floodOpacity="0.3" />
                        </filter>
                    </defs>

                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={gridColor}
                        vertical={false}
                        strokeOpacity={0.5}
                    />

                    <XAxis
                        dataKey="name"
                        stroke={axisColor}
                        tick={{ fontSize: 11, fill: axisColor }}
                        tickLine={false}
                        axisLine={{ stroke: gridColor }}
                        minTickGap={40}
                    />

                    <YAxis
                        stroke={axisColor}
                        tick={{ fontSize: 11, fill: axisColor }}
                        tickLine={false}
                        axisLine={{ stroke: gridColor }}
                        domain={[(dataMin) => Math.floor(dataMin * 0.998), (dataMax) => Math.ceil(dataMax * 1.002)]}
                        tickFormatter={(value) => `₹${Math.round(value).toLocaleString('en-IN')}`}
                        width={85}
                    />

                    <Tooltip
                        contentStyle={{
                            backgroundColor: tooltipBg,
                            borderColor: '#EAB308',
                            borderRadius: '0.75rem',
                            borderWidth: '2px',
                            color: tooltipText,
                            boxShadow: '0 10px 25px rgba(234, 179, 8, 0.2)'
                        }}
                        itemStyle={{ color: '#EAB308', fontWeight: 'bold' }}
                        labelStyle={{ color: tooltipText, marginBottom: '4px' }}
                        formatter={(value) => [`₹${Number(value).toFixed(2)}`, 'Gold (per gram)']}
                    />

                    <ReferenceLine
                        y={avgPrice}
                        stroke="#EAB308"
                        strokeDasharray="5 5"
                        strokeOpacity={0.3}
                        label={{
                            value: 'Avg',
                            fill: axisColor,
                            fontSize: 10,
                            position: 'right'
                        }}
                    />

                    <Line
                        type="monotone"
                        dataKey="GOLD"
                        stroke="url(#goldGradient)"
                        strokeWidth={3}
                        dot={false}
                        activeDot={{
                            r: 6,
                            fill: '#EAB308',
                            stroke: '#fff',
                            strokeWidth: 2,
                            filter: 'url(#shadow)'
                        }}
                        name="Gold"
                        isAnimationActive={true}
                        animationDuration={500}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PriceChart;
