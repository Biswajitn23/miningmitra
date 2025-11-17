import { useWeb3, shortenAddress, getNetworkName } from '@/context/Web3Context';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, LogOut, CheckCircle } from 'lucide-react';

export const WalletConnect = () => {
  const { account, chainId, isConnected, connectWallet, disconnectWallet } = useWeb3();

  if (isConnected && account) {
    return (
      <Card className="border-green-500/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">{shortenAddress(account)}</p>
                <p className="text-xs text-muted-foreground">
                  {chainId ? getNetworkName(chainId) : 'Unknown Network'}
                </p>
              </div>
            </div>
            <Button onClick={disconnectWallet} variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Disconnect
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Button onClick={connectWallet} className="w-full" size="lg">
      <Wallet className="h-5 w-5 mr-2" />
      Connect Wallet
    </Button>
  );
};

export const WalletButton = () => {
  const { account, isConnected, connectWallet } = useWeb3();

  if (isConnected && account) {
    return (
      <Badge variant="outline" className="gap-2 px-3 py-1.5">
        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
        {shortenAddress(account)}
      </Badge>
    );
  }

  return (
    <Button onClick={connectWallet} variant="outline" size="sm">
      <Wallet className="h-4 w-4 mr-2" />
      Connect
    </Button>
  );
};
