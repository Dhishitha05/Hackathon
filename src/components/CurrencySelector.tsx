import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe } from 'lucide-react';

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  rate: number; // Exchange rate relative to USD
}

export const currencies: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1.0 },
  { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.85 },
  { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.75 },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rate: 110.0 },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', rate: 1.25 },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', rate: 1.35 },
];

interface CurrencySelectorProps {
  selectedCurrency: Currency;
  onCurrencyChange: (currency: Currency) => void;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  selectedCurrency,
  onCurrencyChange,
}) => {
  const handleValueChange = (value: string) => {
    const currency = currencies.find(c => c.code === value);
    if (currency) {
      onCurrencyChange(currency);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <Select value={selectedCurrency.code} onValueChange={handleValueChange}>
        <SelectTrigger className="w-36 bg-card border-border hover:bg-accent/50 transition-colors">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-card border-border shadow-elevation z-50">
          {currencies.map((currency) => (
            <SelectItem 
              key={currency.code} 
              value={currency.code}
              className="hover:bg-accent/50 focus:bg-accent/50 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="font-medium">{currency.symbol}</span>
                <span>{currency.code}</span>
                <span className="text-muted-foreground text-xs">({currency.name})</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CurrencySelector;