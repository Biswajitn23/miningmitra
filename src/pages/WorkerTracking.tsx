import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Chatbot } from '@/components/Chatbot';
import { ArrowLeft, Heart, Activity, MapPin, AlertTriangle, ThermometerSun, Wifi } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface Worker {
  id: string;
  name: string;
  role: string;
  location: {
    lat: number;
    lng: number;
    zone: string;
  };
  health: {
    heartRate: number;
    temperature: number;
    oxygenLevel: number;
    fatigueLevel: 'low' | 'medium' | 'high';
  };
  status: 'active' | 'resting' | 'alert';
  lastUpdate: Date;
}

const WorkerTracking = () => {
  const navigate = useNavigate();
  const [workers] = useState<Worker[]>([
    {
      id: 'W001',
      name: 'Rajesh Kumar',
      role: 'Drill Operator',
      location: { lat: 23.2156, lng: 72.6369, zone: 'Zone A - Excavation Site' },
      health: {
        heartRate: 82,
        temperature: 37.1,
        oxygenLevel: 98,
        fatigueLevel: 'low',
      },
      status: 'active',
      lastUpdate: new Date(),
    },
    {
      id: 'W002',
      name: 'Amit Patel',
      role: 'Heavy Equipment Operator',
      location: { lat: 23.2189, lng: 72.6401, zone: 'Zone B - Loading Area' },
      health: {
        heartRate: 95,
        temperature: 37.8,
        oxygenLevel: 96,
        fatigueLevel: 'medium',
      },
      status: 'active',
      lastUpdate: new Date(),
    },
    {
      id: 'W003',
      name: 'Suresh Singh',
      role: 'Safety Inspector',
      location: { lat: 23.2145, lng: 72.6355, zone: 'Zone C - Processing Unit' },
      health: {
        heartRate: 112,
        temperature: 38.2,
        oxygenLevel: 94,
        fatigueLevel: 'high',
      },
      status: 'alert',
      lastUpdate: new Date(),
    },
    {
      id: 'W004',
      name: 'Vikram Sharma',
      role: 'Blasting Technician',
      location: { lat: 23.2178, lng: 72.6388, zone: 'Zone A - Excavation Site' },
      health: {
        heartRate: 78,
        temperature: 36.9,
        oxygenLevel: 99,
        fatigueLevel: 'low',
      },
      status: 'resting',
      lastUpdate: new Date(),
    },
    {
      id: 'W005',
      name: 'Pradeep Reddy',
      role: 'Haul Truck Driver',
      location: { lat: 23.2167, lng: 72.6375, zone: 'Zone D - Transport Corridor' },
      health: {
        heartRate: 88,
        temperature: 37.3,
        oxygenLevel: 97,
        fatigueLevel: 'low',
      },
      status: 'active',
      lastUpdate: new Date(),
    },
  ]);

  const getStatusColor = (status: Worker['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-500 text-white';
      case 'resting':
        return 'bg-yellow-500 text-black';
      case 'alert':
        return 'bg-red-500 text-white';
    }
  };

  const getFatigueColor = (level: Worker['health']['fatigueLevel']) => {
    switch (level) {
      case 'low':
        return 'text-green-500';
      case 'medium':
        return 'text-yellow-500';
      case 'high':
        return 'text-red-500';
    }
  };

  const getHealthStatus = (worker: Worker) => {
    if (worker.health.heartRate > 100 || worker.health.temperature > 38 || worker.health.oxygenLevel < 95) {
      return { status: 'Critical', color: 'text-red-500' };
    }
    if (worker.health.heartRate > 90 || worker.health.temperature > 37.5 || worker.health.oxygenLevel < 97) {
      return { status: 'Warning', color: 'text-yellow-500' };
    }
    return { status: 'Normal', color: 'text-green-500' };
  };

  const activeWorkers = workers.filter(w => w.status === 'active').length;
  const alertWorkers = workers.filter(w => w.status === 'alert').length;
  const avgHeartRate = Math.round(workers.reduce((sum, w) => sum + w.health.heartRate, 0) / workers.length);

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
              Worker Health & Location Tracking
            </h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">
              Real-time monitoring of worker safety and location
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <Card className="bg-card/50 backdrop-blur-xl border-border/50">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground mb-1">Total Workers</p>
                  <p className="text-2xl md:text-3xl font-bold">{workers.length}</p>
                </div>
                <div className="p-3 rounded-xl bg-blue-500/20">
                  <Activity className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-xl border-border/50">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground mb-1">Active</p>
                  <p className="text-2xl md:text-3xl font-bold text-green-500">{activeWorkers}</p>
                </div>
                <div className="p-3 rounded-xl bg-green-500/20">
                  <Wifi className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-xl border-border/50">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground mb-1">Alerts</p>
                  <p className="text-2xl md:text-3xl font-bold text-red-500">{alertWorkers}</p>
                </div>
                <div className="p-3 rounded-xl bg-red-500/20">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-xl border-border/50">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground mb-1">Avg Heart Rate</p>
                  <p className="text-2xl md:text-3xl font-bold">{avgHeartRate}</p>
                </div>
                <div className="p-3 rounded-xl bg-red-500/20">
                  <Heart className="h-6 w-6 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Workers List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {workers.map((worker) => {
            const healthStatus = getHealthStatus(worker);
            return (
              <Card
                key={worker.id}
                className="bg-card/50 backdrop-blur-xl border-border/50 hover:shadow-2xl transition-all duration-300"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {worker.name}
                        <Badge className={`${getStatusColor(worker.status)} text-xs`}>
                          {worker.status.toUpperCase()}
                        </Badge>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {worker.role} • ID: {worker.id}
                      </p>
                    </div>
                    <div className={`text-right ${healthStatus.color}`}>
                      <p className="text-xs font-semibold">Health Status</p>
                      <p className="text-sm font-bold">{healthStatus.status}</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Location */}
                  <div className="flex items-start gap-2 p-3 bg-muted/30 rounded-lg">
                    <MapPin className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{worker.location.zone}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {worker.location.lat.toFixed(4)}, {worker.location.lng.toFixed(4)}
                      </p>
                    </div>
                  </div>

                  {/* Health Metrics */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Heart className="h-4 w-4 text-red-500" />
                        <p className="text-xs text-muted-foreground">Heart Rate</p>
                      </div>
                      <p className="text-lg font-bold">{worker.health.heartRate} <span className="text-xs font-normal">bpm</span></p>
                    </div>

                    <div className="p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <ThermometerSun className="h-4 w-4 text-orange-500" />
                        <p className="text-xs text-muted-foreground">Temperature</p>
                      </div>
                      <p className="text-lg font-bold">{worker.health.temperature} <span className="text-xs font-normal">°C</span></p>
                    </div>

                    <div className="p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Activity className="h-4 w-4 text-blue-500" />
                        <p className="text-xs text-muted-foreground">Oxygen Level</p>
                      </div>
                      <p className="text-lg font-bold">{worker.health.oxygenLevel} <span className="text-xs font-normal">%</span></p>
                    </div>

                    <div className="p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className={`h-4 w-4 ${getFatigueColor(worker.health.fatigueLevel)}`} />
                        <p className="text-xs text-muted-foreground">Fatigue Level</p>
                      </div>
                      <p className={`text-lg font-bold ${getFatigueColor(worker.health.fatigueLevel)} capitalize`}>
                        {worker.health.fatigueLevel}
                      </p>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground text-right">
                    Last updated: {worker.lastUpdate.toLocaleTimeString()}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* AI Chatbot */}
      <Chatbot />
    </div>
  );
};

export default WorkerTracking;
