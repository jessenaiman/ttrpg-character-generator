import React from 'react';
import { GameSystem, LocalStoredCharacter as StoredCharacter } from '../types';
import SheetLayout from './sheets/SheetLayout';
import DndSheet from './sheets/DndSheet';
import Pf2eSheet from './sheets/Pf2eSheet';
import BladesSheet from './sheets/BladesSheet';
import CharacterChat from './CharacterChat';

interface CharacterSheetProps {
  storedCharacter: StoredCharacter;
  onBack: () => void;
}

const CharacterSheet: React.FC<CharacterSheetProps> = ({ storedCharacter, onBack }) => {
  const { character, system } = storedCharacter;

  const renderSheet = () => {
    switch (system) {
      case GameSystem.DND5E:
        return <DndSheet character={character as any} />;
      case GameSystem.PF2E:
        return <Pf2eSheet character={character as any} />;
      case GameSystem.BLADES:
        return <BladesSheet character={character as any} />;
      default:
        return <p>Error: Unknown game system selected.</p>;
    }
  };

  return (
    <SheetLayout storedCharacter={storedCharacter} onBack={onBack}>
      {renderSheet()}
      <CharacterChat storedCharacter={storedCharacter} />
    </SheetLayout>
  );
};

export default CharacterSheet;