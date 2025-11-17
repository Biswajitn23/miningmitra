# Ethereum Smart Contract Deployment Guide

This guide explains how to deploy the MiningMitra smart contracts to Ethereum.

## 📋 Prerequisites

- MetaMask wallet installed
- Test ETH (for testnets) or real ETH (for mainnet)
- Node.js and npm installed

## 🚀 Quick Deploy with Remix

### Option 1: Remix IDE (Easiest for Beginners)

1. **Open Remix**: Go to https://remix.ethereum.org

2. **Create Contract Files**:
   - Create `CertificateVerification.sol` in the contracts folder
   - Copy the contract code from `contracts/CertificateVerification.sol`
   - Create `MiningCorridorData.sol`
   - Copy the contract code from `contracts/MiningCorridorData.sol`

3. **Compile Contracts**:
   - Click on "Solidity Compiler" tab (left sidebar)
   - Select compiler version `0.8.19` or higher
   - Click "Compile CertificateVerification.sol"
   - Click "Compile MiningCorridorData.sol"
   - Verify both compile successfully (green checkmark)

4. **Deploy to Testnet**:
   - Click "Deploy & Run Transactions" tab
   - Environment: Select "Injected Provider - MetaMask"
   - MetaMask will popup - connect your wallet
   - Select network in MetaMask (Sepolia recommended)
   - Deploy CertificateVerification:
     - Select contract in dropdown
     - Click "Deploy"
     - Confirm transaction in MetaMask
     - Wait for confirmation (~15 seconds)
     - Copy deployed contract address
   - Deploy MiningCorridorData:
     - Select contract in dropdown
     - Click "Deploy"
     - Confirm transaction in MetaMask
     - Copy deployed contract address

5. **Update Frontend**:
   - Open `src/lib/contracts.ts`
   - Find `CONTRACT_ADDRESSES` object
   - Add your addresses under the appropriate chainId:
   ```typescript
   11155111: { // Sepolia
     certificate: '0xYourCertificateContractAddress',
     corridor: '0xYourCorridorContractAddress',
   }
   ```

## 🔧 Option 2: Deploy with Hardhat (Advanced)

### Setup Hardhat Project

```bash
# Install Hardhat
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

# Initialize Hardhat
npx hardhat init
# Select: Create a TypeScript project
```

### Configure Hardhat

Create `hardhat.config.ts`:

```typescript
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/YOUR_INFURA_KEY`,
      accounts: ['YOUR_PRIVATE_KEY'] // NEVER commit this!
    },
    mumbai: {
      url: `https://rpc-mumbai.maticvigil.com`,
      accounts: ['YOUR_PRIVATE_KEY']
    }
  },
  etherscan: {
    apiKey: "YOUR_ETHERSCAN_API_KEY"
  }
};

export default config;
```

### Create Deployment Script

Create `scripts/deploy.ts`:

```typescript
import { ethers } from "hardhat";

async function main() {
  console.log("Deploying contracts...");

  // Deploy CertificateVerification
  const CertificateVerification = await ethers.getContractFactory("CertificateVerification");
  const certificate = await CertificateVerification.deploy();
  await certificate.waitForDeployment();
  const certAddress = await certificate.getAddress();
  console.log("CertificateVerification deployed to:", certAddress);

  // Deploy MiningCorridorData
  const MiningCorridorData = await ethers.getContractFactory("MiningCorridorData");
  const corridor = await MiningCorridorData.deploy();
  await corridor.waitForDeployment();
  const corridorAddress = await corridor.getAddress();
  console.log("MiningCorridorData deployed to:", corridorAddress);

  console.log("\nUpdate these addresses in src/lib/contracts.ts:");
  console.log(`certificate: '${certAddress}',`);
  console.log(`corridor: '${corridorAddress}',`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

### Deploy

```bash
# Copy contract files to contracts/
cp contracts/*.sol node_modules/hardhat/contracts/

# Deploy to Sepolia testnet
npx hardhat run scripts/deploy.ts --network sepolia

# Deploy to Mumbai (Polygon testnet)
npx hardhat run scripts/deploy.ts --network mumbai
```

### Verify on Etherscan

```bash
npx hardhat verify --network sepolia YOUR_CONTRACT_ADDRESS
```

## 🌐 Recommended Networks

### Testnets (Free - Best for Testing)

#### Sepolia (Ethereum Testnet)
- **Chain ID**: 11155111
- **RPC**: https://sepolia.infura.io/v3/YOUR_KEY
- **Faucet**: https://sepoliafaucet.com
- **Explorer**: https://sepolia.etherscan.io

#### Mumbai (Polygon Testnet)
- **Chain ID**: 80001
- **RPC**: https://rpc-mumbai.maticvigil.com
- **Faucet**: https://faucet.polygon.technology
- **Explorer**: https://mumbai.polygonscan.com

### Mainnet (Production - Costs Real Money)

#### Ethereum Mainnet
- **Chain ID**: 1
- **Gas Costs**: High ($50-200 per deployment)
- **Explorer**: https://etherscan.io

#### Polygon Mainnet
- **Chain ID**: 137
- **Gas Costs**: Low ($0.01-0.50 per deployment)
- **Explorer**: https://polygonscan.com
- **Recommended for production**

## 💰 Getting Test ETH

### Sepolia Faucet
1. Go to https://sepoliafaucet.com
2. Enter your wallet address
3. Complete CAPTCHA
4. Wait for ETH (usually instant)

### Mumbai Faucet
1. Go to https://faucet.polygon.technology
2. Select Mumbai Network
3. Enter your wallet address
4. Get 0.2 MATIC

## 🧪 Testing Your Contracts

### Test Certificate Registration

In your browser console:

```javascript
// Connect wallet first
await connectWallet();

// Register a certificate
const contract = new CertificateContract(signer, chainId);
const hash = "0x" + "a".repeat(64); // Example hash
const data = "Nagpur→NhavaSheva|LOT-001|2025-11-17";
await contract.registerCertificate(hash, data);

// Verify it
const result = await contract.verifyCertificate(hash);
console.log(result);
```

### Test Corridor Data

```javascript
const contract = new CorridorContract(signer, chainId);
await contract.addCorridorData("corridor-1", 85, 45, 68);

const data = await contract.getCorridorData("corridor-1");
console.log(data);
```

## 📊 Contract Addresses

Update these in `src/lib/contracts.ts` after deployment:

```typescript
export const CONTRACT_ADDRESSES = {
  // Sepolia Testnet
  11155111: {
    certificate: '0xYourDeployedAddress',
    corridor: '0xYourDeployedAddress',
  },
  // Polygon Mumbai
  80001: {
    certificate: '0xYourDeployedAddress',
    corridor: '0xYourDeployedAddress',
  },
};
```

## 🔒 Security Best Practices

1. **Never commit private keys** - Use `.env` files
2. **Test thoroughly** on testnets before mainnet
3. **Get audit** if handling valuable data
4. **Use hardware wallet** for mainnet deployments
5. **Monitor gas prices** - deploy when gas is low

## 🐛 Troubleshooting

### "Insufficient funds"
- Get more test ETH from faucets
- Check you're on the right network

### "Transaction failed"
- Increase gas limit in MetaMask
- Check contract logic for reverts
- Verify network is not congested

### "Contract not deployed"
- Ensure deployment transaction confirmed
- Check contract address is correct
- Verify you're on the right network

## 📚 Additional Resources

- Remix Documentation: https://remix-ide.readthedocs.io
- Hardhat Documentation: https://hardhat.org/docs
- Ethers.js Documentation: https://docs.ethers.org
- OpenZeppelin Contracts: https://docs.openzeppelin.com

## ✅ Deployment Checklist

- [ ] Installed MetaMask
- [ ] Got test ETH from faucet
- [ ] Compiled contracts successfully
- [ ] Deployed CertificateVerification contract
- [ ] Deployed MiningCorridorData contract
- [ ] Copied contract addresses
- [ ] Updated CONTRACT_ADDRESSES in contracts.ts
- [ ] Tested certificate verification
- [ ] Tested corridor data submission
- [ ] Ready for production!

---

**Need Help?** Open an issue on GitHub or check the contract code comments for detailed function documentation.
