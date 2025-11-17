import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Upload, Hash, Wallet, Download, FileText } from 'lucide-react';
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

  const downloadDemoCertificate = () => {
    // Create demo certificate content
    const certificateContent = `
╔════════════════════════════════════════════════════════════════╗
║                    EXPORT CERTIFICATE                          ║
║                  GOVERNMENT OF INDIA                           ║
║              MINISTRY OF COMMERCE & INDUSTRY                   ║
╚════════════════════════════════════════════════════════════════╝

Certificate Number: DEMO-CERT-2025-001
Issue Date: ${new Date().toLocaleDateString('en-IN')}
Valid Until: ${new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EXPORTER DETAILS:
Name: MiningMitra Export Corporation
Address: 123 Industrial Area, Nagpur, Maharashtra 440001
IEC Code: 0123456789
GSTIN: 27AABCU9603R1ZX

PRODUCT DETAILS:
Description: Iron Ore Concentrate
HS Code: 2601.12.00
Quantity: 5000 Metric Tons
Value: ₹50,00,00,000 (INR Fifty Crores Only)

CORRIDOR INFORMATION:
Route: Nagpur → Nhava Sheva Port
Transport Mode: Rail + Road
Distance: 835 KM
Environmental Score: 78/100
Compliance Status: ✓ Verified

BLOCKCHAIN VERIFICATION:
Hash: 0x1234567890abcdef1234567890abcdef12345678
Block Number: 15234567
Timestamp: ${new Date().toISOString()}
Issuer: 0xDemo1234567890123456789012345678901234
Network: Polygon Mumbai Testnet

SAFETY & ENVIRONMENTAL COMPLIANCE:
✓ Air Quality Standards Met
✓ Dust Emission Controls Active
✓ Worker Safety Protocols Followed
✓ Proper Ventilation Systems
✓ Emergency Response Plans in Place
✓ Regular Health Monitoring Done

CERTIFYING AUTHORITY:
Authorized Signatory: Mining Safety Inspector
Department: Directorate General of Mines Safety
Signature: [Digital Signature Applied]
Seal: [Official Seal]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This certificate is issued under the authority of the Ministry of 
Commerce & Industry, Government of India, and is valid for the 
export of the mentioned goods subject to compliance with all 
applicable regulations and standards.

For verification, visit: https://miningmitra.vercel.app/verify
Or scan the QR code below with the certificate hash.

⚠ IMPORTANT: This is a DEMO certificate for testing purposes only.
             Do not use for actual export transactions.

Generated by MiningMitra Platform
Powered by Blockchain Technology
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

    // Create blob and download
    const blob = new Blob([certificateContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Demo_Export_Certificate_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Demo certificate downloaded! Upload it to verify.');
    
    // Auto-fill the hash for demo
    setTimeout(() => {
      setHash('0x1234567890abcdef1234567890abcdef12345678');
    }, 500);
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

        {/* Demo Certificate Card */}
        <Card className="border-dashed border-2 bg-gradient-to-br from-red-950/20 to-background">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-500/10 rounded-lg">
                <FileText className="h-8 w-8 text-red-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">Try with Demo Certificate</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Download a sample export certificate to test the verification system. 
                  The certificate includes all required details and a blockchain hash.
                </p>
                <Button onClick={downloadDemoCertificate} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download Demo Certificate
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

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
