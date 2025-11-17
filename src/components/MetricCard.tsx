import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: number;
  unit: string;
  icon: LucideIcon;
  colorClass?: string;
}

const MetricCard = ({ title, value, unit, icon: Icon, colorClass = 'text-primary' }: MetricCardProps) => {
  return (
    <Card className="bg-card/50 backdrop-blur-xl border-border/50 shadow-xl hover:shadow-2xl hover:border-primary/30 transition-all duration-300">
      <CardContent className="p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs md:text-sm text-muted-foreground mb-1 md:mb-2 font-medium">{title}</p>
            <p className="text-xl md:text-3xl font-bold text-foreground">
              {value}
              <span className="text-sm md:text-base font-normal ml-1 text-muted-foreground">{unit}</span>
            </p>
          </div>
          <div className={`p-2 md:p-4 rounded-xl md:rounded-2xl bg-muted/30 backdrop-blur-sm ${colorClass} shadow-lg`}>
            <Icon className="h-5 w-5 md:h-7 md:w-7" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
