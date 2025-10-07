// Test for Pollinations example usage
import { 
  generateCharacterWithMedia, 
  generateCharactersWithImages, 
  getAvailableModels, 
  generateCharacterSuggestions, 
} from '../examples/pollinations-example';
import { GameSystem } from '../src/types';

// Mock the Pollinations service
jest.mock('../services/pollinationsService', () => {
  return {
    PollinationsService: {
      generateCharacter: jest.fn(),
      generateCharacterImage: jest.fn(),
      generateCharacterAudio: jest.fn(),
      getImageModels: jest.fn(),
      getTextModels: jest.fn(),
      generateTextGet: jest.fn(),
    },
  };
});

describe('Pollinations Example Usage', () => {
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

  test('should call generateCharacterWithMedia and return a character with media', async () => {
    // Mock return values
    const mockCharacter = {
      name: 'Aragorn',
      race: 'Human',
      class: 'Fighter',
      background: 'Soldier',
      alignment: 'Lawful Good',
      hitPoints: 20,
      armorClass: 18,
      speed: '30 ft',
      stats: {
        strength: 16,
        dexterity: 14,
        constitution: 15,
        intelligence: 10,
        wisdom: 12,
        charisma: 13,
      },
      skills: ['Athletics', 'Survival'],
      proficiencies: {
        weapons: ['Longsword', 'Shield'],
        armor: ['Chain Mail'],
        tools: ['Smith\'s tools'],
      },
      attacks: [
        {
          name: 'Longsword',
          bonus: '+6',
          damage: '1d8+3',
        },
      ],
      backstory: ['Saved a village from bandits', 'Travels with a mysterious elf'],
      appearance: ['Tall and muscular', 'Wears chain mail'],
      personality: ['Brave and honorable', 'Protects the innocent'],
      equipment: ['Longsword', 'Shield', 'Chain Mail'],
    };
    
    const mockImageBuffer = Buffer.from('fake-image-data');
    
    const { PollinationsService } = require('../services/pollinationsService');
    PollinationsService.generateCharacter.mockResolvedValue(mockCharacter);
    PollinationsService.generateCharacterImage.mockResolvedValue(mockImageBuffer);
    PollinationsService.generateCharacterAudio.mockResolvedValue(null); // Audio not available

    const result = await generateCharacterWithMedia(
      GameSystem.DND5E,
      'A brave warrior who is afraid of the dark',
    );
    
    expect(result).toEqual({
      character: mockCharacter,
      imageBuffer: mockImageBuffer,
      audioData: null,
    });
    expect(PollinationsService.generateCharacter).toHaveBeenCalledWith(
      GameSystem.DND5E,
      'A brave warrior who is afraid of the dark',
    );
    expect(PollinationsService.generateCharacterImage).toHaveBeenCalledWith(
      `Portrait of a ${mockCharacter.name}, A brave warrior who is afraid of the dark`,
    );
    expect(PollinationsService.generateCharacterAudio).toHaveBeenCalledWith(
      mockCharacter,
      'I will protect the innocent.',
    );
  });

  test('should call generateCharactersWithImages and return multiple characters with images', async () => {
    // Mock return values
    const mockCharacters = [
      {
        name: 'Aragorn',
        race: 'Human',
        class: 'Fighter',
        background: 'Soldier',
        alignment: 'Lawful Good',
        hitPoints: 20,
        armorClass: 18,
        speed: '30 ft',
        stats: {
          strength: 16,
          dexterity: 14,
          constitution: 15,
          intelligence: 10,
          wisdom: 12,
          charisma: 13,
        },
        skills: ['Athletics', 'Survival'],
        proficiencies: {
          weapons: ['Longsword', 'Shield'],
          armor: ['Chain Mail'],
          tools: ['Smith\'s tools'],
        },
        attacks: [
          {
            name: 'Longsword',
            bonus: '+6',
            damage: '1d8+3',
          },
        ],
        backstory: ['Saved a village from bandits', 'Travels with a mysterious elf'],
        appearance: ['Tall and muscular', 'Wears chain mail'],
        personality: ['Brave and honorable', 'Protects the innocent'],
        equipment: ['Longsword', 'Shield', 'Chain Mail'],
      },
      {
        name: 'Valerie',
        ancestry: 'Human',
        heritage: 'Skilled Heritage',
        background: 'Warrior',
        class: 'Champion',
        alignment: 'Lawful Good',
        hitPoints: 18,
        armorClass: 19,
        speed: '25 ft',
        attributes: {
          strength: 16,
          dexterity: 14,
          constitution: 15,
          intelligence: 10,
          wisdom: 12,
          charisma: 13,
        },
        skills: [{ name: 'Athletics', rank: 'Trained' }],
        attacks: [
          {
            name: 'Longsword',
            bonus: '+6',
            damage: '1d8+3',
          },
        ],
        backstory: ['Trained in martial arts', 'Serves a noble cause'],
        appearance: ['Athletic build', 'Wears plate armor'],
        personality: ['Courageous', 'Loyal to allies'],
        equipment: ['Longsword', 'Plate Armor', 'Shield'],
      },
    ];
    
    const mockImageBuffers = [
      Buffer.from('fake-image-data-1'),
      Buffer.from('fake-image-data-2'),
    ];
    
    const { PollinationsService } = require('../services/pollinationsService');
    PollinationsService.generateCharacter.mockResolvedValueOnce(mockCharacters[0]);
    PollinationsService.generateCharacter.mockResolvedValueOnce(mockCharacters[1]);
    PollinationsService.generateCharacterImage.mockResolvedValueOnce(mockImageBuffers[0]);
    PollinationsService.generateCharacterImage.mockResolvedValueOnce(mockImageBuffers[1]);

    const result = await generateCharactersWithImages(
      GameSystem.DND5E,
      [
        'A brave warrior who is afraid of the dark',
        'A cunning tiefling rogue with a heart of gold',
      ],
    );
    
    expect(result).toEqual([
      {
        character: mockCharacters[0],
        imageBuffer: mockImageBuffers[0],
      },
      {
        character: mockCharacters[1],
        imageBuffer: mockImageBuffers[1],
      },
    ]);
    expect(PollinationsService.generateCharacter).toHaveBeenCalledTimes(2);
    expect(PollinationsService.generateCharacterImage).toHaveBeenCalledTimes(2);
    expect(PollinationsService.generateCharacter).toHaveBeenCalledWith(
      GameSystem.DND5E,
      'A brave warrior who is afraid of the dark',
    );
    expect(PollinationsService.generateCharacter).toHaveBeenCalledWith(
      GameSystem.DND5E,
      'A cunning tiefling rogue with a heart of gold',
    );
  });

  test('should call getAvailableModels and return model information', async () => {
    // Mock return values
    const mockImageModels = ['flux', 'turbo', 'nanobanana', 'seedream'];
    const mockTextModels = [
      { name: 'openai', description: 'OpenAI GPT-5 Mini' },
      { name: 'gemini', description: 'Gemini 2.5 Flash Lite' },
    ];
    
    const { PollinationsService } = require('../services/pollinationsService');
    PollinationsService.getImageModels.mockResolvedValue(mockImageModels);
    PollinationsService.getTextModels.mockResolvedValue(mockTextModels);

    const result = await getAvailableModels();
    
    expect(result).toEqual({
      imageModels: mockImageModels,
      textModels: mockTextModels,
    });
    expect(PollinationsService.getImageModels).toHaveBeenCalled();
    expect(PollinationsService.getTextModels).toHaveBeenCalled();
  });

  test('should call generateCharacterSuggestions and return character concepts', async () => {
    // Mock return values
    const mockSuggestions = [
      'A brave warrior who is afraid of the dark',
      'A cunning tiefling rogue with a heart of gold',
      'A grizzled dwarven cleric who has lost their faith',
      'An elven wizard obsessed with forbidden knowledge',
      'A charismatic human bard who is secretly a spy',
    ];
    
    const { PollinationsService } = require('../services/pollinationsService');
    PollinationsService.generateTextGet.mockResolvedValue(mockSuggestions);

    const result = await generateCharacterSuggestions(GameSystem.DND5E);
    
    expect(result).toEqual(mockSuggestions);
    expect(PollinationsService.generateTextGet).toHaveBeenCalledWith({
      prompt: expect.stringContaining('Dungeons & Dragons 5th Edition'),
      model: 'openai',
      jsonMode: true,
    });
  });

  test('should handle error when generateCharacterWithMedia fails', async () => {
    // Mock error
    const { PollinationsService } = require('../services/pollinationsService');
    PollinationsService.generateCharacter.mockRejectedValue(new Error('API Error'));

    await expect(
      generateCharacterWithMedia(
        GameSystem.DND5E,
        'A brave warrior who is afraid of the dark',
      ),
    ).rejects.toThrow('Failed to generate character with Pollinations API.');
    
    expect(console.error).toHaveBeenCalledWith(
      'Failed to generate character with media:',
      expect.any(Error),
    );
    expect(PollinationsService.generateCharacter).toHaveBeenCalledWith(
      GameSystem.DND5E,
      'A brave warrior who is afraid of the dark',
    );
  });

  test('should handle error when generateCharactersWithImages fails', async () => {
    // Mock error
    const { PollinationsService } = require('../services/pollinationsService');
    PollinationsService.generateCharacter.mockRejectedValue(new Error('API Error'));

    await expect(
      generateCharactersWithImages(
        GameSystem.DND5E,
        ['A brave warrior who is afraid of the dark'],
      ),
    ).rejects.toThrow('Failed to generate characters with Pollinations API.');
    
    expect(console.error).toHaveBeenCalledWith(
      'Failed to generate characters with images:',
      expect.any(Error),
    );
    expect(PollinationsService.generateCharacter).toHaveBeenCalledWith(
      GameSystem.DND5E,
      'A brave warrior who is afraid of the dark',
    );
  });

  test('should handle error when getAvailableModels fails', async () => {
    // Mock error
    const { PollinationsService } = require('../services/pollinationsService');
    PollinationsService.getImageModels.mockRejectedValue(new Error('API Error'));

    await expect(getAvailableModels()).rejects.toThrow(
      'Failed to get available models from Pollinations API.',
    );
    
    expect(console.error).toHaveBeenCalledWith(
      'Failed to get available models:',
      expect.any(Error),
    );
    expect(PollinationsService.getImageModels).toHaveBeenCalled();
  });

  test('should handle error when generateCharacterSuggestions fails', async () => {
    // Mock error
    const { PollinationsService } = require('../services/pollinationsService');
    PollinationsService.generateTextGet.mockRejectedValue(new Error('API Error'));

    await expect(generateCharacterSuggestions(GameSystem.DND5E)).rejects.toThrow(
      'Failed to generate character suggestions with Pollinations API.',
    );
    
    expect(console.error).toHaveBeenCalledWith(
      'Failed to generate character suggestions:',
      expect.any(Error),
    );
    expect(PollinationsService.generateTextGet).toHaveBeenCalledWith({
      prompt: expect.stringContaining('Dungeons & Dragons 5th Edition'),
      model: 'openai',
      jsonMode: true,
    });
  });
});