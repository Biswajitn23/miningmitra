import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Corridor } from '@/context/CorridorContext';
import { ArrowRight, Clock } from 'lucide-react';

interface CorridorCardProps {
  corridor: Corridor;
  onClick: () => void;
}

const CorridorCard = ({ corridor, onClick }: CorridorCardProps) => {
  const riskColor =
    corridor.riskLevel === 'safe'
      ? 'bg-green-500/20 text-green-400 border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.2)]'
      : corridor.riskLevel === 'at-risk'
      ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.2)]'
      : 'bg-red-500/20 text-red-400 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]';

  const riskLabel =
    corridor.riskLevel === 'safe'
      ? 'Safe'
      : corridor.riskLevel === 'at-risk'
      ? 'At Risk'
      : 'Failing';

  return (
    <Card className="cursor-pointer bg-card/50 backdrop-blur-xl border-border/50 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300" onClick={onClick}>
      <CardHeader className="pb-2 md:pb-3 p-4 md:p-6">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-sm md:text-base flex items-center gap-1 md:gap-2 text-foreground font-bold">
            <span className="truncate">{corridor.from}</span>
            <ArrowRight className="h-3 w-3 md:h-4 md:w-4 text-primary flex-shrink-0" /> 
            <span className="truncate">{corridor.to}</span>
          </CardTitle>
          <Badge className={`${riskColor} border font-semibold text-xs whitespace-nowrap`}>{riskLabel}</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 md:p-6 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-300 to-red-400 bg-clip-text text-transparent">{corridor.score}</p>
            <p className="text-[10px] md:text-xs text-muted-foreground font-medium mt-1">DEES Score</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-[10px] md:text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span className="hidden sm:inline">{corridor.lastUpdate.toLocaleTimeString()}</span>
              <span className="sm:hidden">{corridor.lastUpdate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CorridorCard;
