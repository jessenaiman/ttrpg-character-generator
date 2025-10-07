import { prisma } from '@/lib/db/prisma-client';
import { GameSystem } from '@/types';

export interface PrismaStoredCharacter {
  id: string
  system: string
  prompt: string
  character: any
  isNpc: boolean
  createdAt: Date
  updatedAt: Date
}

/**
 * Database service using Prisma with SQLite
 * Replaces localStorage functionality with persistent database storage
 */
export class PrismaDatabaseService {
  /**
   * Get all characters from the database
   */
  static async getAllCharacters(): Promise<PrismaStoredCharacter[]> {
    try {
      return await prisma.character.findMany({
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      console.error('Error fetching characters:', error);
      throw error;
    }
  }

  /**
   * Get characters filtered by game system
   */
  static async getCharactersBySystem(system: GameSystem): Promise<PrismaStoredCharacter[]> {
    try {
      return await prisma.character.findMany({
        where: { system: system },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      console.error('Error fetching characters by system:', error);
      throw error;
    }
  }

  /**
   * Get characters filtered by NPC status
   */
  static async getCharactersByNpcStatus(isNpc: boolean): Promise<PrismaStoredCharacter[]> {
    try {
      return await prisma.character.findMany({
        where: { isNpc },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      console.error('Error fetching characters by NPC status:', error);
      throw error;
    }
  }

  /**
   * Get a single character by its ID
   */
  static async getCharacterById(id: string): Promise<PrismaStoredCharacter | null> {
    try {
      return await prisma.character.findUnique({
        where: { id },
      });
    } catch (error) {
      console.error('Error fetching character by ID:', error);
      throw error;
    }
  }

  /**
   * Add a new character to the database
   */
  static async addCharacter(character: {
    system: GameSystem
    prompt: string
    character: any
    isNpc: boolean
  }): Promise<PrismaStoredCharacter> {
    try {
      return await prisma.character.create({
        data: character,
      });
    } catch (error) {
      console.error('Error adding character:', error);
      throw error;
    }
  }

  /**
   * Update an existing character in the database
   */
  static async updateCharacter(id: string, updates: Partial<{
    system: GameSystem
    prompt: string
    character: any
    isNpc: boolean
  }>): Promise<PrismaStoredCharacter> {
    try {
      return await prisma.character.update({
        where: { id },
        data: updates,
      });
    } catch (error) {
      console.error('Error updating character:', error);
      throw error;
    }
  }

  /**
   * Delete a character from the database by its ID
   */
  static async deleteCharacter(id: string): Promise<void> {
    try {
      await prisma.character.delete({
        where: { id },
      });
    } catch (error) {
      console.error('Error deleting character:', error);
      throw error;
    }
  }

  /**
   * Search characters by name or content
   */
  static async searchCharacters(searchTerm: string): Promise<PrismaStoredCharacter[]> {
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
                path: ['name'],
                string_contains: searchTerm,
              },
            },
          ],
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      console.error('Error searching characters:', error);
      throw error;
    }
  }

  /**
   * Get the total count of characters in the database
   */
  static async getCharacterCount(): Promise<number> {
    try {
      return await prisma.character.count();
    } catch (error) {
      console.error('Error getting character count:', error);
      throw error;
    }
  }

  /**
   * Clear all characters from the database (useful for testing)
   */
  static async clearAllCharacters(): Promise<void> {
    try {
      await prisma.character.deleteMany();
    } catch (error) {
      console.error('Error clearing all characters:', error);
      throw error;
    }
  }
}