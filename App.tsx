import React, { useState, useCallback } from 'react';
import { GameSystem, StoredCharacter } from './types';
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
  const [characters, setCharacters] = useState<StoredCharacter[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<StoredCharacter | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async (prompt: string) => {
    if (!prompt) {
      setError("Please enter a character concept.");
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
      };
      setCharacters(prev => [newCharacter, ...prev]);
      setSelectedCharacter(newCharacter); // Automatically view the newly generated character
    } catch (err) {
      console.error(err);
      setError("Failed to generate character. The model might be busy or returned an unexpected format. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedSystem]);

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
                   <h2 className="font-title text-3xl text-amber-300 text-center mb-4">Generated Characters</h2>
                   <CharacterList 
                     characters={characters}
                     onSelect={handleSelectCharacter}
                     onDelete={handleDeleteCharacter}
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