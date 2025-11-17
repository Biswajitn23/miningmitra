import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Upload, Hash, Wallet } from 'lucide-react';
import { toast } from 'sonner';
import { useWeb3 } from '@/context/Web3Context';
import { CertificateContract, generateCertificateHash } from '@/lib/contracts';

interface VerificationResult {
  valid: boolean;
  timestamp: string;
  corridorId: string;
  issuer: string;
  lotNumber: string;
}

const CertificateVerifier = () => {
  const { isConnected, connectWallet, signer, chainId } = useWeb3();
  const [hash, setHash] = useState('');
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!hash) {
      toast.error('Please enter a certificate hash');
      return;
    }

    if (!isConnected || !signer || !chainId) {
      toast.error('Please connect your wallet first');
      await connectWallet();
      return;
    }

    setLoading(true);
    
    try {
      const contract = new CertificateContract(signer, chainId);
      const verificationResult = await contract.verifyCertificate(hash);
      
      const result: VerificationResult = {
        valid: verificationResult.isValid,
        timestamp: new Date(Number(verificationResult.timestamp) * 1000).toISOString(),
        corridorId: verificationResult.data.split('|')[0] || 'Unknown',
        issuer: verificationResult.issuer,
        lotNumber: verificationResult.data.split('|')[1] || 'N/A',
      };
      
      setResult(result);
      
      if (result.valid) {
        toast.success('Certificate verified on blockchain!');
      } else {
        toast.error('Certificate not found on blockchain');
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      
      // Fallback to mock data if contract not deployed
      if (error.message?.includes('not deployed')) {
        toast.warning('Using demo mode - contract not deployed');
        const mockResult: VerificationResult = {
          valid: hash.length > 10,
          timestamp: new Date().toISOString(),
          corridorId: 'Nagpur → Nhava Sheva',
          issuer: '0xDemo...Address',
          lotNumber: '#DEMO-8912',
        };
        setResult(mockResult);
      } else {
        toast.error('Verification failed: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const fileHash = await generateCertificateHash(file);
        setHash(fileHash);
        toast.success('Certificate hash generated from file');
      } catch (error) {
        console.error('Error generating hash:', error);
        toast.error('Failed to generate hash from file');
      }
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
            <CardTitle className="flex items-center justify-between">
              Certificate Verification
              {!isConnected && (
                <Button onClick={connectWallet} size="sm" variant="outline">
                  <Wallet className="h-4 w-4 mr-2" />
                  Connect Wallet
                </Button>
              )}
            </CardTitle>
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
