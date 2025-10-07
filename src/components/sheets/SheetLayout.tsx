import React, { useState, useEffect } from 'react';
import { Character, DndCharacter, Pf2eCharacter, BladesCharacter, LocalStoredCharacter as StoredCharacter } from '@/types';
import { BackArrowIcon, PrintIcon, DownloadIcon } from '../icons';
import { exportCharacterAsMdx } from '@/lib/services/mdxExporter';

interface SheetLayoutProps {
  children: React.ReactNode;
  storedCharacter: StoredCharacter;
  onBack: () => void;
}

const getCharHeader = (character: Character): { name: string, details: string } => {
    if ('name' in character) {
        if ('race' in character && 'class' in character) { // Dnd
            const dndChar = character as DndCharacter;
            return { name: dndChar.name, details: `${dndChar.race} ${dndChar.class} | ${dndChar.background} | ${dndChar.alignment}` };
        }
        if ('ancestry' in character && 'class' in character) { // Pf2e
            const pf2eChar = character as Pf2eCharacter;
            return { name: pf2eChar.name, details: `${pf2eChar.ancestry} ${pf2eChar.class} | ${pf2eChar.background} | ${pf2eChar.alignment}` };
        }
        if ('playbook' in character) { // Blades
            const bladesChar = character as BladesCharacter;
            return { name: bladesChar.name, details: `${bladesChar.playbook} | ${bladesChar.heritage} | ${bladesChar.background}` };
        }
    }
    return { name: 'Unknown Character', details: '' };
};

const generateCharacterImagePrompt = (character: Character): string => {
    const promptElements: string[] = [];

    if ('name' in character && character.name) {
        promptElements.push(character.name);
    }

    if ('race' in character && 'class' in character) { // D&D
        const dnd = character as DndCharacter;
        promptElements.push(`a ${dnd.race} ${dnd.class}`);
    } else if ('ancestry' in character && 'class' in character) { // PF2E
        const pf2e = character as Pf2eCharacter;
        promptElements.push(`a ${pf2e.ancestry} ${pf2e.class}`);
    } else if ('playbook' in character) { // Blades
        const blades = character as BladesCharacter;
        promptElements.push(`a gritty ${blades.playbook}`);
    }

    if ('appearance' in character && character.appearance && Array.isArray(character.appearance)) {
        promptElements.push(character.appearance.join(', '));
    }

    return `A fantasy portrait of ${promptElements.join(', ')}. Digital painting, detailed, character concept art, fantasy illustration.`;
};


const SheetLayout: React.FC<SheetLayoutProps> = ({ children, storedCharacter, onBack }) => {
  const { character, id: characterId } = storedCharacter;
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const charHeader = getCharHeader(character);

  useEffect(() => {
    const prompt = generateCharacterImagePrompt(character);
    const seed = characterId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const encodedPrompt = encodeURIComponent(prompt);
    const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&seed=${seed}&model=flux`;
    setImageUrl(url);
  }, [character, characterId]);


  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    exportCharacterAsMdx(storedCharacter);
  };

  return (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-xl border-2 border-amber-900/50 shadow-2xl animate-fade-in print-container">
        <div className="flex justify-between items-center mb-6 no-print">
            <button 
                onClick={onBack}
                className="font-title bg-gray-700 text-amber-300 py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors duration-300 flex items-center space-x-2"
                aria-label="Return to character list"
            >
                <BackArrowIcon />
                <span>New/View Characters</span>
            </button>
            <div className="flex space-x-2">
                 <button 
                    onClick={handleExport}
                    className="font-title bg-gray-700 text-amber-300 py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors duration-300 flex items-center space-x-2"
                    aria-label="Export character as MDX file"
                >
                    <DownloadIcon />
                    <span>Export MDX</span>
                </button>
                <button 
                    onClick={handlePrint}
                    className="font-title bg-gray-700 text-amber-300 py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors duration-300 flex items-center space-x-2"
                    aria-label="Print character sheet"
                >
                    <PrintIcon />
                    <span>Print</span>
                </button>
            </div>
        </div>
        
      <div className="flex flex-col md:flex-row gap-6 text-center md:text-left items-center mb-4 border-b-2 border-amber-900/50 pb-4 print-border-gray">
          {imageUrl && (
            <img 
              src={imageUrl} 
              alt={`Portrait of ${charHeader.name}`} 
              className="w-32 h-32 rounded-full object-cover border-4 border-amber-800/50 shadow-lg no-print flex-shrink-0" 
            />
          )}
          <div className="flex-grow">
            <h2 className="font-title text-3xl sm:text-4xl text-amber-300 print-text-black">{charHeader.name}</h2>
            <p className="text-gray-400 print-text-black">{charHeader.details}</p>
          </div>
        </div>

      <div className="print-friendly-sheet">
        {children}
      </div>
    </div>
  );
};

export default SheetLayout;