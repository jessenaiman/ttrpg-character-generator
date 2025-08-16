
import React from 'react';
import { GameSystem } from '../types';

interface SystemSelectorProps {
  systems: { id: GameSystem; name: string }[];
  selectedSystem: GameSystem;
  onSelectSystem: (system: GameSystem) => void;
}

const SystemSelector: React.FC<SystemSelectorProps> = ({ systems, selectedSystem, onSelectSystem }) => {
  return (
    <div className="flex justify-center space-x-2 sm:space-x-4 mb-8 bg-gray-800 p-2 rounded-lg shadow-lg">
      {systems.map((system) => (
        <button
          key={system.id}
          onClick={() => onSelectSystem(system.id)}
          className={`font-title px-4 py-2 rounded-md text-sm sm:text-base transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-400
            ${selectedSystem === system.id 
              ? 'bg-amber-500 text-gray-900 shadow-md scale-105' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
        >
          {system.name}
        </button>
      ))}
    </div>
  );
};

export default SystemSelector;
