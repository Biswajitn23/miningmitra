import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Corridor {
  id: string;
  name: string;
  from: string;
  to: string;
  score: number;
  riskLevel: 'safe' | 'at-risk' | 'failing';
  lastUpdate: Date;
  coordinates: [number, number];
  routeEndCoordinates: [number, number];
  metrics: {
    pollution: number;
    greenCover: number;
    temperature: number;
    traffic: number;
    compliance: number;
  };
  history: Array<{
    timestamp: Date;
    score: number;
    pollution: number;
  }>;
  blockchainEvents: Array<{
    type: string;
    message: string;
    timestamp: Date;
  }>;
}

interface CorridorContextType {
  corridors: Corridor[];
  selectedCorridor: Corridor | null;
  selectCorridor: (id: string) => void;
  simulateSpike: () => void;
  updateMetrics: (pollution: number, traffic: number, greenCover: number, temperature: number) => void;
  generateNewScore: () => void;
}

const CorridorContext = createContext<CorridorContextType | undefined>(undefined);

const initialCorridors: Corridor[] = [
  {
    id: '1',
    name: 'Nagpur → Nhava Sheva',
    from: 'Nagpur',
    to: 'Nhava Sheva',
    score: 82,
    riskLevel: 'safe',
    lastUpdate: new Date(),
    coordinates: [79.0882, 21.1458],
    routeEndCoordinates: [73.0297, 18.9479],
    metrics: {
      pollution: 45,
      greenCover: 68,
      temperature: 32,
      traffic: 42,
      compliance: 88,
    },
    history: [
      { timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), score: 78, pollution: 48 },
      { timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), score: 80, pollution: 46 },
      { timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), score: 79, pollution: 47 },
      { timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), score: 81, pollution: 45 },
      { timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), score: 82, pollution: 45 },
    ],
    blockchainEvents: [
      { type: 'cert-added', message: 'Export Lot #8912 Verified', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) },
      { type: 'score-update', message: 'Score Updated: 81 → 82', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000) },
    ],
  },
  {
    id: '2',
    name: 'Delhi → Mumbai',
    from: 'Delhi',
    to: 'Mumbai',
    score: 65,
    riskLevel: 'at-risk',
    lastUpdate: new Date(),
    coordinates: [77.1025, 28.7041],
    routeEndCoordinates: [72.8777, 19.0760],
    metrics: {
      pollution: 72,
      greenCover: 45,
      temperature: 35,
      traffic: 78,
      compliance: 65,
    },
    history: [
      { timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), score: 70, pollution: 68 },
      { timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), score: 68, pollution: 70 },
      { timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), score: 67, pollution: 71 },
      { timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), score: 66, pollution: 72 },
      { timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), score: 65, pollution: 72 },
    ],
    blockchainEvents: [
      { type: 'alert', message: 'Pollution Threshold Exceeded', timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000) },
      { type: 'score-update', message: 'Score Updated: 66 → 65', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000) },
    ],
  },
  {
    id: '3',
    name: 'Chennai → Bangalore',
    from: 'Chennai',
    to: 'Bangalore',
    score: 38,
    riskLevel: 'failing',
    lastUpdate: new Date(),
    coordinates: [80.2707, 13.0827],
    routeEndCoordinates: [77.5946, 12.9716],
    metrics: {
      pollution: 88,
      greenCover: 32,
      temperature: 38,
      traffic: 85,
      compliance: 42,
    },
    history: [
      { timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), score: 42, pollution: 85 },
      { timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), score: 40, pollution: 86 },
      { timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), score: 39, pollution: 87 },
      { timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), score: 38, pollution: 88 },
      { timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), score: 38, pollution: 88 },
    ],
    blockchainEvents: [
      { type: 'alert', message: 'Critical: Multiple Violations Detected', timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000) },
      { type: 'score-update', message: 'Score Updated: 39 → 38 (Critical)', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) },
    ],
  },
];

export const CorridorProvider = ({ children }: { children: ReactNode }) => {
  const [corridors, setCorridors] = useState<Corridor[]>(initialCorridors);
  const [selectedCorridor, setSelectedCorridor] = useState<Corridor | null>(null);

  const selectCorridor = (id: string) => {
    const corridor = corridors.find((c) => c.id === id);
    setSelectedCorridor(corridor || null);
  };

  const simulateSpike = () => {
    setCorridors((prev) =>
      prev.map((corridor) => {
        const newPollution = Math.min(100, corridor.metrics.pollution + 30);
        const newScore = Math.max(20, corridor.score - 35);
        const newRiskLevel = newScore > 70 ? 'safe' : newScore > 50 ? 'at-risk' : 'failing';

        return {
          ...corridor,
          score: newScore,
          riskLevel: newRiskLevel,
          metrics: {
            ...corridor.metrics,
            pollution: newPollution,
          },
          history: [
            ...corridor.history,
            {
              timestamp: new Date(),
              score: newScore,
              pollution: newPollution,
            },
          ],
          blockchainEvents: [
            {
              type: 'spike-detected',
              message: `Score Update: ${corridor.score} → ${newScore} (Spike Detected)`,
              timestamp: new Date(),
            },
            ...corridor.blockchainEvents,
          ],
          lastUpdate: new Date(),
        };
      })
    );
  };

  const updateMetrics = (pollution: number, traffic: number, greenCover: number, temperature: number) => {
    setCorridors((prev) =>
      prev.map((corridor) => ({
        ...corridor,
        metrics: {
          ...corridor.metrics,
          pollution,
          traffic,
          greenCover,
          temperature,
        },
        lastUpdate: new Date(),
      }))
    );
  };

  const generateNewScore = () => {
    setCorridors((prev) =>
      prev.map((corridor) => {
        const avgMetric = (
          (100 - corridor.metrics.pollution) +
          corridor.metrics.greenCover +
          (100 - corridor.metrics.traffic) +
          corridor.metrics.compliance
        ) / 4;
        
        const newScore = Math.round(avgMetric);
        const newRiskLevel = newScore > 70 ? 'safe' : newScore > 50 ? 'at-risk' : 'failing';

        return {
          ...corridor,
          score: newScore,
          riskLevel: newRiskLevel,
          history: [
            ...corridor.history,
            {
              timestamp: new Date(),
              score: newScore,
              pollution: corridor.metrics.pollution,
            },
          ],
          blockchainEvents: [
            {
              type: 'score-update',
              message: `Score Regenerated: ${corridor.score} → ${newScore}`,
              timestamp: new Date(),
            },
            ...corridor.blockchainEvents,
          ],
          lastUpdate: new Date(),
        };
      })
    );
  };

  return (
    <CorridorContext.Provider
      value={{
        corridors,
        selectedCorridor,
        selectCorridor,
        simulateSpike,
        updateMetrics,
        generateNewScore,
      }}
    >
      {children}
    </CorridorContext.Provider>
  );
};

export const useCorridors = () => {
  const context = useContext(CorridorContext);
  if (!context) {
    throw new Error('useCorridors must be used within CorridorProvider');
  }
  return context;
};
