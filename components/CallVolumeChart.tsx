import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { mockCallVolume } from '../data/mockData';

export const CallVolumeChart: React.FC = () => {
  return (
    <div className="bg-background-card p-6 rounded-xl shadow-lg h-96">
      <h3 className="text-lg font-semibold text-text-primary mb-4">Call Volume (Last 30 Days)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={mockCallVolume} margin={{ top: 5, right: 20, left: -10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
          <XAxis dataKey="date" stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
          <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              borderColor: '#4B5563',
              color: '#F9FAFB'
            }}
            labelStyle={{ color: '#9CA3AF' }}
          />
          <Legend wrapperStyle={{ color: '#F9FAFB' }} />
          <Line type="monotone" dataKey="calls" stroke="#4F46E5" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
