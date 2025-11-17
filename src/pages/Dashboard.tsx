import { useCorridors } from '@/context/CorridorContext';
import CorridorMap from '@/components/CorridorMap';
import CorridorCard from '@/components/CorridorCard';
import MetricCard from '@/components/MetricCard';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Wind, Trees, Thermometer, Truck, ShieldCheck, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { corridors, simulateSpike, selectCorridor } = useCorridors();
  const navigate = useNavigate();
  useSmoothScroll();

  const avgMetrics = {
    pollution: Math.round(
      corridors.reduce((sum, c) => sum + c.metrics.pollution, 0) / corridors.length
    ),
    greenCover: Math.round(
      corridors.reduce((sum, c) => sum + c.metrics.greenCover, 0) / corridors.length
    ),
    temperature: Math.round(
      corridors.reduce((sum, c) => sum + c.metrics.temperature, 0) / corridors.length
    ),
    traffic: Math.round(
      corridors.reduce((sum, c) => sum + c.metrics.traffic, 0) / corridors.length
    ),
    compliance: Math.round(
      corridors.reduce((sum, c) => sum + c.metrics.compliance, 0) / corridors.length
    ),
  };

  const handleSimulateSpike = () => {
    simulateSpike();
    toast.error('Safety Alert Triggered!', {
      description: 'Hazard levels increased across all mining zones. Safety scores updated.',
    });
  };

  const handleCorridorClick = (corridorId: string) => {
    selectCorridor(corridorId);
    navigate('/insights');
  };

  return (
    <div className="min-h-screen p-6 md:p-8 lg:p-10 relative">
      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between bg-card/50 backdrop-blur-xl rounded-2xl p-6 border border-border/50 shadow-2xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-200 via-red-400 to-gray-400 bg-clip-text text-transparent drop-shadow-2xl pb-2">Mining Operations Dashboard</h1>
            <p className="text-muted-foreground mt-2 text-base md:text-lg">
              Real-time mining site monitoring and extraction zone insights
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => navigate('/verify')}
              className="border-gray-500/30 hover:border-gray-400 hover:bg-gray-500/10 hover:shadow-[0_0_20px_rgba(156,163,175,0.3)] transition-all duration-300"
            >
              Verify Mining License
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin')}
              className="border-red-500/30 hover:border-red-400 hover:bg-red-500/10 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all duration-300"
            >
              Control Center
            </Button>
            <Button
              size="lg"
              className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white shadow-[0_0_30px_rgba(239,68,68,0.4)] hover:shadow-[0_0_40px_rgba(239,68,68,0.6)] transition-all duration-300 gap-2"
              onClick={handleSimulateSpike}
            >
              <Zap className="h-5 w-5" />
              Simulate Safety Alert
            </Button>
          </div>
        </motion.div>

        {/* Real-time Metrics */}
        <motion.div 
          className="grid grid-cols-5 gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
              }
            }
          }}
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
            }}
          >
          <MetricCard
            title="Air Quality"
            value={avgMetrics.pollution}
            unit="PPM"
            icon={Wind}
            colorClass="text-[hsl(var(--danger))]"
          />
          </motion.div>
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
            }}
          >
          <MetricCard
            title="Vegetation Cover"
            value={avgMetrics.greenCover}
            unit="%"
            icon={Trees}
            colorClass="text-green-500"
          />
          </motion.div>
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
            }}
          >
          <MetricCard
            title="Site Temperature"
            value={avgMetrics.temperature}
            unit="°C"
            icon={Thermometer}
            colorClass="text-[hsl(var(--warning))]"
          />
          </motion.div>
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
            }}
          >
          <MetricCard
            title="Haul Truck Load"
            value={avgMetrics.traffic}
            unit="%"
            icon={Truck}
          />
          </motion.div>
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
            }}
          >
          <MetricCard
            title="Safety Compliance"
            value={avgMetrics.compliance}
            unit="%"
            icon={ShieldCheck}
            colorClass="text-green-500"
          />
          </motion.div>
        </motion.div>

        {/* Map and Corridors */}
        <motion.div 
          className="grid grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.3,
                delayChildren: 0.1
              }
            }
          }}
        >
          {/* Map */}
          <motion.div 
            className="col-span-2"
            variants={{
              hidden: { opacity: 0, x: -40 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } }
            }}
          >
            <div className="h-[600px] rounded-2xl overflow-hidden border border-border/50 shadow-2xl bg-card/30 backdrop-blur-sm">
              <CorridorMap />
            </div>
          </motion.div>

          {/* Mining Site Cards */}
          <motion.div 
            className="space-y-4"
            variants={{
              hidden: { opacity: 0, x: 40 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } }
            }}
          >
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-400 to-red-400 bg-clip-text text-transparent">Active Mining Zones</h2>
            {corridors.map((corridor, index) => (
              <motion.div
                key={corridor.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              >
              <CorridorCard
                corridor={corridor}
                onClick={() => handleCorridorClick(corridor.id)}
              />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
