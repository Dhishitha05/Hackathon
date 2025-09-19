import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, 
  ComposedChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend 
} from 'recharts';
import { Download, TrendingUp, Users, DollarSign, Calculator } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CurrencySelector, { Currency, currencies } from './CurrencySelector';
import ChartSelector, { chartTypes } from './ChartSelector';

interface ScenarioData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

const BudgetSimulator = () => {
  const [spending, setSpending] = useState([150]);
  const [pricing, setPricing] = useState([300]);
  const [hiring, setHiring] = useState([25]);
  const [scenarioCount, setScenarioCount] = useState(0);
  const [exportCount, setExportCount] = useState(0);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currencies[0]); // USD default
  const [selectedChart, setSelectedChart] = useState('bar');
  const { toast } = useToast();

  const generateScenarioData = (): ScenarioData[] => {
    const baseRevenue = pricing[0] * 1000;
    const baseCosts = spending[0] * 100;
    const staffCosts = hiring[0] * 5000;
    
    return [
      {
        month: 'Jan',
        revenue: baseRevenue * 0.8,
        expenses: baseCosts + staffCosts,
        profit: (baseRevenue * 0.8) - (baseCosts + staffCosts),
      },
      {
        month: 'Feb',
        revenue: baseRevenue * 0.9,
        expenses: baseCosts + staffCosts * 1.1,
        profit: (baseRevenue * 0.9) - (baseCosts + staffCosts * 1.1),
      },
      {
        month: 'Mar',
        revenue: baseRevenue,
        expenses: baseCosts + staffCosts * 1.2,
        profit: baseRevenue - (baseCosts + staffCosts * 1.2),
      },
      {
        month: 'Apr',
        revenue: baseRevenue * 1.1,
        expenses: baseCosts + staffCosts * 1.2,
        profit: (baseRevenue * 1.1) - (baseCosts + staffCosts * 1.2),
      },
      {
        month: 'May',
        revenue: baseRevenue * 1.2,
        expenses: baseCosts + staffCosts * 1.3,
        profit: (baseRevenue * 1.2) - (baseCosts + staffCosts * 1.3),
      },
      {
        month: 'Jun',
        revenue: baseRevenue * 1.3,
        expenses: baseCosts + staffCosts * 1.3,
        profit: (baseRevenue * 1.3) - (baseCosts + staffCosts * 1.3),
      },
    ];
  };

  const [data, setData] = useState<ScenarioData[]>(generateScenarioData());

  useEffect(() => {
    setData(generateScenarioData());
    setScenarioCount(prev => prev + 1);
  }, [spending, pricing, hiring]);

  // Convert values to selected currency
  const convertCurrency = (value: number) => {
    return value * selectedCurrency.rate;
  };

  const formatCurrency = (value: number) => {
    const convertedValue = convertCurrency(value);
    return `${selectedCurrency.symbol}${convertedValue.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const totalExpenses = data.reduce((sum, item) => sum + item.expenses, 0);
  const totalProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  // Prepare pie chart data
  const pieData = [
    { name: 'Revenue', value: totalRevenue, fill: 'hsl(var(--chart-secondary))' },
    { name: 'Expenses', value: totalExpenses, fill: 'hsl(var(--chart-tertiary))' },
  ];

  const renderChart = () => {
    const chartProps = {
      data,
      margin: { top: 20, right: 30, left: 20, bottom: 5 }
    };

    switch (selectedChart) {
      case 'line':
        return (
          <LineChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }} 
            />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="hsl(var(--chart-secondary))" strokeWidth={3} />
            <Line type="monotone" dataKey="expenses" stroke="hsl(var(--chart-tertiary))" strokeWidth={3} />
            <Line type="monotone" dataKey="profit" stroke="hsl(var(--chart-primary))" strokeWidth={3} />
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }} 
            />
            <Legend />
            <Area dataKey="revenue" stackId="1" stroke="hsl(var(--chart-secondary))" fill="hsl(var(--chart-secondary))" fillOpacity={0.6} />
            <Area dataKey="expenses" stackId="1" stroke="hsl(var(--chart-tertiary))" fill="hsl(var(--chart-tertiary))" fillOpacity={0.6} />
          </AreaChart>
        );

      case 'pie':
        return (
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }} 
            />
            <Legend />
          </PieChart>
        );

      case 'composed':
        return (
          <ComposedChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }} 
            />
            <Legend />
            <Bar dataKey="revenue" fill="hsl(var(--chart-secondary))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" fill="hsl(var(--chart-tertiary))" radius={[4, 4, 0, 0]} />
            <Line type="monotone" dataKey="profit" stroke="hsl(var(--chart-primary))" strokeWidth={3} />
          </ComposedChart>
        );

      default: // bar chart
        return (
          <BarChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }} 
            />
            <Legend />
            <Bar dataKey="revenue" fill="hsl(var(--chart-secondary))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" fill="hsl(var(--chart-tertiary))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="profit" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.profit >= 0 ? "hsl(var(--chart-secondary))" : "hsl(var(--destructive))"} />
              ))}
            </Bar>
          </BarChart>
        );
    }
  };

  const handleExportReport = () => {
    const reportData = {
      scenario: {
        spending: spending[0],
        pricing: pricing[0],
        hiring: hiring[0],
        currency: selectedCurrency.code,
      },
      forecast: {
        totalRevenue: formatCurrency(totalRevenue),
        totalExpenses: formatCurrency(totalExpenses),
        totalProfit: formatCurrency(totalProfit),
        profitMargin: profitMargin.toFixed(1),
      },
      monthlyBreakdown: data.map(item => ({
        ...item,
        revenue: formatCurrency(item.revenue),
        expenses: formatCurrency(item.expenses),
        profit: formatCurrency(item.profit),
      })),
      chartType: selectedChart,
      generatedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `budget-scenario-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setExportCount(prev => prev + 1);
    toast({
      title: "Report Exported",
      description: "Budget scenario report has been downloaded successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Calculator className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              CFO Helper Agent
            </h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Simulate budget scenarios and forecast financial outcomes
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span>{scenarioCount} scenarios tested</span>
            </div>
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span>{exportCount} reports exported</span>
            </div>
            <CurrencySelector 
              selectedCurrency={selectedCurrency}
              onCurrencyChange={setSelectedCurrency}
            />
          </div>
        </div>

        {/* Control Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="gradient-card shadow-card">
            <CardHeader className="space-y-3">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Monthly Spending</CardTitle>
              </div>
              <CardDescription>Operational expenses (in hundreds)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-2xl font-bold text-primary">{formatCurrency(spending[0] * 100)}</div>
              <Slider
                value={spending}
                onValueChange={setSpending}
                max={500}
                min={50}
                step={10}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatCurrency(5000)}</span>
                <span>{formatCurrency(50000)}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card shadow-card">
            <CardHeader className="space-y-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-success" />
                <CardTitle className="text-lg">Pricing Strategy</CardTitle>
              </div>
              <CardDescription>Revenue per unit (in thousands)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-2xl font-bold text-success">{formatCurrency(pricing[0] * 1000)}</div>
              <Slider
                value={pricing}
                onValueChange={setPricing}
                max={1000}
                min={100}
                step={25}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatCurrency(100000)}</span>
                <span>{formatCurrency(1000000)}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card shadow-card">
            <CardHeader className="space-y-3">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-warning" />
                <CardTitle className="text-lg">Team Size</CardTitle>
              </div>
              <CardDescription>Number of employees</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-2xl font-bold text-warning">{hiring[0]} people</div>
              <Slider
                value={hiring}
                onValueChange={setHiring}
                max={200}
                min={1}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1 person</span>
                <span>200 people</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart Selection */}
        <ChartSelector 
          selectedChart={selectedChart}
          onChartChange={setSelectedChart}
        />

        {/* Results */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Key Metrics */}
          <div className="space-y-4">
            <Card className="gradient-card shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">6-Month Forecast</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Revenue</span>
                    <span className="font-semibold text-success">{formatCurrency(totalRevenue)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Expenses</span>
                    <span className="font-semibold text-destructive">{formatCurrency(totalExpenses)}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Net Profit</span>
                      <span className={`font-bold text-lg ${totalProfit >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {formatCurrency(totalProfit)}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Profit Margin</span>
                    <Badge variant={profitMargin >= 20 ? "default" : profitMargin >= 10 ? "secondary" : "destructive"}>
                      {profitMargin.toFixed(1)}%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button 
              onClick={handleExportReport} 
              className="w-full gradient-primary shadow-elevation hover:shadow-dashboard transition-all duration-300"
              size="lg"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>

          {/* Chart */}
          <div className="lg:col-span-2">
            <Card className="gradient-card shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">
                  Monthly Financial Projection - {chartTypes.find(c => c.id === selectedChart)?.name}
                </CardTitle>
                <CardDescription>Revenue vs Expenses over 6 months in {selectedCurrency.code}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    {renderChart()}
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-6 mt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-chart-secondary"></div>
                    <span>Revenue</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-chart-tertiary"></div>
                    <span>Expenses</span>
                  </div>
                  {selectedChart !== 'pie' && (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-chart-primary"></div>
                      <span>Profit</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Integration Status */}
        <Card className="gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Integration Status</CardTitle>
            <CardDescription>Real-time data and billing integration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Flexprice Billing</span>
                  <Badge variant="secondary">Ready</Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  • ${scenarioCount * 0.10} billed for {scenarioCount} scenarios
                  <br />
                  • ${exportCount * 0.25} billed for {exportCount} exports
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Pathway Data</span>
                  <Badge variant="secondary">Simulated</Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  • Mock financial data updated
                  <br />
                  • Real-time expense tracking ready
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BudgetSimulator;