import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChartIcon } from 'lucide-react';

const PieChartDistribution = ({
  pieChartData,
  CustomTooltip,
}: {
  pieChartData: { name: string; value: number; color: string; icon: string }[];
  CustomTooltip: React.ComponentType<{ active?: boolean; payload?: any[]; label?: string }>;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Distribution</CardTitle>
        <CardDescription>
          Visual breakdown of your budget allocations across categories
        </CardDescription>
      </CardHeader>
      <CardContent>
        {pieChartData.length > 0 ? (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={value => {
                    const item = pieChartData.find(d => d.name === value);
                    return (
                      <span style={{ color: item?.color }}>
                        {item?.icon} {value}
                      </span>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex h-80 items-center justify-center">
            <div className="text-center">
              <PieChartIcon className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
              <p className="text-muted-foreground">
                Add budget allocations to see the distribution chart
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PieChartDistribution;
