import { useCorridors } from '@/context/CorridorContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ArrowLeft, TrendingDown, TrendingUp, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CorridorInsights = () => {
  const { selectedCorridor } = useCorridors();
  const navigate = useNavigate();

  if (!selectedCorridor) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">No Corridor Selected</h2>
          <Button onClick={() => navigate('/')}>Return to Dashboard</Button>
        </div>
      </div>
    );
  }

  const riskColor =
    selectedCorridor.riskLevel === 'safe'
      ? 'bg-green-500 text-white'
      : selectedCorridor.riskLevel === 'at-risk'
      ? 'bg-yellow-500 text-black'
      : 'bg-[hsl(var(--danger))] text-[hsl(var(--danger-foreground))]';

  const chartData = selectedCorridor.history.map((h) => ({
    date: h.timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: h.score,
    pollution: h.pollution,
  }));

  const predictedRisk = selectedCorridor.score > 70 ? 'Low' : selectedCorridor.score > 50 ? 'Medium' : 'High';

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        <div>
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold">{selectedCorridor.name}</h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">Detailed corridor insights and analytics</p>
          </div>
          <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto justify-between md:justify-end">
            <div className="text-left md:text-right">
              <p className="text-xs md:text-sm text-muted-foreground">Current Score</p>
              <p className="text-2xl md:text-3xl font-bold">{selectedCorridor.score}</p>
            </div>
            <Badge className={`${riskColor} text-sm md:text-lg px-3 py-1 md:px-4 md:py-2`}>
              {selectedCorridor.riskLevel === 'safe' ? 'Safe' : 
               selectedCorridor.riskLevel === 'at-risk' ? 'At Risk' : 'Failing'}
            </Badge>
          </div>
        </div>

        {/* Score History Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Score History</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  name="DEES Score"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Pollution Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Pollution Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="pollution"
                    stroke="hsl(var(--danger))"
                    strokeWidth={2}
                    name="Pollution Index"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Predicted Risk */}
          <Card>
            <CardHeader>
              <CardTitle>Predicted Risk Level</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Next 7 Days</p>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={
                        predictedRisk === 'Low'
                          ? 'bg-green-500'
                          : predictedRisk === 'Medium'
                          ? 'bg-yellow-500 text-black'
                          : 'bg-[hsl(var(--danger))]'
                      }
                    >
                      {predictedRisk} Risk
                    </Badge>
                    {predictedRisk === 'Low' ? (
                      <TrendingDown className="h-5 w-5 text-green-500" />
                    ) : predictedRisk === 'Medium' ? (
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    ) : (
                      <TrendingUp className="h-5 w-5 text-[hsl(var(--danger))]" />
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Environmental Score</span>
                    <span>{selectedCorridor.score}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${selectedCorridor.score}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Compliance Rate</span>
                    <span>{selectedCorridor.metrics.compliance}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500"
                      style={{ width: `${selectedCorridor.metrics.compliance}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Blockchain Events */}
        <Card>
          <CardHeader>
            <CardTitle>Blockchain Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedCorridor.blockchainEvents.map((event, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className={`p-2 rounded-full ${
                    event.type === 'cert-added' ? 'bg-green-500/10' :
                    event.type === 'score-update' ? 'bg-primary/10' :
                    event.type === 'spike-detected' ? 'bg-[hsl(var(--danger))]/10' :
                    'bg-yellow-500/10'
                  }`}>
                    <div className={`h-2 w-2 rounded-full ${
                      event.type === 'cert-added' ? 'bg-green-500' :
                      event.type === 'score-update' ? 'bg-primary' :
                      event.type === 'spike-detected' ? 'bg-[hsl(var(--danger))]' :
                      'bg-yellow-500'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{event.message}</p>
                    <p className="text-sm text-muted-foreground">
                      {event.timestamp.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CorridorInsights;
