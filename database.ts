import Dexie, { Table } from 'dexie';
import { GameSystem, Character as CharacterType, LocalStoredCharacter } from './types';

export interface DbStoredCharacter {
  id: string;
  system: GameSystem;
  prompt: string;
  character: CharacterType; // Can be DndCharacter, Pf2eCharacter, or BladesCharacter
  isNpc: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class TtrpgDatabase extends Dexie {
  characters!: Table<DbStoredCharacter>;

  constructor() {
    super('TtrpgDatabase');
    
    // Define the schema with version 1
    this.version(1).stores({
      characters: 'id, system, isNpc, createdAt, updatedAt' // Primary key is 'id', indexes on other useful fields
    });
    
    // Migration from localStorage to IndexedDB (version 2)
    this.version(2).stores({
      characters: 'id, system, isNpc, createdAt, updatedAt'
    }).upgrade(trans => {
      // Migration logic from localStorage to IndexedDB
      return trans.table('characters').clear().then(() => {
        const saved = localStorage.getItem('ttrpg-characters');
        if (saved) {
          try {
            const oldCharacters = JSON.parse(saved);
            const now = new Date();
            const charactersToMigrate = oldCharacters.map((char: any) => ({
              ...char,
              createdAt: char.createdAt || now,
              updatedAt: char.updatedAt || now
            }));
            
            return trans.table('characters').bulkAdd(charactersToMigrate);
          } catch (e) {
            console.error('Migration from localStorage failed:', e);
            // If migration fails, we'll have an empty database, which is acceptable
            return Promise.resolve();
          }
        }
      });
    });
    
    // Future schema updates can be added as new versions
    // Example for version 3, if we need to add a new field:
    /*
    this.version(3).stores({
      characters: 'id, system, isNpc, createdAt, updatedAt, [system+isNpc]' // Adding a compound index
    }).upgrade(trans => {
      // Add default values for new fields here if needed
      return trans.table('characters').toCollection().modify(char => {
        // Example: if we added a 'version' field
        // if (char.version === undefined) char.version = 1;
      });
    });
    */
  }
}

export const db = new TtrpgDatabase();
export { GameSystem };