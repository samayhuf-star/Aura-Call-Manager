import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CallStatusData } from '../types';

const COLORS = ['#4ade80', '#facc15', '#60a5fa', '#f87171']; // green, yellow, blue, red

interface CallStatusPieChartProps {
  data: CallStatusData[];
}

export const CallStatusPieChart: React.FC<CallStatusPieChartProps> = ({ data }) => {
  return (
    <div className="bg-background-card p-6 rounded-xl shadow-lg h-96">
      <h3 className="text-lg font-semibold text-text-primary mb-4">Call Status Distribution</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              borderColor: '#4B5563',
              color: '#F9FAFB'
            }}
          />
          <Legend wrapperStyle={{ color: '#F9FAFB' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
