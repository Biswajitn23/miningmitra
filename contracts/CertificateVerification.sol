// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title CertificateVerification
 * @dev Store and verify mining export certificates on-chain
 */
contract CertificateVerification {
    struct Certificate {
        string certificateHash;
        string certificateData; // Format: "corridorId|lotNumber|..."
        address issuer;
        uint256 timestamp;
        bool exists;
    }

    mapping(string => Certificate) public certificates;
    string[] public certificateHashes;
    
    event CertificateRegistered(
        string indexed certificateHash,
        address indexed issuer,
        uint256 timestamp
    );

    /**
     * @dev Register a new certificate on the blockchain
     * @param certificateHash Unique hash of the certificate
     * @param certificateData Encoded certificate data
     */
    function registerCertificate(
        string memory certificateHash,
        string memory certificateData
    ) public returns (bool) {
        require(!certificates[certificateHash].exists, "Certificate already registered");
        
        certificates[certificateHash] = Certificate({
            certificateHash: certificateHash,
            certificateData: certificateData,
            issuer: msg.sender,
            timestamp: block.timestamp,
            exists: true
        });
        
        certificateHashes.push(certificateHash);
        
        emit CertificateRegistered(certificateHash, msg.sender, block.timestamp);
        
        return true;
    }

    /**
     * @dev Verify a certificate exists on-chain
     * @param certificateHash Hash to verify
     * @return exists Whether certificate is valid
     * @return data Certificate data
     * @return timestamp When it was registered
     * @return issuer Who registered it
     */
    function verifyCertificate(string memory certificateHash)
        public
        view
        returns (
            bool exists,
            string memory data,
            uint256 timestamp,
            address issuer
        )
    {
        Certificate memory cert = certificates[certificateHash];
        return (
            cert.exists,
            cert.certificateData,
            cert.timestamp,
            cert.issuer
        );
    }

    /**
     * @dev Get total number of registered certificates
     */
    function getCertificateCount() public view returns (uint256) {
        return certificateHashes.length;
    }

    /**
     * @dev Get certificate by index
     */
    function getCertificateByIndex(uint256 index)
        public
        view
        returns (
            string memory certificateHash,
            string memory certificateData,
            address issuer,
            uint256 timestamp
        )
    {
        require(index < certificateHashes.length, "Index out of bounds");
        string memory hash = certificateHashes[index];
        Certificate memory cert = certificates[hash];
        return (cert.certificateHash, cert.certificateData, cert.issuer, cert.timestamp);
    }
}
