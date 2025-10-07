import React, { useState, useEffect, useCallback } from 'react';
import { GameSystem } from '@/types';

interface CharacterGeneratorProps {
  onGenerate: (prompt: string) => void;
  onGenerateWithNpcs?: (prompt: string) => void;
  isLoading: boolean;
  selectedSystem: GameSystem;
}

const suggestionSets: Record<GameSystem, string[]> = {
  [GameSystem.DND5E]: [
    'A stoic half-orc barbarian who is afraid of the dark',
    'A cunning tiefling rogue with a heart of gold',
    'A grizzled dwarven cleric who has lost their faith',
    'An elven wizard obsessed with forbidden knowledge',
    'A charismatic human bard who is secretly a spy',
    'A gnome artificer whose inventions always have a chaotic side-effect',
    'A dragonborn sorcerer struggling to control their innate magical powers',
    'A halfling monk who seeks enlightenment through perfecting the ultimate sandwich',
    'A fallen aasimar paladin trying to redeem a cursed family name',
  ],
  [GameSystem.PF2E]: [
    'A Leshy druid who wants to see the world beyond their forest',
    'An automaton champion searching for their creator\'s purpose',
    'A goblin witch who speaks to an unusually intelligent toad',
    'A human gunslinger seeking revenge on a notorious outlaw',
    'An elf magus who blends swordplay and arcane might seamlessly',
    'A dwarf investigator who solves crimes with meticulous detail',
    'A catfolk swashbuckler with unmatched panache and flair',
    'A fetchling thaumaturge who uses esoteric trinkets to fight evil',
    'A gnome inventor with a clockwork companion that\'s slightly malfunctioning',
  ],
  [GameSystem.BLADES]: [
    'A Cutter who uses their imposing presence to settle scores in the Crows Foot district',
    'A Leech, the only doctor in Silkshore who will patch up scoundrels, for a price',
    'A Lurk who can navigate the rooftops of Duskvol like a ghost',
    'A Slide whose silver tongue has gotten them into and out of trouble with every noble house',
    'A Spider, weaving a web of contacts and secrets from a hidden lair in Charterhall',
    'A Whisper who communes with the ghosts of the city to uncover forgotten paths',
    'A Hound, a deadly shot who tracks targets through the smoggy streets with a loyal pet',
    'A Tycherosi expert on ancient artifacts, fencing them on the black market',
    'A Skovlander refugee turned bare-knuckle boxer in the fighting pits',
  ],
};


const CharacterGenerator: React.FC<CharacterGeneratorProps> = ({ onGenerate, onGenerateWithNpcs, isLoading, selectedSystem }) => {
  const [prompt, setPrompt] = useState('');
  const [displayedSuggestions, setDisplayedSuggestions] = useState<string[]>([]);

  const refreshSuggestions = useCallback(() => {
    const currentSuggestions = suggestionSets[selectedSystem];
    const shuffled = [...currentSuggestions].sort(() => 0.5 - Math.random());
    setPrompt(shuffled[0] || ''); 
    setDisplayedSuggestions(shuffled.slice(1, 4));
  }, [selectedSystem]);

  useEffect(() => {
    refreshSuggestions();
  }, [selectedSystem, refreshSuggestions]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(prompt);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full h-28 p-4 bg-gray-800 border-2 border-gray-600 rounded-lg text-gray-200 focus:ring-amber-400 focus:border-amber-400 transition-colors duration-300 resize-none"
        disabled={isLoading}
        aria-label="Character concept"
      />
      
      <div className="pb-2">
        <p className="text-sm text-gray-400 mb-2">Or, try one of these ideas:</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {displayedSuggestions.map((suggestion, index) => (
            <button
              type="button"
              key={index}
              onClick={() => setPrompt(suggestion)}
              disabled={isLoading}
              className="text-left p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-sm text-gray-400 hover:bg-gray-700 hover:text-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {suggestion}
            </button>
          ))}
        </div>
        <div className="flex justify-end mt-2">
          <button
            type="button"
            onClick={refreshSuggestions}
            disabled={isLoading}
            className="flex items-center space-x-2 text-sm text-amber-400 hover:text-amber-300 disabled:text-gray-500 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.899 2.186l-1.42.474a5.002 5.002 0 00-8.475-1.588V5a1 1 0 01-2 0V3a1 1 0 011-1zm12 15a1 1 0 01-1-1v-2.101a7.002 7.002 0 01-11.899-2.186l1.42-.474a5.002 5.002 0 008.475 1.588V15a1 1 0 012 0v2a1 1 0 01-1 1z" clipRule="evenodd" />
            </svg>
            <span>More Ideas</span>
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full font-title text-xl bg-amber-600 text-gray-900 font-bold py-3 px-6 rounded-lg hover:bg-amber-500 transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center shadow-lg transform hover:scale-105"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            'Generate Character'
          )}
        </button>

        {onGenerateWithNpcs && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onGenerateWithNpcs(prompt);
            }}
            disabled={isLoading || !prompt}
            className="w-full font-title text-lg bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-500 transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center shadow-lg transform hover:scale-105"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating with NPCs...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                Generate with NPCs
              </>
            )}
          </button>
        )}
      </div>
    </form>
  );
};

export default CharacterGenerator;