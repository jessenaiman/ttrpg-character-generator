
import React from 'react';
import { StoredCharacter, GameSystem, DndCharacter, Pf2eCharacter, BladesCharacter, Character } from '../types';
import { GAME_SYSTEMS } from '../constants';

interface CharacterListProps {
  characters: StoredCharacter[];
  onSelect: (character: StoredCharacter) => void;
  onDelete: (id: string) => void;
}

const getCharacterSummary = (character: StoredCharacter): string => {
  switch (character.system) {
    case GameSystem.DND5E:
      const dnd = character.character as DndCharacter;
      return `${dnd.race} ${dnd.class}`;
    case GameSystem.PF2E:
      const pf2e = character.character as Pf2eCharacter;
      return `${pf2e.ancestry} ${pf2e.class}`;
    case GameSystem.BLADES:
      const blades = character.character as BladesCharacter;
      return blades.playbook;
    default:
      return 'Character';
  }
};

const getCharacterName = (character: Character): string => {
    return (character as DndCharacter).name || 'Unnamed';
}

const CharacterList: React.FC<CharacterListProps> = ({ characters, onSelect, onDelete }) => {
  return (
    <div className="bg-gray-800/50 p-2 sm:p-4 rounded-lg border border-gray-700 shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[400px] text-left table-auto">
          <thead className="border-b-2 border-amber-800/50">
            <tr>
              <th className="p-3 text-sm font-title uppercase text-amber-400 tracking-wider">Name</th>
              <th className="p-3 text-sm font-title uppercase text-amber-400 tracking-wider hidden sm:table-cell">System</th>
              <th className="p-3 text-sm font-title uppercase text-amber-400 tracking-wider hidden md:table-cell">Summary</th>
              <th className="p-3 text-sm font-title uppercase text-amber-400 tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {characters.map((char) => (
              <tr 
                key={char.id} 
                className="border-b border-gray-700 hover:bg-gray-800 transition-colors duration-200 group"
              >
                <td 
                  className="p-3 font-bold text-gray-200 group-hover:text-amber-300 cursor-pointer"
                  onClick={() => onSelect(char)}
                >
                    {getCharacterName(char.character)}
                </td>
                <td 
                    className="p-3 text-gray-400 hidden sm:table-cell cursor-pointer"
                    onClick={() => onSelect(char)}
                >
                    {GAME_SYSTEMS.find(s => s.id === char.system)?.name}
                </td>
                <td 
                    className="p-3 text-gray-400 hidden md:table-cell cursor-pointer"
                    onClick={() => onSelect(char)}
                >
                    {getCharacterSummary(char)}
                </td>
                <td className="p-3 text-right">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(char.id);
                    }}
                    className="text-gray-500 hover:text-red-500 font-semibold transition-colors text-sm py-1 px-2 rounded"
                    aria-label={`Delete ${getCharacterName(char.character)}`}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CharacterList;
