import React, { useState, useCallback, useEffect } from 'react';
import { Character as CharacterType, GameSystem, LocalStoredCharacter as StoredCharacter } from './types';
import { PrismaService } from './services/prismaService';
import { generateSingleCharacter } from './services/geminiServiceOptimized';
import Header from './components/Header';
import SystemSelector from './components/SystemSelector';
import CharacterGenerator from './components/CharacterGenerator';
import CharacterSheet from './components/CharacterSheet';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import CharacterList from './components/CharacterList';
import { GAME_SYSTEMS } from './constants';

// Define the shape for Prisma character data (matches what's stored in the DB)
interface PrismaCharacter {
  id: string;
  system: string; // Prisma stores this as string
  prompt: string;
  character: any; // The JSON data
  isNpc: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const App: React.FC = () => {
  const [selectedSystem, setSelectedSystem] = useState<GameSystem>(GameSystem.DND5E);
  
  const [characters, setCharacters] = useState<PrismaCharacter[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<PrismaCharacter | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load characters from database on initial render
  useEffect(() => {
    const loadCharacters = async () => {
      try {
        setIsLoading(true);
        const dbCharacters = await PrismaService.getAllCharacters();
        setCharacters(dbCharacters);
        
        // Try to load the first PC as default
        const firstPC = await PrismaService.getFirstPC();
        if (firstPC) {
          setSelectedCharacter(firstPC);
        }
      } catch (err) {
        console.error('Failed to load characters from database:', err);
        setError('Failed to load characters from database');
      } finally {
        setIsLoading(false);
      }
    };

    loadCharacters();
  }, []);

  const handleGenerate = useCallback(async (prompt: string) => {
    if (!prompt) {
      setError("Please enter a character concept.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSelectedCharacter(null);

    try {
      const generatedCharData = await generateSingleCharacter(selectedSystem, prompt);
      const newCharacter = await PrismaService.addCharacter({
        system: selectedSystem,
        prompt: prompt,
        character: generatedCharData,
        isNpc: false,
      });
      
      setCharacters(prev => [newCharacter, ...prev]);
      setSelectedCharacter(newCharacter); // Automatically view the newly generated character
    } catch (err) {
      console.error(err);
      setError("Failed to generate character. The model might be busy or returned an unexpected format. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedSystem]);

  const handleGenerateNpc = useCallback(async (parentCharacter: PrismaCharacter) => {
    setIsLoading(true);
    setError(null);
    setSelectedCharacter(null);

    const relationships = ['a sibling', 'a childhood friend', 'a bitter rival', 'a mentor', 'a former lover', 'a sworn enemy', 'a long-lost parent'];
    const relationship = relationships[Math.floor(Math.random() * relationships.length)];
    
    // Ensure backstory exists and is an array before joining
    const backstory = parentCharacter.character.backstory && Array.isArray(parentCharacter.character.backstory) 
      ? parentCharacter.character.backstory.join(' ') 
      : 'a mysterious past';

    const systemName = GAME_SYSTEMS.find(s => s.id === parentCharacter.system)?.name || 'the game';

    const npcPrompt = `Based on the backstory of an existing character ("${backstory}"), generate a complete level 1 NPC who is ${relationship} to them. The NPC is for the ${systemName} roleplaying game. Make the NPC's own story and personality connect directly to the original character's backstory, creating interesting plot hooks.`;

    try {
      const generatedCharData = await generateSingleCharacter(parentCharacter.system as GameSystem, npcPrompt);
      const newNpc = await PrismaService.addCharacter({
        system: parentCharacter.system as GameSystem,
        prompt: npcPrompt,
        character: generatedCharData,
        isNpc: true,
      });
      
      setCharacters(prev => [newNpc, ...prev]);
    } catch (err) {
      console.error(err);
      setError("Failed to generate NPC. The model might be busy or returned an unexpected format. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDeleteCharacter = async (idToDelete: string) => {
    try {
      await PrismaService.deleteCharacter(idToDelete);
      setCharacters(prev => prev.filter(c => c.id !== idToDelete));
      if (selectedCharacter?.id === idToDelete) {
        setSelectedCharacter(null); // If viewing the deleted one, go back to the main screen
      }
    } catch (err) {
      console.error('Failed to delete character from database:', err);
      setError('Failed to delete character');
    }
  };

  const handleSelectCharacter = (characterToView: PrismaCharacter) => {
    setSelectedCharacter(characterToView);
  };

  const handleReturnToGenerator = () => {
    setSelectedCharacter(null);
  };

  // Helper function to convert Prisma character to LocalStoredCharacter
  const prismaToStoredCharacter = (prismaChar: PrismaCharacter): StoredCharacter => ({
    id: prismaChar.id,
    system: prismaChar.system as GameSystem,
    prompt: prismaChar.prompt,
    character: prismaChar.character,
    isNpc: prismaChar.isNpc,
  });

  // Helper function to convert LocalStoredCharacter to PrismaCharacter
  const storedToPrismaCharacter = (storedChar: StoredCharacter, id: string): PrismaCharacter => ({
    id: id,
    system: storedChar.system,
    prompt: storedChar.prompt,
    character: storedChar.character,
    isNpc: storedChar.isNpc,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Header />
        <main>
          {selectedCharacter ? (
             <CharacterSheet 
              storedCharacter={prismaToStoredCharacter(selectedCharacter)} 
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
                     characters={characters.map(prismaToStoredCharacter)}
                     onSelect={(char) => {
                       // Find the matching Prisma character
                       const prismaChar = characters.find(c => c.id === char.id);
                       if (prismaChar) {
                         setSelectedCharacter(prismaChar);
                       }
                     }}
                     onDelete={handleDeleteCharacter}
                     onGenerateNpc={(char) => {
                       // Find the matching Prisma character
                       const prismaChar = characters.find(c => c.id === char.id);
                       if (prismaChar) {
                         handleGenerateNpc(prismaChar);
                       }
                     }}
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