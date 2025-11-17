import { Contract } from 'ethers';
import type { JsonRpcSigner } from 'ethers';

// Certificate Verification Contract ABI
export const CERTIFICATE_ABI = [
  'function verifyCertificate(string certificateHash) view returns (bool, string, uint256, address)',
  'function registerCertificate(string certificateHash, string certificateData) returns (bool)',
  'function getCertificateCount() view returns (uint256)',
  'event CertificateRegistered(string certificateHash, address indexed issuer, uint256 timestamp)',
];

// Mining Corridor Data Contract ABI
export const CORRIDOR_ABI = [
  'function addCorridorData(string corridorId, uint256 score, uint256 pollution, uint256 greenCover) returns (bool)',
  'function getCorridorData(string corridorId) view returns (uint256, uint256, uint256, uint256)',
  'function getCorridorHistory(string corridorId) view returns (tuple(uint256 score, uint256 pollution, uint256 greenCover, uint256 timestamp)[])',
  'event CorridorDataAdded(string corridorId, uint256 score, uint256 timestamp)',
];

// Contract addresses (update these with your deployed contract addresses)
export const CONTRACT_ADDRESSES = {
  // Sepolia Testnet
  11155111: {
    certificate: '0x0000000000000000000000000000000000000000', // Deploy your contract and update
    corridor: '0x0000000000000000000000000000000000000000',
  },
  // Polygon Mumbai Testnet
  80001: {
    certificate: '0x0000000000000000000000000000000000000000',
    corridor: '0x0000000000000000000000000000000000000000',
  },
  // Local/Development
  31337: {
    certificate: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    corridor: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
  },
};

// Certificate Contract Functions
export class CertificateContract {
  private contract: Contract;

  constructor(signer: JsonRpcSigner, chainId: number) {
    const address = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]?.certificate;
    if (!address || address === '0x0000000000000000000000000000000000000000') {
      throw new Error('Certificate contract not deployed on this network');
    }
    this.contract = new Contract(address, CERTIFICATE_ABI, signer);
  }

  async verifyCertificate(certificateHash: string): Promise<{
    isValid: boolean;
    data: string;
    timestamp: bigint;
    issuer: string;
  }> {
    try {
      const [isValid, data, timestamp, issuer] = await this.contract.verifyCertificate(certificateHash);
      return { isValid, data, timestamp, issuer };
    } catch (error) {
      console.error('Error verifying certificate:', error);
      throw error;
    }
  }

  async registerCertificate(certificateHash: string, certificateData: string): Promise<boolean> {
    try {
      const tx = await this.contract.registerCertificate(certificateHash, certificateData);
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Error registering certificate:', error);
      throw error;
    }
  }

  async getCertificateCount(): Promise<bigint> {
    try {
      return await this.contract.getCertificateCount();
    } catch (error) {
      console.error('Error getting certificate count:', error);
      throw error;
    }
  }
}

// Corridor Contract Functions
export class CorridorContract {
  private contract: Contract;

  constructor(signer: JsonRpcSigner, chainId: number) {
    const address = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]?.corridor;
    if (!address || address === '0x0000000000000000000000000000000000000000') {
      throw new Error('Corridor contract not deployed on this network');
    }
    this.contract = new Contract(address, CORRIDOR_ABI, signer);
  }

  async addCorridorData(
    corridorId: string,
    score: number,
    pollution: number,
    greenCover: number
  ): Promise<boolean> {
    try {
      const tx = await this.contract.addCorridorData(corridorId, score, pollution, greenCover);
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Error adding corridor data:', error);
      throw error;
    }
  }

  async getCorridorData(corridorId: string): Promise<{
    score: bigint;
    pollution: bigint;
    greenCover: bigint;
    timestamp: bigint;
  }> {
    try {
      const [score, pollution, greenCover, timestamp] = await this.contract.getCorridorData(corridorId);
      return { score, pollution, greenCover, timestamp };
    } catch (error) {
      console.error('Error getting corridor data:', error);
      throw error;
    }
  }

  async getCorridorHistory(corridorId: string): Promise<
    Array<{
      score: bigint;
      pollution: bigint;
      greenCover: bigint;
      timestamp: bigint;
    }>
  > {
    try {
      return await this.contract.getCorridorHistory(corridorId);
    } catch (error) {
      console.error('Error getting corridor history:', error);
      throw error;
    }
  }
}

// Utility function to generate certificate hash
export const generateCertificateHash = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return `0x${hashHex}`;
};
