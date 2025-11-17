import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { useCorridors } from '@/context/CorridorContext';
import { toast } from 'sonner';
import { Settings, RefreshCw, Database, Wallet } from 'lucide-react';
import { useWeb3 } from '@/context/Web3Context';
import { CorridorContract } from '@/lib/contracts';

const AdminPanel = () => {
  const { updateMetrics, generateNewScore, corridors } = useCorridors();
  const { isConnected, connectWallet, signer, chainId } = useWeb3();
  const [pollution, setPollution] = useState(45);
  const [traffic, setTraffic] = useState(42);
  const [greenCover, setGreenCover] = useState(68);
  const [temperature, setTemperature] = useState(32);
  const [blockchainLoading, setBlockchainLoading] = useState(false);

  const handleUpdateMetrics = () => {
    updateMetrics(pollution, traffic, greenCover, temperature);
    toast.success('Metrics updated successfully!');
  };

  const handleGenerateScore = () => {
    generateNewScore();
    toast.success('Scores regenerated for all corridors!');
  };

  const handleUpdateBlockchain = async () => {
    if (!isConnected || !signer || !chainId) {
      toast.error('Please connect your wallet first');
      await connectWallet();
      return;
    }

    setBlockchainLoading(true);

    try {
      const contract = new CorridorContract(signer, chainId);
      
      // Push all corridor data to blockchain
      let successCount = 0;
      for (const corridor of corridors) {
        try {
          await contract.addCorridorData(
            corridor.id,
            corridor.score,
            corridor.pollution,
            corridor.greenCover
          );
          successCount++;
        } catch (error) {
          console.error(`Failed to update ${corridor.name}:`, error);
        }
      }

      toast.success(`Blockchain updated!`, {
        description: `${successCount} corridors synced to blockchain`,
      });
    } catch (error: any) {
      console.error('Blockchain update error:', error);
      
      // Fallback for demo
      if (error.message?.includes('not deployed')) {
        toast.warning('Demo mode - contract not deployed', {
          description: 'Simulating blockchain update',
        });
      } else {
        toast.error('Failed to update blockchain: ' + error.message);
      }
    } finally {
      setBlockchainLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <Button variant="ghost" onClick={() => window.history.back()}>
            ← Back to Dashboard
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings className="h-8 w-8" />
            <div>
              <h1 className="text-4xl font-bold">Admin Control Panel</h1>
              <p className="text-muted-foreground">Internal controls for live demo</p>
            </div>
          </div>
          {!isConnected && (
            <Button onClick={connectWallet} variant="outline">
              <Wallet className="h-4 w-4 mr-2" />
              Connect Wallet
            </Button>
          )}
        </div>

        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle>🔒 Internal Use Only</CardTitle>
            <CardDescription>
              This panel is for backstage demo control. Use these controls to drive the live demonstration.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Metric Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Environmental Metrics</CardTitle>
            <CardDescription>
              Adjust these sliders to change metrics across all corridors
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Pollution */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Pollution Index (AQI)</label>
                <span className="text-sm font-bold">{pollution}</span>
              </div>
              <Slider
                value={[pollution]}
                onValueChange={(value) => setPollution(value[0])}
                max={100}
                step={1}
                className="cursor-pointer"
              />
            </div>

            {/* Traffic */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Road Load / Traffic (% Capacity)</label>
                <span className="text-sm font-bold">{traffic}%</span>
              </div>
              <Slider
                value={[traffic]}
                onValueChange={(value) => setTraffic(value[0])}
                max={100}
                step={1}
                className="cursor-pointer"
              />
            </div>

            {/* Green Cover */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Green Cover / NDVI (%)</label>
                <span className="text-sm font-bold">{greenCover}%</span>
              </div>
              <Slider
                value={[greenCover]}
                onValueChange={(value) => setGreenCover(value[0])}
                max={100}
                step={1}
                className="cursor-pointer"
              />
            </div>

            {/* Temperature */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Temperature (°C)</label>
                <span className="text-sm font-bold">{temperature}°C</span>
              </div>
              <Slider
                value={[temperature]}
                onValueChange={(value) => setTemperature(value[0])}
                min={20}
                max={45}
                step={1}
                className="cursor-pointer"
              />
            </div>

            <Button onClick={handleUpdateMetrics} className="w-full" size="lg">
              <RefreshCw className="h-4 w-4 mr-2" />
              Update Metrics
            </Button>
          </CardContent>
        </Card>

        {/* Action Controls */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Generate New Score</CardTitle>
              <CardDescription>
                Recalculate DEES scores based on current metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleGenerateScore} className="w-full" variant="outline">
                Generate Score
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Update Blockchain</CardTitle>
              <CardDescription>
                Push current corridor data to Ethereum blockchain
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleUpdateBlockchain} 
                className="w-full" 
                variant="outline"
                disabled={blockchainLoading || !isConnected}
              >
                <Database className="h-4 w-4 mr-2" />
                {blockchainLoading ? 'Updating...' : 'Update Blockchain'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
