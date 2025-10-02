import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { mockCallsByCampaign } from '../data/mockData';

export const CallsByCampaignChart: React.FC = () => {
  return (
    <div className="bg-background-card p-6 rounded-xl shadow-lg h-96">
      <h3 className="text-lg font-semibold text-text-primary mb-4">Top Campaigns by Calls</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={mockCallsByCampaign} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" horizontal={false} />
          <XAxis type="number" stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
          <YAxis dataKey="campaign" type="category" stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} width={120} />
          <Tooltip
            cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
            contentStyle={{
              backgroundColor: '#1F2937',
              borderColor: '#4B5563',
              color: '#F9FAFB'
            }}
            labelStyle={{ color: '#9CA3AF' }}
          />
          <Bar dataKey="calls" fill="#7C3AED" barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
