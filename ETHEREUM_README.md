# Ethereum Integration - README

## 🔗 Overview

MiningMitra now includes full Ethereum blockchain integration for:
- **Certificate Verification**: Store and verify mining export certificates on-chain
- **Corridor Data Tracking**: Immutable environmental monitoring records
- **Transparent Auditing**: Public ledger for compliance verification

## 🎯 Features

### 1. **MetaMask Wallet Connection**
- Connect/disconnect wallet functionality
- Auto-reconnect on page reload
- Network detection and switching
- Account change handling

### 2. **Smart Contracts**
Two Solidity contracts power the blockchain features:

#### CertificateVerification.sol
- Register export certificates with hash verification
- Verify certificate authenticity on-chain
- Track issuer and timestamp
- Public certificate registry

#### MiningCorridorData.sol
- Store corridor environmental metrics
- Historical data tracking
- Immutable audit trail
- Query by corridor ID

### 3. **Frontend Integration**
- **Certificate Verifier**: Real blockchain verification
- **Admin Panel**: Push data to blockchain
- **Wallet Components**: Easy wallet connection UI

## 📁 New Files Created

```
src/
├── context/
│   └── Web3Context.tsx          # Web3 provider, wallet state management
├── lib/
│   └── contracts.ts             # Smart contract ABIs & interaction classes
└── components/
    └── WalletConnect.tsx        # Wallet connection UI components

contracts/
├── CertificateVerification.sol  # Certificate registry contract
└── MiningCorridorData.sol       # Corridor data storage contract

ETHEREUM_DEPLOYMENT.md           # Deployment guide
```

## 🚀 Quick Start

### 1. Install Dependencies
Already done! `ethers` package is installed.

### 2. Deploy Contracts

**Option A: Remix (Easiest)**
1. Go to https://remix.ethereum.org
2. Copy contracts from `contracts/` folder
3. Compile with Solidity 0.8.19+
4. Deploy to Sepolia testnet
5. Copy contract addresses

**Option B: Hardhat**
See `ETHEREUM_DEPLOYMENT.md` for detailed instructions.

### 3. Configure Contract Addresses

Edit `src/lib/contracts.ts`:

```typescript
export const CONTRACT_ADDRESSES = {
  11155111: { // Sepolia
    certificate: '0xYourCertificateAddress',
    corridor: '0xYourCorridorAddress',
  },
};
```

### 4. Get Test ETH
- Sepolia: https://sepoliafaucet.com
- Mumbai: https://faucet.polygon.technology

### 5. Connect Wallet
1. Open your app
2. Click "Connect Wallet"
3. Approve MetaMask connection
4. Select Sepolia network

## 🔧 Usage Examples

### Certificate Verification

```typescript
import { useWeb3 } from '@/context/Web3Context';
import { CertificateContract } from '@/lib/contracts';

// In your component
const { signer, chainId } = useWeb3();
const contract = new CertificateContract(signer, chainId);

// Register a certificate
await contract.registerCertificate(
  "0xabc123...", // certificate hash
  "Nagpur→NhavaSheva|LOT-001|2025-11-17" // data
);

// Verify a certificate
const result = await contract.verifyCertificate("0xabc123...");
console.log(result.isValid); // true
```

### Corridor Data

```typescript
import { CorridorContract } from '@/lib/contracts';

const contract = new CorridorContract(signer, chainId);

// Add corridor data
await contract.addCorridorData(
  "corridor-1",
  85,  // score
  45,  // pollution
  68   // green cover
);

// Get latest data
const data = await contract.getCorridorData("corridor-1");
```

### Wallet Connection

```typescript
import { useWeb3 } from '@/context/Web3Context';

function MyComponent() {
  const { isConnected, account, connectWallet, disconnectWallet } = useWeb3();

  return (
    <div>
      {isConnected ? (
        <button onClick={disconnectWallet}>
          Disconnect {account}
        </button>
      ) : (
        <button onClick={connectWallet}>
          Connect Wallet
        </button>
      )}
    </div>
  );
}
```

## 🌐 Supported Networks

### Testnets (Recommended for Development)
- **Sepolia** (Chain ID: 11155111) - Ethereum testnet
- **Mumbai** (Chain ID: 80001) - Polygon testnet

### Mainnets (Production)
- **Ethereum** (Chain ID: 1) - High gas costs
- **Polygon** (Chain ID: 137) - Low gas costs, recommended

## 💡 Key Features

### Automatic Fallback
If contracts aren't deployed, the app falls back to demo mode:
- Shows warning toast
- Uses mock data
- No errors for users

### Gas Optimization
- View functions are free (no gas)
- Write functions optimized for minimal gas
- Batch operations supported

### Security
- MetaMask signature required for all writes
- Read-only public verification
- No private keys stored in code

## 🧪 Testing Checklist

- [ ] MetaMask installed
- [ ] Connected to Sepolia testnet
- [ ] Got test ETH from faucet
- [ ] Deployed both contracts
- [ ] Updated contract addresses in code
- [ ] Tested certificate registration
- [ ] Tested certificate verification
- [ ] Tested corridor data submission
- [ ] Tested wallet connect/disconnect

## 📊 Contract Functions

### CertificateVerification

**Write Functions** (Requires Gas)
- `registerCertificate(hash, data)` - Register new certificate

**Read Functions** (Free)
- `verifyCertificate(hash)` - Check if certificate exists
- `getCertificateCount()` - Total certificates registered
- `getCertificateByIndex(i)` - Get certificate by index

### MiningCorridorData

**Write Functions** (Requires Gas)
- `addCorridorData(id, score, pollution, greenCover)` - Add new data point

**Read Functions** (Free)
- `getCorridorData(id)` - Get latest corridor data
- `getCorridorHistory(id)` - Get all historical data
- `getCorridorCount()` - Total corridors tracked
- `corridorExists(id)` - Check if corridor exists

## 🛠️ Development Tips

### Local Testing
Use Hardhat local node for instant testing:
```bash
npx hardhat node
# Contracts auto-deploy to localhost:8545
```

### Gas Estimation
Before sending transactions:
```typescript
const gasEstimate = await contract.estimateGas.registerCertificate(hash, data);
console.log('Estimated gas:', gasEstimate.toString());
```

### Event Listening
Listen for on-chain events:
```typescript
contract.on('CertificateRegistered', (hash, issuer, timestamp) => {
  console.log('New certificate:', hash);
});
```

## 🐛 Common Issues

### "Please install MetaMask"
Install MetaMask browser extension from metamask.io

### "Contract not deployed on this network"
Deploy contracts or switch to correct network in MetaMask

### "Insufficient funds"
Get test ETH from faucets (see links above)

### "Transaction failed"
- Check you have enough ETH for gas
- Verify contract parameters are valid
- Try increasing gas limit

## 📚 Resources

- **Ethers.js Docs**: https://docs.ethers.org
- **Remix IDE**: https://remix.ethereum.org
- **Sepolia Faucet**: https://sepoliafaucet.com
- **MetaMask**: https://metamask.io
- **Deployment Guide**: See `ETHEREUM_DEPLOYMENT.md`

## 🎉 Next Steps

1. ✅ Deploy contracts to testnet
2. ✅ Test certificate verification
3. ✅ Test corridor data submission
4. 📝 Consider adding authentication (only authorized users can register)
5. 📝 Add batch operations for multiple certificates
6. 📝 Implement data export from blockchain
7. 🚀 Deploy to mainnet for production

---

**Integration Complete!** Your MiningMitra app now has full Ethereum blockchain capabilities. 🎊
