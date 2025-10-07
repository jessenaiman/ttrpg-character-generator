import { DbStoredCharacter as StoredCharacter, db } from '@/lib/db';
import { GameSystem } from '@/types';

/**
 * Service layer for database operations using Dexie.js
 * 
 * This service provides a clean abstraction over the underlying database implementation,
 * allowing for easy querying, creation, updating, and deletion of character records.
 * 
 * @example
 * ```typescript
 * // Get all characters
 * const characters = await DatabaseService.getAllCharacters();
 * 
 * // Add a new character
 * const id = await DatabaseService.addCharacter({
 *   system: GameSystem.DND5E,
 *   prompt: 'A brave warrior',
 *   character: { name: 'Aragorn', class: 'Fighter' },
 *   isNpc: false
 * });
 * ```
 */
export class DatabaseService {
  /**
   * Get all characters from the database
   * 
   * @returns Promise resolving to an array of all stored characters, ordered by creation date (newest first)
   * @throws Will throw an error if the database operation fails
   */
  static async getAllCharacters(): Promise<StoredCharacter[]> {
    try {
      return await db.characters.orderBy('createdAt').reverse().toArray();
    } catch (error) {
      console.error('Error fetching characters:', error);
      throw error;
    }
  }

  /**
   * Get characters filtered by game system
   * 
   * @param system - The game system to filter by
   * @returns Promise resolving to an array of characters for the specified system, ordered by creation date
   * @throws Will throw an error if the database operation fails
   */
  static async getCharactersBySystem(system: GameSystem): Promise<StoredCharacter[]> {
    try {
      return await db.characters
        .where('system')
        .equals(system)
        .sortBy('createdAt');
    } catch (error) {
      console.error('Error fetching characters by system:', error);
      throw error;
    }
  }

  /**
   * Get characters filtered by NPC status
   * 
   * @param isNpc - Boolean indicating whether to fetch NPCs (true) or player characters (false)
   * @returns Promise resolving to an array of characters with the specified NPC status, ordered by creation date
   * @throws Will throw an error if the database operation fails
   */
  static async getCharactersByNpcStatus(isNpc: boolean): Promise<StoredCharacter[]> {
    try {
      // Filter by boolean value after retrieving all and then filter
      const allCharacters = await db.characters.toArray();
      return allCharacters.filter(char => char.isNpc === isNpc)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); // Sort by createdAt descending
    } catch (error) {
      console.error('Error fetching characters by NPC status:', error);
      throw error;
    }
  }

  /**
   * Get a single character by its ID
   * 
   * @param id - The unique identifier of the character to retrieve
   * @returns Promise resolving to the character with the specified ID, or undefined if not found
   * @throws Will throw an error if the database operation fails
   */
  static async getCharacterById(id: string): Promise<StoredCharacter | undefined> {
    try {
      return await db.characters.get(id);
    } catch (error) {
      console.error('Error fetching character by ID:', error);
      throw error;
    }
  }

  /**
   * Add a new character to the database
   * 
   * @param character - The character data to add (without createdAt/updatedAt timestamps)
   * @returns Promise resolving to the ID of the newly created character
   * @throws Will throw an error if the database operation fails
   */
  static async addCharacter(character: Omit<StoredCharacter, 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = new Date();
      const newCharacter: StoredCharacter = {
        ...character,
        createdAt: now,
        updatedAt: now,
      };
      
      return await db.characters.add(newCharacter);
    } catch (error) {
      console.error('Error adding character:', error);
      throw error;
    }
  }

  /**
   * Update an existing character in the database
   * 
   * @param id - The ID of the character to update
   * @param updates - Partial character data with the fields to update
   * @returns Promise that resolves when the update is complete
   * @throws Will throw an error if the database operation fails
   */
  static async updateCharacter(id: string, updates: Partial<Omit<StoredCharacter, 'id' | 'createdAt'>>): Promise<void> {
    try {
      await db.characters.update(id, { ...updates, updatedAt: new Date() });
    } catch (error) {
      console.error('Error updating character:', error);
      throw error;
    }
  }

  /**
   * Delete a character from the database by its ID
   * 
   * @param id - The ID of the character to delete
   * @returns Promise that resolves when the deletion is complete
   * @throws Will throw an error if the database operation fails
   */
  static async deleteCharacter(id: string): Promise<void> {
    try {
      await db.characters.delete(id);
    } catch (error) {
      console.error('Error deleting character:', error);
      throw error;
    }
  }

  /**
   * Bulk add or update multiple characters
   * 
   * This method performs an upsert operation on multiple characters, updating existing
   * records or creating new ones as needed.
   * 
   * @param characters - Array of character data to upsert
   * @returns Promise that resolves when all operations are complete
   * @throws Will throw an error if any database operation fails
   */
  static async bulkUpsert(characters: StoredCharacter[]): Promise<void> {
    try {
      const now = new Date();
      const charactersWithTimestamps = characters.map(char => ({
        ...char,
        updatedAt: now,
      }));
      
      await db.characters.bulkPut(charactersWithTimestamps);
    } catch (error) {
      console.error('Error bulk upserting characters:', error);
      throw error;
    }
  }

  /**
   * Clear all characters from the database
   * 
   * This is useful for testing or resetting the database to a clean state.
   * 
   * @returns Promise that resolves when all characters have been deleted
   * @throws Will throw an error if the database operation fails
   */
  static async clearAllCharacters(): Promise<void> {
    try {
      await db.characters.clear();
    } catch (error) {
      console.error('Error clearing all characters:', error);
      throw error;
    }
  }

  /**
   * Get the total count of characters in the database
   * 
   * @returns Promise resolving to the number of characters stored
   * @throws Will throw an error if the database operation fails
   */
  static async getCharacterCount(): Promise<number> {
    try {
      return await db.characters.count();
    } catch (error) {
      console.error('Error getting character count:', error);
      throw error;
    }
  }

  /**
   * Search characters by name or other fields
   * 
   * This method searches across character names, prompts, and character details
   * for matches to the provided search term.
   * 
   * @param searchTerm - The term to search for (case-insensitive)
   * @returns Promise resolving to an array of matching characters
   * @throws Will throw an error if the database operation fails
   */
  static async searchCharacters(searchTerm: string): Promise<StoredCharacter[]> {
    try {
      // Search in name, prompt, and character details
      return await db.characters
        .filter(char => 
          char.character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          char.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          JSON.stringify(char.character).toLowerCase().includes(searchTerm.toLowerCase()),
        )
        .toArray();
    } catch (error) {
      console.error('Error searching characters:', error);
      throw error;
    }
  }

  /**
   * Get characters created within a specific date range
   * 
   * @param startDate - The start date of the range (inclusive)
   * @param endDate - The end date of the range (inclusive)
   * @returns Promise resolving to an array of characters created within the date range
   * @throws Will throw an error if the database operation fails
   */
  static async getCharactersByDateRange(startDate: Date, endDate: Date): Promise<StoredCharacter[]> {
    try {
      return await db.characters
        .where('createdAt')
        .between(startDate, endDate, true, true)
        .toArray();
    } catch (error) {
      console.error('Error getting characters by date range:', error);
      throw error;
    }
  }
}