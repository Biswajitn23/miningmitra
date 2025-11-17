import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Chatbot } from '@/components/Chatbot';
import { ArrowLeft, Wrench, AlertTriangle, CheckCircle, TrendingUp, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Machine {
  id: string;
  name: string;
  type: string;
  location: string;
  health: number;
  status: 'optimal' | 'needs-attention' | 'critical';
  nextMaintenance: Date;
  predictedFailureRisk: 'low' | 'medium' | 'high';
  metrics: {
    operatingHours: number;
    efficiency: number;
    vibration: number;
    temperature: number;
  };
  maintenanceHistory: {
    date: Date;
    type: string;
    cost: number;
  }[];
  performanceData: {
    date: string;
    health: number;
    efficiency: number;
  }[];
}

const MachineryMaintenance = () => {
  const navigate = useNavigate();
  const [machines] = useState<Machine[]>([
    {
      id: 'M001',
      name: 'Hydraulic Excavator CAT 390F',
      type: 'Excavator',
      location: 'Zone A - Excavation Site',
      health: 92,
      status: 'optimal',
      nextMaintenance: new Date('2025-11-25'),
      predictedFailureRisk: 'low',
      metrics: {
        operatingHours: 3245,
        efficiency: 94,
        vibration: 2.3,
        temperature: 78,
      },
      maintenanceHistory: [
        { date: new Date('2025-10-15'), type: 'Routine Check', cost: 12000 },
        { date: new Date('2025-09-01'), type: 'Oil Change', cost: 8000 },
      ],
      performanceData: [
        { date: 'Nov 10', health: 95, efficiency: 96 },
        { date: 'Nov 12', health: 94, efficiency: 95 },
        { date: 'Nov 14', health: 93, efficiency: 94 },
        { date: 'Nov 16', health: 92, efficiency: 94 },
      ],
    },
    {
      id: 'M002',
      name: 'Haul Truck Komatsu HD785',
      type: 'Haul Truck',
      location: 'Zone D - Transport Corridor',
      health: 68,
      status: 'needs-attention',
      nextMaintenance: new Date('2025-11-20'),
      predictedFailureRisk: 'medium',
      metrics: {
        operatingHours: 5890,
        efficiency: 72,
        vibration: 5.8,
        temperature: 95,
      },
      maintenanceHistory: [
        { date: new Date('2025-10-20'), type: 'Brake Replacement', cost: 45000 },
        { date: new Date('2025-09-15'), type: 'Engine Tune-up', cost: 28000 },
      ],
      performanceData: [
        { date: 'Nov 10', health: 75, efficiency: 78 },
        { date: 'Nov 12', health: 72, efficiency: 75 },
        { date: 'Nov 14', health: 70, efficiency: 73 },
        { date: 'Nov 16', health: 68, efficiency: 72 },
      ],
    },
    {
      id: 'M003',
      name: 'Drilling Rig Atlas Copco ROC D7',
      type: 'Drill',
      location: 'Zone A - Excavation Site',
      health: 45,
      status: 'critical',
      nextMaintenance: new Date('2025-11-18'),
      predictedFailureRisk: 'high',
      metrics: {
        operatingHours: 7234,
        efficiency: 58,
        vibration: 9.2,
        temperature: 112,
      },
      maintenanceHistory: [
        { date: new Date('2025-10-28'), type: 'Emergency Repair', cost: 78000 },
        { date: new Date('2025-09-20'), type: 'Component Replacement', cost: 52000 },
      ],
      performanceData: [
        { date: 'Nov 10', health: 58, efficiency: 65 },
        { date: 'Nov 12', health: 52, efficiency: 62 },
        { date: 'Nov 14', health: 48, efficiency: 60 },
        { date: 'Nov 16', health: 45, efficiency: 58 },
      ],
    },
    {
      id: 'M004',
      name: 'Bulldozer Liebherr PR776',
      type: 'Bulldozer',
      location: 'Zone B - Loading Area',
      health: 88,
      status: 'optimal',
      nextMaintenance: new Date('2025-12-01'),
      predictedFailureRisk: 'low',
      metrics: {
        operatingHours: 2890,
        efficiency: 90,
        vibration: 3.1,
        temperature: 82,
      },
      maintenanceHistory: [
        { date: new Date('2025-10-10'), type: 'Routine Check', cost: 15000 },
      ],
      performanceData: [
        { date: 'Nov 10', health: 90, efficiency: 92 },
        { date: 'Nov 12', health: 89, efficiency: 91 },
        { date: 'Nov 14', health: 88, efficiency: 90 },
        { date: 'Nov 16', health: 88, efficiency: 90 },
      ],
    },
  ]);

  const getStatusColor = (status: Machine['status']) => {
    switch (status) {
      case 'optimal':
        return 'bg-green-500 text-white';
      case 'needs-attention':
        return 'bg-yellow-500 text-black';
      case 'critical':
        return 'bg-red-500 text-white';
    }
  };

  const getRiskColor = (risk: Machine['predictedFailureRisk']) => {
    switch (risk) {
      case 'low':
        return 'text-green-500';
      case 'medium':
        return 'text-yellow-500';
      case 'high':
        return 'text-red-500';
    }
  };

  const getHealthBarColor = (health: number) => {
    if (health >= 80) return 'bg-green-500';
    if (health >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const optimalMachines = machines.filter(m => m.status === 'optimal').length;
  const needsAttention = machines.filter(m => m.status === 'needs-attention').length;
  const criticalMachines = machines.filter(m => m.status === 'critical').length;
  const avgHealth = Math.round(machines.reduce((sum, m) => sum + m.health, 0) / machines.length);

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
            <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-gray-200 via-red-400 to-gray-400 bg-clip-text text-transparent pb-2">
              Predictive Machinery Maintenance
            </h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">
              AI-powered equipment health monitoring and maintenance predictions
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <Card className="bg-card/50 backdrop-blur-xl border-border/50">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground mb-1">Total Machines</p>
                  <p className="text-2xl md:text-3xl font-bold">{machines.length}</p>
                </div>
                <div className="p-3 rounded-xl bg-blue-500/20">
                  <Wrench className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-xl border-border/50">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground mb-1">Optimal</p>
                  <p className="text-2xl md:text-3xl font-bold text-green-500">{optimalMachines}</p>
                </div>
                <div className="p-3 rounded-xl bg-green-500/20">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-xl border-border/50">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground mb-1">Needs Attention</p>
                  <p className="text-2xl md:text-3xl font-bold text-yellow-500">{needsAttention}</p>
                </div>
                <div className="p-3 rounded-xl bg-yellow-500/20">
                  <AlertTriangle className="h-6 w-6 text-yellow-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-xl border-border/50">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground mb-1">Avg Health</p>
                  <p className="text-2xl md:text-3xl font-bold">{avgHealth}%</p>
                </div>
                <div className="p-3 rounded-xl bg-red-500/20">
                  <TrendingUp className="h-6 w-6 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Machines List */}
        <div className="space-y-4 md:space-y-6">
          {machines.map((machine) => (
            <Card
              key={machine.id}
              className="bg-card/50 backdrop-blur-xl border-border/50 hover:shadow-2xl transition-all duration-300"
            >
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <CardTitle className="text-lg">{machine.name}</CardTitle>
                      <Badge className={`${getStatusColor(machine.status)} text-xs`}>
                        {machine.status.replace('-', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {machine.type} • {machine.location} • ID: {machine.id}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-xs text-muted-foreground">Health Score</p>
                    <p className={`text-2xl font-bold ${machine.health >= 80 ? 'text-green-500' : machine.health >= 60 ? 'text-yellow-500' : 'text-red-500'}`}>
                      {machine.health}%
                    </p>
                  </div>
                </div>

                {/* Health Bar */}
                <div className="mt-3">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getHealthBarColor(machine.health)} transition-all duration-500`}
                      style={{ width: `${machine.health}%` }}
                    />
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Left Column - Metrics */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-muted-foreground">Current Metrics</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-muted/30 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Operating Hours</p>
                        <p className="text-lg font-bold">{machine.metrics.operatingHours.toLocaleString()}</p>
                      </div>
                      <div className="p-3 bg-muted/30 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Efficiency</p>
                        <p className="text-lg font-bold">{machine.metrics.efficiency}%</p>
                      </div>
                      <div className="p-3 bg-muted/30 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Vibration</p>
                        <p className="text-lg font-bold">{machine.metrics.vibration} <span className="text-xs font-normal">mm/s</span></p>
                      </div>
                      <div className="p-3 bg-muted/30 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Temperature</p>
                        <p className="text-lg font-bold">{machine.metrics.temperature} <span className="text-xs font-normal">°C</span></p>
                      </div>
                    </div>

                    {/* Predictions */}
                    <div className="p-4 bg-muted/30 rounded-lg space-y-2">
                      <h3 className="text-sm font-semibold flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Predictive Analysis
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Failure Risk:</span>
                        <span className={`text-sm font-bold ${getRiskColor(machine.predictedFailureRisk)} uppercase`}>
                          {machine.predictedFailureRisk}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Next Maintenance:</span>
                        <span className="text-sm font-bold flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {machine.nextMaintenance.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Performance Chart */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-muted-foreground">Performance Trend</h3>
                    <div className="h-[200px] bg-muted/30 rounded-lg p-3">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={machine.performanceData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis 
                            dataKey="date" 
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                          />
                          <YAxis 
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px',
                              fontSize: '12px',
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="health"
                            stroke={machine.health >= 80 ? '#22c55e' : machine.health >= 60 ? '#eab308' : '#ef4444'}
                            strokeWidth={2}
                            name="Health %"
                          />
                          <Line
                            type="monotone"
                            dataKey="efficiency"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            name="Efficiency %"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* AI Chatbot */}
      <Chatbot />
    </div>
  );
};

export default MachineryMaintenance;
