'use client';

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { GameSystem } from '@/types';
import { PrismaDatabaseService, PrismaStoredCharacter } from '@/lib/services/prisma-database';
import { generateSingleCharacter, generateCharacterWithNpcs } from '@/lib/services/geminiServiceOptimized';
import Header from '@/components/Header';
import SystemSelector from '@/components/SystemSelector';
import CharacterGenerator from '@/components/CharacterGenerator';
import CharacterSheet from '@/components/CharacterSheet';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import CharacterList from '@/components/CharacterList';
import { GAME_SYSTEMS } from '@/lib/utils/constants';

// Temporary page until we migrate the main App component
export default function HomePage(): React.JSX.Element {
  const [selectedSystem, setSelectedSystem] = useState<GameSystem>(GameSystem.DND5E);

  const [characters, setCharacters] = useState<PrismaStoredCharacter[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<PrismaStoredCharacter | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load characters from database on component mount
  useEffect(() => {
    const loadCharacters = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const dbCharacters = await PrismaDatabaseService.getAllCharacters();
        setCharacters(dbCharacters);
      } catch (err) {
        console.error('Failed to load characters from database:', err);
        setError('Failed to load characters from database');
      } finally {
        setIsLoading(false);
      }
    };

    loadCharacters();
  }, []);

  const handleGenerate = useCallback(async (prompt: string): Promise<void> => {
    if (!prompt) {
      setError('Please enter a character concept.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSelectedCharacter(null);

    try {
      const generatedCharData = await generateSingleCharacter(selectedSystem, prompt);
      const newCharacter = await PrismaDatabaseService.addCharacter({
        system: selectedSystem,
        prompt: prompt,
        character: generatedCharData,
        isNpc: false,
      });
      setCharacters(prev => [newCharacter, ...prev]);
      setSelectedCharacter(newCharacter); // Automatically view the newly generated character
    } catch (err) {
      console.error(err);
      setError('Failed to generate character. The model might be busy or returned an unexpected format. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedSystem]);

  // Enhanced NPC generation with optimized API calls
  const handleGenerateNpc = useCallback(async (parentCharacter: StoredCharacter): Promise<void> => {
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
      const generatedCharData = await generateSingleCharacter(parentCharacter.system, npcPrompt);
      const newNpc = await PrismaDatabaseService.addCharacter({
        system: parentCharacter.system,
        prompt: npcPrompt,
        character: generatedCharData,
        isNpc: true,
      });
      setCharacters(prev => [newNpc, ...prev]);
    } catch (err) {
      console.error(err);
      setError('Failed to generate NPC. The model might be busy or returned an unexpected format. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // New optimized function to generate a character with NPCs in a single API call
 const handleGenerateWithNpcs = useCallback(async (prompt: string) => {
    if (!prompt) {
      setError('Please enter a character concept.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSelectedCharacter(null);

    try {
      // Generate character with 1-2 related NPCs in a single API call
      const result = await generateCharacterWithNpcs(selectedSystem, prompt, 2);
      
      // Create main character
      const newCharacter = await PrismaDatabaseService.addCharacter({
        system: selectedSystem,
        prompt: prompt,
        character: result.character,
        isNpc: false,
      });

      // Create NPCs
      const newNpcs = await Promise.all(
        result.npcs.map((npc: any) =>
          PrismaDatabaseService.addCharacter({
            system: selectedSystem,
            prompt: `NPC related to: ${prompt}`,
            character: npc,
            isNpc: true,
          }),
        ),
      );
      
      // Add character and NPCs to the list
      setCharacters(prev => [newCharacter, ...newNpcs, ...prev]);
      setSelectedCharacter(newCharacter); // Automatically view the newly generated character
    } catch (err) {
      console.error(err);
      // Fallback to single character generation
      setError('NPC Generation failed, generating single character instead.');
      
      try {
        const generatedCharData = await generateSingleCharacter(selectedSystem, prompt);
        const newCharacter = await PrismaDatabaseService.addCharacter({
          system: selectedSystem,
          prompt: prompt,
          character: generatedCharData,
          isNpc: false,
        });
        setCharacters(prev => [newCharacter, ...prev]);
        setSelectedCharacter(newCharacter);
      } catch (fallbackErr) {
          setError('Failed to generate character. The model might be busy or returned an unexpected format. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [selectedSystem]);

  const handleDeleteCharacter = async (idToDelete: string): Promise<void> => {
    try {
      await PrismaDatabaseService.deleteCharacter(idToDelete);
      setCharacters(prev => prev.filter(c => c.id !== idToDelete));
      if (selectedCharacter?.id === idToDelete) {
        setSelectedCharacter(null); // If viewing the deleted one, go back to the main screen
      }
    } catch (err) {
      console.error('Failed to delete character from database:', err);
      setError('Failed to delete character');
    }
  };

  const handleSelectCharacter = (characterToView: StoredCharacter): void => {
    setSelectedCharacter(characterToView);
  };

  const handleReturnToGenerator = (): void => {
    setSelectedCharacter(null);
  };

  return (
    <div className="min-h-screen bg-background text-text p-4 sm:p-6 md:p-8">
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
                onGenerateWithNpcs={handleGenerateWithNpcs}
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
}