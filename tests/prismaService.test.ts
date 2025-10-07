// Test for Prisma service
// Mock the Prisma client before importing the service
const mockCharacter = {
  findMany: jest.fn(),
  findUnique: jest.fn(),
  findFirst: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  count: jest.fn(),
};

const mockPrismaClient = {
  character: mockCharacter,
  $disconnect: jest.fn(),
};

jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
  };
});

import { PrismaService } from '../src/lib/services/prismaService';
import { GameSystem } from '../src/types';

describe('PrismaService', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Mock console methods to avoid cluttering test output
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore console methods after each test
    jest.restoreAllMocks();
  });

  test('should export all service functions', () => {
    // Just verify that all functions exist and are exported
    expect(typeof PrismaService.getAllCharacters).toBe('function');
    expect(typeof PrismaService.getCharacterById).toBe('function');
    expect(typeof PrismaService.getCharactersBySystem).toBe('function');
    expect(typeof PrismaService.getCharactersByNpcStatus).toBe('function');
    expect(typeof PrismaService.getFirstPC).toBe('function');
    expect(typeof PrismaService.addCharacter).toBe('function');
    expect(typeof PrismaService.updateCharacter).toBe('function');
    expect(typeof PrismaService.deleteCharacter).toBe('function');
    expect(typeof PrismaService.getCharacterCount).toBe('function');
    expect(typeof PrismaService.searchCharacters).toBe('function');
    expect(typeof PrismaService.getCharactersByDateRange).toBe('function');
    expect(typeof PrismaService.disconnect).toBe('function');
  });

  test('should call getAllCharacters and return characters', async () => {
    // Mock return value
    const mockCharacters = [
      {
        id: '1',
        system: GameSystem.DND5E,
        prompt: 'A brave warrior',
        character: { name: 'Aragorn', class: 'Fighter' },
        isNpc: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    
    mockCharacter.findMany.mockResolvedValue(mockCharacters);

    const result = await PrismaService.getAllCharacters();
    
    expect(result).toEqual(mockCharacters);
    expect(mockCharacter.findMany).toHaveBeenCalledWith({
      orderBy: {
        createdAt: 'desc',
      },
    });
  });

  test('should call getCharacterById and return a character', async () => {
    const mockCharacterData = {
      id: '1',
      system: GameSystem.DND5E,
      prompt: 'A brave warrior',
      character: { name: 'Aragorn', class: 'Fighter' },
      isNpc: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    mockCharacter.findUnique.mockResolvedValue(mockCharacterData);

    const result = await PrismaService.getCharacterById('1');
    
    expect(result).toEqual(mockCharacterData);
    expect(mockCharacter.findUnique).toHaveBeenCalledWith({
      where: {
        id: '1',
      },
    });
  });

  test('should call getCharactersBySystem and return characters from a specific system', async () => {
    const mockCharacters = [
      {
        id: '1',
        system: GameSystem.DND5E,
        prompt: 'A brave warrior',
        character: { name: 'Aragorn', class: 'Fighter' },
        isNpc: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    
    mockCharacter.findMany.mockResolvedValue(mockCharacters);

    const result = await PrismaService.getCharactersBySystem(GameSystem.DND5E);
    
    expect(result).toEqual(mockCharacters);
    expect(mockCharacter.findMany).toHaveBeenCalledWith({
      where: {
        system: GameSystem.DND5E,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  });

  test('should call getCharactersByNpcStatus and return characters with specific NPC status', async () => {
    const mockCharacters = [
      {
        id: '1',
        system: GameSystem.DND5E,
        prompt: 'A brave warrior',
        character: { name: 'Aragorn', class: 'Fighter' },
        isNpc: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    
    mockCharacter.findMany.mockResolvedValue(mockCharacters);

    const result = await PrismaService.getCharactersByNpcStatus(false);
    
    expect(result).toEqual(mockCharacters);
    expect(mockCharacter.findMany).toHaveBeenCalledWith({
      where: {
        isNpc: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  });

  test('should call getFirstPC and return the first non-NPC character', async () => {
    const mockCharacterData = {
      id: '1',
      system: GameSystem.DND5E,
      prompt: 'A brave warrior',
      character: { name: 'Aragorn', class: 'Fighter' },
      isNpc: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    mockCharacter.findFirst.mockResolvedValue(mockCharacterData);

    const result = await PrismaService.getFirstPC();
    
    expect(result).toEqual(mockCharacterData);
    expect(mockCharacter.findFirst).toHaveBeenCalledWith({
      where: {
        isNpc: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  });

  test('should call addCharacter and create a new character', async () => {
    const newCharacterData = {
      system: GameSystem.DND5E,
      prompt: 'A brave warrior',
      character: { name: 'Aragorn', class: 'Fighter' },
      isNpc: false,
    };
    
    const expectedReturn = {
      id: '2',
      ...newCharacterData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    mockCharacter.create.mockResolvedValue(expectedReturn);

    const result = await PrismaService.addCharacter(newCharacterData);
    
    expect(result).toEqual(expectedReturn);
    expect(mockCharacter.create).toHaveBeenCalledWith({
      data: newCharacterData,
    });
  });

  test('should call updateCharacter and update an existing character', async () => {
    const updateData = {
      prompt: 'Updated prompt',
      character: { name: 'Updated Aragorn', class: 'Fighter' },
    };
    
    const expectedReturn = {
      id: '1',
      system: GameSystem.DND5E,
      ...updateData,
      isNpc: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    mockCharacter.update.mockResolvedValue(expectedReturn);

    const result = await PrismaService.updateCharacter('1', updateData);
    
    expect(result).toEqual(expectedReturn);
    expect(mockCharacter.update).toHaveBeenCalledWith({
      where: {
        id: '1',
      },
      data: {
        ...updateData,
        updatedAt: expect.any(Date),
      },
    });
  });

  test('should call deleteCharacter and remove a character', async () => {
    mockCharacter.delete.mockResolvedValue({ count: 1 });

    await PrismaService.deleteCharacter('1');
    
    expect(mockCharacter.delete).toHaveBeenCalledWith({
      where: {
        id: '1',
      },
    });
  });

  test('should call getCharacterCount and return the count', async () => {
    mockCharacter.count.mockResolvedValue(5);

    const result = await PrismaService.getCharacterCount();
    
    expect(result).toEqual(5);
    expect(mockCharacter.count).toHaveBeenCalled();
  });

  test('should call searchCharacters and return matching characters', async () => {
    const mockCharacters = [
      {
        id: '1',
        system: GameSystem.DND5E,
        prompt: 'A brave warrior',
        character: { name: 'Aragorn', class: 'Fighter' },
        isNpc: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    
    mockCharacter.findMany.mockResolvedValue(mockCharacters);

    const result = await PrismaService.searchCharacters('brave');
    
    expect(result).toEqual(mockCharacters);
    expect(mockCharacter.findMany).toHaveBeenCalledWith({
      where: {
        OR: [
          {
            prompt: {
              contains: 'brave',
              mode: 'insensitive',
            },
          },
          {
            character: {
              path: '$.name',
              string_contains: 'brave',
            } as any, // Type assertion to work with JSON path
          },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  });

  test('should call getCharactersByDateRange and return characters in date range', async () => {
    const mockCharacters = [
      {
        id: '1',
        system: GameSystem.DND5E,
        prompt: 'A brave warrior',
        character: { name: 'Aragorn', class: 'Fighter' },
        isNpc: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    
    const startDate = new Date('2023-01-01');
    const endDate = new Date('2023-12-31');
    
    mockCharacter.findMany.mockResolvedValue(mockCharacters);

    const result = await PrismaService.getCharactersByDateRange(startDate, endDate);
    
    expect(result).toEqual(mockCharacters);
    expect(mockCharacter.findMany).toHaveBeenCalledWith({
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
  });

  test('should call disconnect and close the database connection', async () => {
    mockPrismaClient.$disconnect.mockResolvedValue(undefined);

    await PrismaService.disconnect();
    
    expect(mockPrismaClient.$disconnect).toHaveBeenCalled();
  });

  test('should handle error when getAllCharacters fails', async () => {
    mockCharacter.findMany.mockRejectedValue(new Error('Database error'));

    await expect(PrismaService.getAllCharacters()).rejects.toThrow('Database error');
    
    expect(console.error).toHaveBeenCalledWith('Error fetching characters from database:', expect.any(Error));
    expect(mockCharacter.findMany).toHaveBeenCalledWith({
      orderBy: {
        createdAt: 'desc',
      },
    });
  });

  test('should handle error when getCharacterById fails', async () => {
    mockCharacter.findUnique.mockRejectedValue(new Error('Database error'));

    await expect(PrismaService.getCharacterById('1')).rejects.toThrow('Database error');
    
    expect(console.error).toHaveBeenCalledWith('Error fetching character by ID:', expect.any(Error));
    expect(mockCharacter.findUnique).toHaveBeenCalledWith({
      where: {
        id: '1',
      },
    });
  });

  test('should handle error when getCharactersBySystem fails', async () => {
    mockCharacter.findMany.mockRejectedValue(new Error('Database error'));

    await expect(PrismaService.getCharactersBySystem(GameSystem.DND5E)).rejects.toThrow('Database error');
    
    expect(console.error).toHaveBeenCalledWith('Error fetching characters by system:', expect.any(Error));
    expect(mockCharacter.findMany).toHaveBeenCalledWith({
      where: {
        system: GameSystem.DND5E,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  });

  test('should handle error when getCharactersByNpcStatus fails', async () => {
    mockCharacter.findMany.mockRejectedValue(new Error('Database error'));

    await expect(PrismaService.getCharactersByNpcStatus(false)).rejects.toThrow('Database error');
    
    expect(console.error).toHaveBeenCalledWith('Error fetching characters by NPC status:', expect.any(Error));
    expect(mockCharacter.findMany).toHaveBeenCalledWith({
      where: {
        isNpc: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  });

  test('should handle error when getFirstPC fails', async () => {
    mockCharacter.findFirst.mockRejectedValue(new Error('Database error'));

    await expect(PrismaService.getFirstPC()).rejects.toThrow('Database error');
    
    expect(console.error).toHaveBeenCalledWith('Error fetching first PC:', expect.any(Error));
    expect(mockCharacter.findFirst).toHaveBeenCalledWith({
      where: {
        isNpc: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  });

  test('should handle error when addCharacter fails', async () => {
    const newCharacterData = {
      system: GameSystem.DND5E,
      prompt: 'A brave warrior',
      character: { name: 'Aragorn', class: 'Fighter' },
      isNpc: false,
    };
    
    mockCharacter.create.mockRejectedValue(new Error('Database error'));

    await expect(PrismaService.addCharacter(newCharacterData)).rejects.toThrow('Database error');
    
    expect(console.error).toHaveBeenCalledWith('Error adding character to database:', expect.any(Error));
    expect(mockCharacter.create).toHaveBeenCalledWith({
      data: newCharacterData,
    });
  });

  test('should handle error when updateCharacter fails', async () => {
    const updateData = {
      prompt: 'Updated prompt',
      character: { name: 'Updated Aragorn', class: 'Fighter' },
    };
    
    mockCharacter.update.mockRejectedValue(new Error('Database error'));

    await expect(PrismaService.updateCharacter('1', updateData)).rejects.toThrow('Database error');
    
    expect(console.error).toHaveBeenCalledWith('Error updating character in database:', expect.any(Error));
    expect(mockCharacter.update).toHaveBeenCalledWith({
      where: {
        id: '1',
      },
      data: {
        ...updateData,
        updatedAt: expect.any(Date),
      },
    });
  });

  test('should handle error when deleteCharacter fails', async () => {
    mockCharacter.delete.mockRejectedValue(new Error('Database error'));

    await expect(PrismaService.deleteCharacter('1')).rejects.toThrow('Database error');
    
    expect(console.error).toHaveBeenCalledWith('Error deleting character from database:', expect.any(Error));
    expect(mockCharacter.delete).toHaveBeenCalledWith({
      where: {
        id: '1',
      },
    });
  });

  test('should handle error when getCharacterCount fails', async () => {
    mockCharacter.count.mockRejectedValue(new Error('Database error'));

    await expect(PrismaService.getCharacterCount()).rejects.toThrow('Database error');
    
    expect(console.error).toHaveBeenCalledWith('Error getting character count:', expect.any(Error));
    expect(mockCharacter.count).toHaveBeenCalled();
  });

  test('should handle error when searchCharacters fails', async () => {
    mockCharacter.findMany.mockRejectedValue(new Error('Database error'));

    await expect(PrismaService.searchCharacters('brave')).rejects.toThrow('Database error');
    
    expect(console.error).toHaveBeenCalledWith('Error searching characters:', expect.any(Error));
    expect(mockCharacter.findMany).toHaveBeenCalledWith({
      where: {
        OR: [
          {
            prompt: {
              contains: 'brave',
              mode: 'insensitive',
            },
          },
          {
            character: {
              path: '$.name',
              string_contains: 'brave',
            } as any, // Type assertion to work with JSON path
          },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  });

  test('should handle error when getCharactersByDateRange fails', async () => {
    const startDate = new Date('2023-01-01');
    const endDate = new Date('2023-12-31');
    
    mockCharacter.findMany.mockRejectedValue(new Error('Database error'));

    await expect(PrismaService.getCharactersByDateRange(startDate, endDate)).rejects.toThrow('Database error');
    
    expect(console.error).toHaveBeenCalledWith('Error getting characters by date range:', expect.any(Error));
    expect(mockCharacter.findMany).toHaveBeenCalledWith({
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
  });

  test('should handle error when disconnect fails', async () => {
    mockPrismaClient.$disconnect.mockRejectedValue(new Error('Disconnect error'));

    await expect(PrismaService.disconnect()).rejects.toThrow('Disconnect error');
    
    expect(mockPrismaClient.$disconnect).toHaveBeenCalled();
  });
});