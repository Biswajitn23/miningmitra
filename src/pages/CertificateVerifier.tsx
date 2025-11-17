import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Upload, Hash } from 'lucide-react';
import { toast } from 'sonner';

interface VerificationResult {
  valid: boolean;
  timestamp: string;
  corridorId: string;
  issuer: string;
  lotNumber: string;
}

const CertificateVerifier = () => {
  const [hash, setHash] = useState('');
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = () => {
    if (!hash) {
      toast.error('Please enter a certificate hash');
      return;
    }

    setLoading(true);
    
    // Simulate blockchain verification
    setTimeout(() => {
      const mockResult: VerificationResult = {
        valid: hash.length > 10,
        timestamp: new Date().toISOString(),
        corridorId: 'Nagpur → Nhava Sheva',
        issuer: 'Ministry of Commerce',
        lotNumber: '#8912',
      };
      
      setResult(mockResult);
      setLoading(false);
      
      if (mockResult.valid) {
        toast.success('Certificate verified successfully!');
      } else {
        toast.error('Invalid certificate hash');
      }
    }, 1500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulate reading file and extracting hash
      const reader = new FileReader();
      reader.onload = () => {
        const mockHash = `0x${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
        setHash(mockHash);
        toast.success('Certificate hash extracted');
      };
      reader.readAsText(file);
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

        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Export Certificate Verifier</h1>
          <p className="text-muted-foreground">
            Verify export certificates on the blockchain
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Certificate Verification</CardTitle>
            <CardDescription>
              Upload a certificate or enter its blockchain hash to verify authenticity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Upload Section */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Upload Certificate</label>
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    type="file"
                    accept=".pdf,.txt,.json"
                    onChange={handleFileUpload}
                    className="cursor-pointer"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            {/* Hash Input */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Enter Certificate Hash</label>
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Hash className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="0x..."
                    value={hash}
                    onChange={(e) => setHash(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button onClick={handleVerify} disabled={loading}>
                  {loading ? 'Verifying...' : 'Verify on Blockchain'}
                </Button>
              </div>
            </div>

            {/* Verification Result */}
            {result && (
              <Card className={result.valid ? 'border-[hsl(var(--success))]' : 'border-[hsl(var(--danger))]'}>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      {result.valid ? (
                        <CheckCircle className="h-12 w-12 text-[hsl(var(--success))]" />
                      ) : (
                        <XCircle className="h-12 w-12 text-[hsl(var(--danger))]" />
                      )}
                      <div>
                        <h3 className="text-xl font-bold">
                          {result.valid ? 'Certificate Valid' : 'Certificate Invalid'}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {result.valid
                            ? 'This certificate has been verified on the blockchain'
                            : 'This certificate could not be verified'}
                        </p>
                      </div>
                    </div>

                    {result.valid && (
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                        <div>
                          <p className="text-sm text-muted-foreground">Timestamp</p>
                          <p className="font-medium">{new Date(result.timestamp).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Corridor</p>
                          <p className="font-medium">{result.corridorId}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Issuer</p>
                          <p className="font-medium">{result.issuer}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Lot Number</p>
                          <Badge variant="outline">{result.lotNumber}</Badge>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CertificateVerifier;
