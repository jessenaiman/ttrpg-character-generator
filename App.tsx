import React, { useState, useCallback, useEffect } from 'react';
import { GameSystem, LocalStoredCharacter as StoredCharacter } from './types';
import { generateCharacter } from './services/geminiService';
import Header from './components/Header';
import SystemSelector from './components/SystemSelector';
import CharacterGenerator from './components/CharacterGenerator';
import CharacterSheet from './components/CharacterSheet';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import CharacterList from './components/CharacterList';
import { GAME_SYSTEMS } from './constants';

const App: React.FC = () => {
  const [selectedSystem, setSelectedSystem] = useState<GameSystem>(GameSystem.DND5E);
  
  const [characters, setCharacters] = useState<StoredCharacter[]>(() => {
    try {
      const saved = window.localStorage.getItem('ttrpg-characters');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Failed to load characters from local storage:', error);
      return [];
    }
  });

  const [selectedCharacter, setSelectedCharacter] = useState<StoredCharacter | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem('ttrpg-characters', JSON.stringify(characters));
    } catch (error) {
      console.error('Failed to save characters to local storage:', error);
    }
  }, [characters]);

  const handleGenerate = useCallback(async (prompt: string) => {
    if (!prompt) {
      setError('Please enter a character concept.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSelectedCharacter(null);

    try {
      const generatedCharData = await generateCharacter(selectedSystem, prompt);
      const newCharacter: StoredCharacter = {
        id: crypto.randomUUID(),
        system: selectedSystem,
        prompt: prompt,
        character: generatedCharData,
        isNpc: false,
      };
      setCharacters(prev => [newCharacter, ...prev]);
      setSelectedCharacter(newCharacter); // Automatically view the newly generated character
    } catch (err) {
      console.error(err);
      setError('Failed to generate character. The model might be busy or returned an unexpected format. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedSystem]);

  const handleGenerateNpc = useCallback(async (parentCharacter: StoredCharacter) => {
    setIsLoading(true);
    setError(null);
    setSelectedCharacter(null);

    const relationships = ['a sibling', 'a childhood friend', 'a bitter rival', 'a mentor', 'a former lover', 'a sworn enemy', 'a long-lost parent'];
    const relationship = relationships[Math.floor(Math.random() * relationships.length)];
    
    // Ensure backstory exists and is an array before joining
    const backstory = (parentCharacter.character as any).backstory && Array.isArray((parentCharacter.character as any).backstory) 
      ? (parentCharacter.character as any).backstory.join(' ') 
      : 'a mysterious past';

    const systemName = GAME_SYSTEMS.find(s => s.id === parentCharacter.system)?.name || 'the game';

    const npcPrompt = `Based on the backstory of an existing character ("${backstory}"), generate a complete level 1 NPC who is ${relationship} to them. The NPC is for the ${systemName} roleplaying game. Make the NPC's own story and personality connect directly to the original character's backstory, creating interesting plot hooks.`;

    try {
      const generatedCharData = await generateCharacter(parentCharacter.system, npcPrompt);
      const newNpc: StoredCharacter = {
        id: crypto.randomUUID(),
        system: parentCharacter.system,
        prompt: npcPrompt,
        character: generatedCharData,
        isNpc: true,
      };
      setCharacters(prev => [newNpc, ...prev]);
    } catch (err) {
      console.error(err);
      setError('Failed to generate NPC. The model might be busy or returned an unexpected format. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);


  const handleDeleteCharacter = (idToDelete: string) => {
    setCharacters(prev => prev.filter(c => c.id !== idToDelete));
    if (selectedCharacter?.id === idToDelete) {
      setSelectedCharacter(null); // If viewing the deleted one, go back to the main screen
    }
  };

  const handleSelectCharacter = (characterToView: StoredCharacter) => {
    setSelectedCharacter(characterToView);
  };

  const handleReturnToGenerator = () => {
    setSelectedCharacter(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Header />
        <main>
          {selectedCharacter ? (
             <CharacterSheet 
              storedCharacter={selectedCharacter} 
              onBack={handleReturnToGenerator} 
            />
          ) : (
            <>
              <SystemSelector
                systems={GAME_SYSTEMS}
                selectedSystem={selectedSystem}
                onSelectSystem={setSelectedSystem}
              />
              <CharacterGenerator 
                onGenerate={handleGenerate} 
                isLoading={isLoading}
                selectedSystem={selectedSystem}
              />
              
              {error && <ErrorMessage message={error} />}
              {isLoading && <LoadingSpinner />}
              
              {!isLoading && characters.length > 0 && (
                 <div className="mt-12 animate-fade-in">
                   <h2 className="font-title text-3xl text-amber-300 text-center mb-4">Character Compendium</h2>
                   <CharacterList 
                     characters={characters}
                     onSelect={handleSelectCharacter}
                     onDelete={handleDeleteCharacter}
                     onGenerateNpc={handleGenerateNpc}
                     isLoading={isLoading}
                   />
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;