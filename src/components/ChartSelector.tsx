import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, LineChart, AreaChart, PieChart, TrendingUp } from 'lucide-react';

export interface ChartType {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

export const chartTypes: ChartType[] = [
  {
    id: 'bar',
    name: 'Bar Chart',
    description: 'Compare values across categories',
    icon: <BarChart3 className="h-4 w-4" />,
    color: 'bg-chart-primary',
  },
  {
    id: 'line',
    name: 'Line Chart',
    description: 'Show trends over time',
    icon: <LineChart className="h-4 w-4" />,
    color: 'bg-chart-secondary',
  },
  {
    id: 'area',
    name: 'Area Chart',
    description: 'Visualize cumulative values',
    icon: <AreaChart className="h-4 w-4" />,
    color: 'bg-chart-tertiary',
  },
  {
    id: 'pie',
    name: 'Pie Chart',
    description: 'Show proportion breakdown',
    icon: <PieChart className="h-4 w-4" />,
    color: 'bg-success',
  },
  {
    id: 'composed',
    name: 'Combined Chart',
    description: 'Multiple chart types together',
    icon: <TrendingUp className="h-4 w-4" />,
    color: 'bg-primary',
  },
];

interface ChartSelectorProps {
  selectedChart: string;
  onChartChange: (chartId: string) => void;
}

const ChartSelector: React.FC<ChartSelectorProps> = ({
  selectedChart,
  onChartChange,
}) => {
  return (
    <Card className="gradient-card shadow-card">
      <CardHeader>
        <CardTitle className="text-lg">Chart Visualization</CardTitle>
        <CardDescription>Choose how to display your financial data</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {chartTypes.map((chart) => (
            <Button
              key={chart.id}
              variant={selectedChart === chart.id ? "default" : "outline"}
              className={`h-auto p-3 flex flex-col items-center gap-2 ${
                selectedChart === chart.id 
                  ? 'gradient-primary shadow-elevation' 
                  : 'hover:bg-accent/50 hover:shadow-card'
              } transition-all duration-300`}
              onClick={() => onChartChange(chart.id)}
            >
              <div className={`p-2 rounded-full ${
                selectedChart === chart.id ? 'bg-white/20' : chart.color + '/20'
              }`}>
                {chart.icon}
              </div>
              <div className="text-center">
                <div className="text-xs font-medium">{chart.name}</div>
                <div className="text-xs text-muted-foreground mt-1 leading-tight">
                  {chart.description}
                </div>
              </div>
            </Button>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary">Current Selection</Badge>
            <span className="text-sm font-medium">
              {chartTypes.find(c => c.id === selectedChart)?.name}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {chartTypes.find(c => c.id === selectedChart)?.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartSelector;