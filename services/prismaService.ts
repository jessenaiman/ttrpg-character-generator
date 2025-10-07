import { PrismaClient } from '@prisma/client';
import { GameSystem } from '../types';

/**
 * Initialize Prisma Client
 * 
 * Creates a singleton instance of the Prisma client for database operations.
 * This client should be used throughout the application for all database interactions.
 */
const prisma = new PrismaClient();

/**
 * Type definition for character data stored in the database
 * 
 * This type represents the flexible structure of character data that varies
 * based on the game system being used.
 */
type CharacterData = {
  name: string;
  [key: string]: any; // Allow other properties based on the game system
};

/**
 * Service class to handle database operations using Prisma ORM
 * 
 * This service provides a clean abstraction over the Prisma ORM, offering
 * methods for common database operations related to character management.
 * 
 * @example
 * ```typescript
 * // Get all characters
 * const characters = await PrismaService.getAllCharacters();
 * 
 * // Add a new character
 * const newCharacter = await PrismaService.addCharacter({
 *   system: GameSystem.DND5E,
 *   prompt: 'A brave warrior',
 *   character: { name: 'Aragorn', class: 'Fighter' },
 *   isNpc: false
 * });
 * ```
 */
export class PrismaService {
  /**
   * Get all characters from the database
   * 
   * Retrieves all characters ordered by creation date in descending order
   * (newest first).
   * 
   * @returns Promise resolving to an array of all characters
   * @throws Will throw an error if the database operation fails
   */
  static async getAllCharacters() {
    try {
      return await prisma.character.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      console.error('Error fetching characters from database:', error);
      throw error;
    }
  }

  /**
   * Get characters filtered by game system
   * 
   * @param system - The game system to filter by
   * @returns Promise resolving to an array of characters for the specified system
   * @throws Will throw an error if the database operation fails
   */
  static async getCharactersBySystem(system: GameSystem) {
    try {
      return await prisma.character.findMany({
        where: {
          system: system,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      console.error('Error fetching characters by system:', error);
      throw error;
    }
  }

  /**
   * Get characters filtered by NPC status
   * 
   * @param isNpc - Boolean indicating whether to fetch NPCs (true) or player characters (false)
   * @returns Promise resolving to an array of characters with the specified NPC status
   * @throws Will throw an error if the database operation fails
   */
  static async getCharactersByNpcStatus(isNpc: boolean) {
    try {
      return await prisma.character.findMany({
        where: {
          isNpc: isNpc,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      console.error('Error fetching characters by NPC status:', error);
      throw error;
    }
  }

  /**
   * Get a single character by its ID
   * 
   * @param id - The unique identifier of the character to retrieve
   * @returns Promise resolving to the character with the specified ID, or null if not found
   * @throws Will throw an error if the database operation fails
   */
  static async getCharacterById(id: string) {
    try {
      return await prisma.character.findUnique({
        where: {
          id: id,
        },
      });
    } catch (error) {
      console.error('Error fetching character by ID:', error);
      throw error;
    }
  }

  /**
   * Get the first PC (non-NPC character) from the database
   * 
   * Retrieves the most recently created player character (non-NPC).
   * 
   * @returns Promise resolving to the first PC found, or null if none exist
   * @throws Will throw an error if the database operation fails
   */
  static async getFirstPC() {
    try {
      return await prisma.character.findFirst({
        where: {
          isNpc: false,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      console.error('Error fetching first PC:', error);
      throw error;
    }
  }

  /**
   * Add a new character to the database
   * 
   * @param data - The character data to add
   * @param data.system - The game system for this character
   * @param data.prompt - The original prompt used to generate this character
   * @param data.character - The character data object
   * @param data.isNpc - Whether this character is an NPC
   * @returns Promise resolving to the created character record
   * @throws Will throw an error if the database operation fails
   */
  static async addCharacter(data: {
    system: GameSystem;
    prompt: string;
    character: CharacterData;
    isNpc: boolean;
  }) {
    try {
      return await prisma.character.create({
        data: {
          system: data.system,
          prompt: data.prompt,
          character: data.character,
          isNpc: data.isNpc,
        },
      });
    } catch (error) {
      console.error('Error adding character to database:', error);
      throw error;
    }
  }

  /**
   * Update an existing character in the database
   * 
   * @param id - The ID of the character to update
   * @param data - The character data updates
   * @returns Promise resolving to the updated character record
   * @throws Will throw an error if the database operation fails
   */
  static async updateCharacter(id: string, data: {
    system?: GameSystem;
    prompt?: string;
    character?: CharacterData;
    isNpc?: boolean;
  }) {
    try {
      return await prisma.character.update({
        where: {
          id: id,
        },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      console.error('Error updating character in database:', error);
      throw error;
    }
  }

  /**
   * Delete a character by its ID
   * 
   * @param id - The ID of the character to delete
   * @returns Promise resolving to the deleted character record
   * @throws Will throw an error if the database operation fails
   */
  static async deleteCharacter(id: string) {
    try {
      return await prisma.character.delete({
        where: {
          id: id,
        },
      });
    } catch (error) {
      console.error('Error deleting character from database:', error);
      throw error;
    }
  }

  /**
   * Get the total count of characters in the database
   * 
   * @returns Promise resolving to the number of characters stored
   * @throws Will throw an error if the database operation fails
   */
  static async getCharacterCount() {
    try {
      return await prisma.character.count();
    } catch (error) {
      console.error('Error getting character count:', error);
      throw error;
    }
  }

  /**
   * Search characters by prompt or character name
   * 
   * Performs a case-insensitive search across character prompts and names.
   * 
   * @param searchTerm - The term to search for
   * @returns Promise resolving to an array of matching characters
   * @throws Will throw an error if the database operation fails
   */
  static async searchCharacters(searchTerm: string) {
    try {
      return await prisma.character.findMany({
        where: {
          OR: [
            {
              prompt: {
                contains: searchTerm,
                mode: 'insensitive',
              },
            },
            {
              character: {
                path: '$.name',
                string_contains: searchTerm,
              } as any, // Type assertion to work with JSON path
            },
          ],
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
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
  static async getCharactersByDateRange(startDate: Date, endDate: Date) {
    try {
      return await prisma.character.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      console.error('Error getting characters by date range:', error);
      throw error;
    }
  }

  /**
   * Close the Prisma client connection
   * 
   * Properly disconnects from the database, releasing any resources.
   * 
   * @returns Promise that resolves when disconnection is complete
   */
  static async disconnect() {
    await prisma.$disconnect();
  }
}