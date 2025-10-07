// Test for Database service
import { DatabaseService } from '../services/databaseService';

// Mock the database
jest.mock('../database', () => {
  const mockCharacters = {
    toArray: jest.fn(),
    orderBy: jest.fn().mockReturnThis(),
    reverse: jest.fn().mockReturnThis(),
    add: jest.fn(),
    bulkPut: jest.fn(),
    get: jest.fn(),
    filter: jest.fn().mockReturnThis(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  };

  return {
    db: {
      characters: mockCharacters,
    },
    DbStoredCharacter: jest.fn(),
  };
});

describe('DatabaseService', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('should call getAllCharacters and return characters', async () => {
    // Mock return value
    const mockStoredCharacters = [
      {
        id: '1',
        system: 'dnd5e',
        prompt: 'A brave warrior',
        character: { name: 'Aragorn', class: 'Fighter' },
        isNpc: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];
    
    const { db } = require('../database');
    db.characters.toArray.mockResolvedValue(mockStoredCharacters);

    const result = await DatabaseService.getAllCharacters();
    
    expect(result).toEqual(mockStoredCharacters);
    expect(db.characters.orderBy).toHaveBeenCalledWith('createdAt');
    expect(db.characters.reverse).toHaveBeenCalled();
    expect(db.characters.toArray).toHaveBeenCalled();
  });

  test('should call getCharacterById and return a character', async () => {
    const mockStoredCharacter = {
      id: '1',
      system: 'dnd5e',
      prompt: 'A brave warrior',
      character: { name: 'Aragorn', class: 'Fighter' },
      isNpc: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const { db } = require('../database');
    db.characters.get.mockResolvedValue(mockStoredCharacter);

    const result = await DatabaseService.getCharacterById('1');
    
    expect(result).toEqual(mockStoredCharacter);
    expect(db.characters.get).toHaveBeenCalledWith('1');
  });

  test('should call addCharacter and create a new character', async () => {
    const newCharacterData = {
      system: 'dnd5e',
      prompt: 'A wise wizard',
      character: { name: 'Gandalf', class: 'Wizard' },
      isNpc: false,
    };
    
    const expectedReturn = {
      id: '2',
      ...newCharacterData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const { db } = require('../database');
    db.characters.add.mockResolvedValue(expectedReturn);

    const result = await DatabaseService.addCharacter(newCharacterData);
    
    expect(result).toEqual(expectedReturn);
    expect(db.characters.add).toHaveBeenCalled();
  });

  test('should call bulkUpsert and update existing characters', async () => {
    // Use the same timestamp for both objects to avoid timing issues
    const timestamp = new Date();
    const charactersToUpdate = [
      {
        id: '1',
        system: 'dnd5e',
        prompt: 'A brave warrior',
        character: { name: 'Aragorn', class: 'Fighter' },
        isNpc: false,
        createdAt: timestamp,
        updatedAt: timestamp,
      }
    ];
    
    const { db } = require('../database');
    db.characters.bulkPut.mockResolvedValue(undefined);

    await DatabaseService.bulkUpsert(charactersToUpdate);
    
    expect(db.characters.bulkPut).toHaveBeenCalledWith([
      {
        id: '1',
        system: 'dnd5e',
        prompt: 'A brave warrior',
        character: { name: 'Aragorn', class: 'Fighter' },
        isNpc: false,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date), // Updated with current timestamp
      }
    ]);
  });

  test('should call deleteCharacter and remove a character', async () => {
    const { db } = require('../database');
    db.characters.delete.mockResolvedValue(1);

    await DatabaseService.deleteCharacter('1');
    
    expect(db.characters.delete).toHaveBeenCalledWith('1');
  });

  test('should call getCharacterCount and return the count', async () => {
    const { db } = require('../database');
    db.characters.count.mockResolvedValue(5);

    const result = await DatabaseService.getCharacterCount();
    
    expect(result).toEqual(5);
    expect(db.characters.count).toHaveBeenCalled();
  });

  test('should call searchCharacters and return matching characters', async () => {
    const mockStoredCharacters = [
      {
        id: '1',
        system: 'dnd5e',
        prompt: 'A brave warrior',
        character: { name: 'Aragorn', class: 'Fighter' },
        isNpc: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];
    
    const { db } = require('../database');
    db.characters.toArray.mockResolvedValue(mockStoredCharacters);

    const result = await DatabaseService.searchCharacters('brave');
    
    expect(result).toEqual(mockStoredCharacters);
    expect(db.characters.filter).toHaveBeenCalled();
    expect(db.characters.toArray).toHaveBeenCalled();
  });
});