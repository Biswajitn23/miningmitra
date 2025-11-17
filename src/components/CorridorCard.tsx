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
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2 text-foreground font-bold">
            {corridor.from} <ArrowRight className="h-4 w-4 text-primary" /> {corridor.to}
          </CardTitle>
          <Badge className={`${riskColor} border font-semibold`}>{riskLabel}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold bg-gradient-to-r from-gray-300 to-red-400 bg-clip-text text-transparent">{corridor.score}</p>
            <p className="text-xs text-muted-foreground font-medium mt-1">DEES Score</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {corridor.lastUpdate.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CorridorCard;
