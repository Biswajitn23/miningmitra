import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Chatbot } from '@/components/Chatbot';
import { ArrowLeft, AlertTriangle, MapPin, Clock, Flame, Users, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface Incident {
  id: string;
  type: 'equipment-failure' | 'worker-injury' | 'environmental' | 'safety-violation' | 'fire' | 'structural';
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: {
    lat: number;
    lng: number;
    zone: string;
  };
  title: string;
  description: string;
  timestamp: Date;
  status: 'active' | 'investigating' | 'resolved';
  affectedWorkers?: number;
}

const IncidentHeatmap = () => {
  const navigate = useNavigate();
  const [incidents] = useState<Incident[]>([
    {
      id: 'INC001',
      type: 'equipment-failure',
      severity: 'critical',
      location: { lat: 23.2145, lng: 72.6355, zone: 'Zone A - Excavation Site' },
      title: 'Hydraulic System Failure',
      description: 'Critical hydraulic system malfunction on excavator unit M003',
      timestamp: new Date('2025-11-17T10:30:00'),
      status: 'investigating',
      affectedWorkers: 3,
    },
    {
      id: 'INC002',
      type: 'worker-injury',
      severity: 'high',
      location: { lat: 23.2156, lng: 72.6369, zone: 'Zone B - Loading Area' },
      title: 'Worker Heat Exhaustion',
      description: 'Worker ID W003 showing signs of severe heat exhaustion',
      timestamp: new Date('2025-11-17T11:15:00'),
      status: 'active',
      affectedWorkers: 1,
    },
    {
      id: 'INC003',
      type: 'environmental',
      severity: 'medium',
      location: { lat: 23.2178, lng: 72.6388, zone: 'Zone C - Processing Unit' },
      title: 'Dust Level Exceeded',
      description: 'Air quality monitoring detected elevated dust particles above safety threshold',
      timestamp: new Date('2025-11-17T09:45:00'),
      status: 'resolved',
      affectedWorkers: 8,
    },
    {
      id: 'INC004',
      type: 'safety-violation',
      severity: 'medium',
      location: { lat: 23.2189, lng: 72.6401, zone: 'Zone D - Transport Corridor' },
      title: 'PPE Non-Compliance',
      description: 'Multiple workers detected without proper personal protective equipment',
      timestamp: new Date('2025-11-17T08:20:00'),
      status: 'resolved',
      affectedWorkers: 4,
    },
    {
      id: 'INC005',
      type: 'fire',
      severity: 'critical',
      location: { lat: 23.2167, lng: 72.6375, zone: 'Zone B - Loading Area' },
      title: 'Equipment Fire',
      description: 'Small fire detected in haul truck M002 engine compartment',
      timestamp: new Date('2025-11-16T16:30:00'),
      status: 'resolved',
      affectedWorkers: 2,
    },
    {
      id: 'INC006',
      type: 'structural',
      severity: 'high',
      location: { lat: 23.2134, lng: 72.6342, zone: 'Zone A - Excavation Site' },
      title: 'Slope Instability Warning',
      description: 'Sensors detected movement in excavation slope indicating potential collapse risk',
      timestamp: new Date('2025-11-16T14:10:00'),
      status: 'investigating',
      affectedWorkers: 6,
    },
    {
      id: 'INC007',
      type: 'environmental',
      severity: 'low',
      location: { lat: 23.2198, lng: 72.6412, zone: 'Zone C - Processing Unit' },
      title: 'Minor Chemical Spill',
      description: 'Small hydraulic fluid leak contained and cleaned up',
      timestamp: new Date('2025-11-16T11:00:00'),
      status: 'resolved',
    },
  ]);

  const getSeverityColor = (severity: Incident['severity']) => {
    switch (severity) {
      case 'low':
        return 'bg-green-500 text-white';
      case 'medium':
        return 'bg-yellow-500 text-black';
      case 'high':
        return 'bg-orange-500 text-white';
      case 'critical':
        return 'bg-red-500 text-white';
    }
  };

  const getStatusColor = (status: Incident['status']) => {
    switch (status) {
      case 'active':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'investigating':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'resolved':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
    }
  };

  const getTypeIcon = (type: Incident['type']) => {
    switch (type) {
      case 'equipment-failure':
        return <AlertTriangle className="h-5 w-5" />;
      case 'worker-injury':
        return <Users className="h-5 w-5" />;
      case 'environmental':
        return <Activity className="h-5 w-5" />;
      case 'safety-violation':
        return <AlertTriangle className="h-5 w-5" />;
      case 'fire':
        return <Flame className="h-5 w-5" />;
      case 'structural':
        return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: Incident['type']) => {
    switch (type) {
      case 'equipment-failure':
        return 'text-orange-500';
      case 'worker-injury':
        return 'text-red-500';
      case 'environmental':
        return 'text-green-500';
      case 'safety-violation':
        return 'text-yellow-500';
      case 'fire':
        return 'text-red-600';
      case 'structural':
        return 'text-purple-500';
    }
  };

  const activeIncidents = incidents.filter(i => i.status === 'active').length;
  const criticalIncidents = incidents.filter(i => i.severity === 'critical').length;
  const resolvedToday = incidents.filter(i => 
    i.status === 'resolved' && 
    i.timestamp.toDateString() === new Date().toDateString()
  ).length;
  const totalAffected = incidents.reduce((sum, i) => sum + (i.affectedWorkers || 0), 0);

  // Heatmap zones with incident counts
  const zones = [
    { name: 'Zone A - Excavation Site', incidents: incidents.filter(i => i.location.zone.includes('Zone A')).length, color: 'bg-red-500' },
    { name: 'Zone B - Loading Area', incidents: incidents.filter(i => i.location.zone.includes('Zone B')).length, color: 'bg-orange-500' },
    { name: 'Zone C - Processing Unit', incidents: incidents.filter(i => i.location.zone.includes('Zone C')).length, color: 'bg-yellow-500' },
    { name: 'Zone D - Transport Corridor', incidents: incidents.filter(i => i.location.zone.includes('Zone D')).length, color: 'bg-green-500' },
  ];

  const maxIncidents = Math.max(...zones.map(z => z.incidents));

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
              Incident Heatmap & Alerts
            </h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">
              Real-time incident tracking and safety zone monitoring
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <Card className="bg-card/50 backdrop-blur-xl border-border/50">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground mb-1">Active Incidents</p>
                  <p className="text-2xl md:text-3xl font-bold text-red-500">{activeIncidents}</p>
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
                  <p className="text-xs md:text-sm text-muted-foreground mb-1">Critical</p>
                  <p className="text-2xl md:text-3xl font-bold text-orange-500">{criticalIncidents}</p>
                </div>
                <div className="p-3 rounded-xl bg-orange-500/20">
                  <Flame className="h-6 w-6 text-orange-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-xl border-border/50">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground mb-1">Resolved Today</p>
                  <p className="text-2xl md:text-3xl font-bold text-green-500">{resolvedToday}</p>
                </div>
                <div className="p-3 rounded-xl bg-green-500/20">
                  <Activity className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-xl border-border/50">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground mb-1">Workers Affected</p>
                  <p className="text-2xl md:text-3xl font-bold">{totalAffected}</p>
                </div>
                <div className="p-3 rounded-xl bg-blue-500/20">
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Zone Heatmap */}
        <Card className="bg-card/50 backdrop-blur-xl border-border/50">
          <CardHeader>
            <CardTitle>Zone Incident Heatmap</CardTitle>
            <p className="text-sm text-muted-foreground">Incident frequency by mining zone</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {zones.map((zone) => {
                const intensity = maxIncidents > 0 ? (zone.incidents / maxIncidents) * 100 : 0;
                const heatColor = 
                  intensity >= 75 ? 'bg-red-500' :
                  intensity >= 50 ? 'bg-orange-500' :
                  intensity >= 25 ? 'bg-yellow-500' :
                  'bg-green-500';
                
                return (
                  <div key={zone.name} className="p-4 bg-muted/30 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{zone.name}</span>
                      <Badge className={`${heatColor} text-white`}>
                        {zone.incidents} incidents
                      </Badge>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${heatColor} transition-all duration-500`}
                        style={{ width: `${intensity}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Incidents List */}
        <div className="space-y-3 md:space-y-4">
          <h2 className="text-xl font-bold">Recent Incidents</h2>
          {incidents.map((incident) => (
            <Card
              key={incident.id}
              className="bg-card/50 backdrop-blur-xl border-border/50 hover:shadow-2xl transition-all duration-300"
            >
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`p-2 rounded-lg bg-muted/30 ${getTypeColor(incident.type)}`}>
                      {getTypeIcon(incident.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <CardTitle className="text-base">{incident.title}</CardTitle>
                        <Badge className={getSeverityColor(incident.severity)}>
                          {incident.severity.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        ID: {incident.id} • {incident.type.replace('-', ' ').toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(incident.status)} border text-xs whitespace-nowrap`}>
                    {incident.status.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <p className="text-sm">{incident.description}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                    <MapPin className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="text-sm font-medium truncate">{incident.location.zone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                    <Clock className="h-4 w-4 text-purple-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">Time</p>
                      <p className="text-sm font-medium">{incident.timestamp.toLocaleTimeString()}</p>
                    </div>
                  </div>

                  {incident.affectedWorkers && (
                    <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                      <Users className="h-4 w-4 text-red-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground">Affected Workers</p>
                        <p className="text-sm font-medium">{incident.affectedWorkers}</p>
                      </div>
                    </div>
                  )}
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

export default IncidentHeatmap;
