// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title MiningCorridorData
 * @dev Store and track mining corridor environmental data on-chain
 */
contract MiningCorridorData {
    struct CorridorSnapshot {
        uint256 score;
        uint256 pollution;
        uint256 greenCover;
        uint256 timestamp;
    }

    struct CorridorInfo {
        string corridorId;
        CorridorSnapshot[] history;
        uint256 lastUpdate;
        bool exists;
    }

    mapping(string => CorridorInfo) public corridors;
    string[] public corridorIds;

    event CorridorDataAdded(
        string indexed corridorId,
        uint256 score,
        uint256 pollution,
        uint256 greenCover,
        uint256 timestamp
    );

    /**
     * @dev Add new environmental data for a corridor
     * @param corridorId Unique identifier for the corridor
     * @param score DEES score (0-100)
     * @param pollution Pollution index (0-100)
     * @param greenCover Green cover percentage (0-100)
     */
    function addCorridorData(
        string memory corridorId,
        uint256 score,
        uint256 pollution,
        uint256 greenCover
    ) public returns (bool) {
        require(score <= 100, "Score must be <= 100");
        require(pollution <= 100, "Pollution must be <= 100");
        require(greenCover <= 100, "Green cover must be <= 100");

        if (!corridors[corridorId].exists) {
            corridors[corridorId].corridorId = corridorId;
            corridors[corridorId].exists = true;
            corridorIds.push(corridorId);
        }

        CorridorSnapshot memory snapshot = CorridorSnapshot({
            score: score,
            pollution: pollution,
            greenCover: greenCover,
            timestamp: block.timestamp
        });

        corridors[corridorId].history.push(snapshot);
        corridors[corridorId].lastUpdate = block.timestamp;

        emit CorridorDataAdded(corridorId, score, pollution, greenCover, block.timestamp);

        return true;
    }

    /**
     * @dev Get latest data for a corridor
     * @param corridorId Corridor to query
     */
    function getCorridorData(string memory corridorId)
        public
        view
        returns (
            uint256 score,
            uint256 pollution,
            uint256 greenCover,
            uint256 timestamp
        )
    {
        require(corridors[corridorId].exists, "Corridor does not exist");
        require(corridors[corridorId].history.length > 0, "No data available");

        CorridorSnapshot memory latest = corridors[corridorId].history[
            corridors[corridorId].history.length - 1
        ];

        return (latest.score, latest.pollution, latest.greenCover, latest.timestamp);
    }

    /**
     * @dev Get full history for a corridor
     * @param corridorId Corridor to query
     */
    function getCorridorHistory(string memory corridorId)
        public
        view
        returns (CorridorSnapshot[] memory)
    {
        require(corridors[corridorId].exists, "Corridor does not exist");
        return corridors[corridorId].history;
    }

    /**
     * @dev Get number of data points for a corridor
     */
    function getCorridorHistoryLength(string memory corridorId)
        public
        view
        returns (uint256)
    {
        require(corridors[corridorId].exists, "Corridor does not exist");
        return corridors[corridorId].history.length;
    }

    /**
     * @dev Get total number of tracked corridors
     */
    function getCorridorCount() public view returns (uint256) {
        return corridorIds.length;
    }

    /**
     * @dev Check if corridor exists
     */
    function corridorExists(string memory corridorId) public view returns (bool) {
        return corridors[corridorId].exists;
    }
}
