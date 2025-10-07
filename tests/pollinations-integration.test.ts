// Test for Pollinations integration example
import { 
  generateCharacterWithImage, 
  generateCharactersWithImages, 
  getAvailableModels, 
  generateCharacterSuggestions 
} from '../examples/pollinations-integration';
import { GameSystem } from '../types';

// Mock the Pollinations client
jest.mock('pollinations', () => {
  return jest.fn().mockImplementation(() => {
    return {
      images: {
        generateImage: jest.fn(),
        getModels: jest.fn(),
      },
      llm: {
        generateTextGet: jest.fn(),
        generateTextPost: jest.fn(),
        getModels: jest.fn(),
      },
    };
  });
});

describe('Pollinations Integration Example', () => {
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

  test('should export all integration functions', () => {
    // Just verify that all functions exist and are exported
    expect(typeof generateCharacterWithImage).toBe('function');
    expect(typeof generateCharactersWithImages).toBe('function');
    expect(typeof getAvailableModels).toBe('function');
    expect(typeof generateCharacterSuggestions).toBe('function');
  });

  test('should call generateCharacterWithImage and return a character with image', async () => {
    // Mock return values
    const mockResponse = `
{
  "name": "Aragorn",
  "race": "Human",
  "class": "Fighter",
  "background": "Soldier",
  "alignment": "Lawful Good",
  "hitPoints": 20,
  "armorClass": 18,
  "speed": "30 ft",
  "stats": {
    "strength": 16,
    "dexterity": 14,
    "constitution": 15,
    "intelligence": 10,
    "wisdom": 12,
    "charisma": 13
  },
  "skills": ["Athletics", "Survival"],
  "proficiencies": {
    "weapons": ["Longsword", "Shield"],
    "armor": ["Chain Mail"],
    "tools": ["Smith's tools"]
  },
  "attacks": [
    {
      "name": "Longsword",
      "bonus": "+6",
      "damage": "1d8+3"
    }
  ],
  "backstory": ["Saved a village from bandits", "Travels with a mysterious elf"],
  "appearance": ["Tall and muscular", "Wears chain mail"],
  "personality": ["Brave and honorable", "Protects the innocent"],
  "equipment": ["Longsword", "Shield", "Chain Mail"]
}`;

    const mockImageBuffer = Buffer.from('fake-image-data');
    
    const Pollinations = require('pollinations');
    const mockPollinations = new Pollinations();
    mockPollinations.llm.generateTextGet.mockResolvedValue(mockResponse);
    mockPollinations.images.generateImage.mockResolvedValue(mockImageBuffer);

    const result = await generateCharacterWithImage(
      GameSystem.DND5E,
      'A brave warrior who is afraid of the dark'
    );
    
    expect(result).toEqual({
      character: {
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
      imageBuffer: mockImageBuffer,
    });
    expect(mockPollinations.llm.generateTextGet).toHaveBeenCalledWith({
      prompt: expect.stringContaining('Dungeons & Dragons 5th Edition'),
      model: 'openai',
      jsonMode: true,
    });
    expect(mockPollinations.images.generateImage).toHaveBeenCalledWith({
      prompt: expect.stringContaining('Aragorn'),
      model: 'flux',
      width: 512,
      height: 512,
    });
  });

  test('should call generateCharactersWithImages and return multiple characters with images', async () => {
    // Mock return values
    const mockResponses = [
      `
{
  "name": "Aragorn",
  "race": "Human",
  "class": "Fighter",
  "background": "Soldier",
  "alignment": "Lawful Good",
  "hitPoints": 20,
  "armorClass": 18,
  "speed": "30 ft",
  "stats": {
    "strength": 16,
    "dexterity": 14,
    "constitution": 15,
    "intelligence": 10,
    "wisdom": 12,
    "charisma": 13
  },
  "skills": ["Athletics", "Survival"],
  "proficiencies": {
    "weapons": ["Longsword", "Shield"],
    "armor": ["Chain Mail"],
    "tools": ["Smith's tools"]
  },
  "attacks": [
    {
      "name": "Longsword",
      "bonus": "+6",
      "damage": "1d8+3"
    }
  ],
  "backstory": ["Saved a village from bandits", "Travels with a mysterious elf"],
  "appearance": ["Tall and muscular", "Wears chain mail"],
  "personality": ["Brave and honorable", "Protects the innocent"],
  "equipment": ["Longsword", "Shield", "Chain Mail"]
}`,
      `
{
  "name": "Valerie",
  "ancestry": "Human",
  "heritage": "Skilled Heritage",
  "background": "Warrior",
  "class": "Champion",
  "alignment": "Lawful Good",
  "hitPoints": 18,
  "armorClass": 19,
  "speed": "25 ft",
  "attributes": {
    "strength": 16,
    "dexterity": 14,
    "constitution": 15,
    "intelligence": 10,
    "wisdom": 12,
    "charisma": 13
  },
  "skills": [{"name": "Athletics", "rank": "Trained"}],
  "attacks": [
    {
      "name": "Longsword",
      "bonus": "+6",
      "damage": "1d8+3"
    }
  ],
  "backstory": ["Trained in martial arts", "Serves a noble cause"],
  "appearance": ["Athletic build", "Wears plate armor"],
  "personality": ["Courageous", "Loyal to allies"],
  "equipment": ["Longsword", "Plate Armor", "Shield"]
}`,
      `
{
  "name": "Scarlett",
  "playbook": "Cutter",
  "heritage": "Skovlander",
  "background": "Laborer",
  "vice": "Gambling",
  "purveyor": "Friendly bookie",
  "appearance": ["Tattoos on arms", "Scar across cheek"],
  "aliases": ["Red"],
  "attributes": {
    "insight": 2,
    "prowess": 3,
    "resolve": 2
  },
  "actionRatings": [
    {"action": "Prowl", "rating": 3},
    {"action": "Skirmish", "rating": 2}
  ],
  "specialAbilities": ["Dangerous Reflexes"],
  "friends": ["Olivia the Whisper"],
  "drives": ["Protect my crew", "Get rich"],
  "gear": [
    {"name": "Fine hand weapon", "load": 1},
    {"name": "Scary weapon or tool", "load": 2}
  ],
  "harm": {
    "level3": "",
    "level2": "Gut shot",
    "level1": ""
  }
}`
    ];

    const mockImageBuffers = [
      Buffer.from('fake-image-data-1'),
      Buffer.from('fake-image-data-2'),
      Buffer.from('fake-image-data-3'),
    ];
    
    const Pollinations = require('pollinations');
    const mockPollinations = new Pollinations();
    mockPollinations.llm.generateTextGet
      .mockResolvedValueOnce(mockResponses[0])
      .mockResolvedValueOnce(mockResponses[1])
      .mockResolvedValueOnce(mockResponses[2]);
    mockPollinations.images.generateImage
      .mockResolvedValueOnce(mockImageBuffers[0])
      .mockResolvedValueOnce(mockImageBuffers[1])
      .mockResolvedValueOnce(mockImageBuffers[2]);

    const result = await generateCharactersWithImages(
      GameSystem.DND5E,
      [
        'A brave warrior who is afraid of the dark',
        'A cunning tiefling rogue with a heart of gold',
        'A grizzled dwarven cleric who has lost their faith',
      ]
    );
    
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({
      character: expect.objectContaining({ name: 'Aragorn' }),
      imageBuffer: mockImageBuffers[0],
    });
    expect(result[1]).toEqual({
      character: expect.objectContaining({ name: 'Valerie' }),
      imageBuffer: mockImageBuffers[1],
    });
    expect(result[2]).toEqual({
      character: expect.objectContaining({ name: 'Scarlett' }),
      imageBuffer: mockImageBuffers[2],
    });
    expect(mockPollinations.llm.generateTextGet).toHaveBeenCalledTimes(3);
    expect(mockPollinations.images.generateImage).toHaveBeenCalledTimes(3);
  });

  test('should call getAvailableModels and return model information', async () => {
    // Mock return values
    const mockImageModels = ['flux', 'turbo', 'nanobanana', 'seedream'];
    const mockTextModels = [
      { name: 'openai', description: 'OpenAI GPT-5 Mini' },
      { name: 'gemini', description: 'Gemini 2.5 Flash Lite' },
    ];
    
    const Pollinations = require('pollinations');
    const mockPollinations = new Pollinations();
    mockPollinations.images.getModels.mockResolvedValue(mockImageModels);
    mockPollinations.llm.getModels.mockResolvedValue(mockTextModels);

    const result = await getAvailableModels();
    
    expect(result).toEqual({
      imageModels: mockImageModels,
      textModels: mockTextModels,
    });
    expect(mockPollinations.images.getModels).toHaveBeenCalled();
    expect(mockPollinations.llm.getModels).toHaveBeenCalled();
  });

  test('should call generateCharacterSuggestions and return character concepts', async () => {
    // Mock return values
    const mockSuggestions = [
      'A stoic half-orc barbarian who is afraid of the dark',
      'A cunning tiefling rogue with a heart of gold',
      'A grizzled dwarven cleric who has lost their faith',
      'An elven wizard obsessed with forbidden knowledge',
      'A charismatic human bard who is secretly a spy',
    ];
    
    const Pollinations = require('pollinations');
    const mockPollinations = new Pollinations();
    mockPollinations.llm.generateTextGet.mockResolvedValue(JSON.stringify(mockSuggestions));

    const result = await generateCharacterSuggestions(GameSystem.DND5E);
    
    expect(result).toEqual(mockSuggestions);
    expect(mockPollinations.llm.generateTextGet).toHaveBeenCalledWith({
      prompt: expect.stringContaining('Dungeons & Dragons 5th Edition'),
      model: 'openai',
      jsonMode: true,
    });
  });

  test('should handle error when generateCharacterWithImage fails', async () => {
    // Mock error
    const Pollinations = require('pollinations');
    const mockPollinations = new Pollinations();
    mockPollinations.llm.generateTextGet.mockRejectedValue(new Error('API Error'));

    await expect(
      generateCharacterWithImage(
        GameSystem.DND5E,
        'A brave warrior who is afraid of the dark'
      )
    ).rejects.toThrow('Failed to generate character with Pollinations API.');
    
    expect(console.error).toHaveBeenCalledWith('Failed to generate character with Pollinations:', expect.any(Error));
    expect(mockPollinations.llm.generateTextGet).toHaveBeenCalledWith({
      prompt: expect.stringContaining('Dungeons & Dragons 5th Edition'),
      model: 'openai',
      jsonMode: true,
    });
  });

  test('should handle error when generateCharactersWithImages fails', async () => {
    // Mock error
    const Pollinations = require('pollinations');
    const mockPollinations = new Pollinations();
    mockPollinations.llm.generateTextGet.mockRejectedValue(new Error('API Error'));

    await expect(
      generateCharactersWithImages(
        GameSystem.DND5E,
        ['A brave warrior who is afraid of the dark']
      )
    ).rejects.toThrow('Failed to generate characters with Pollinations API.');
    
    expect(console.error).toHaveBeenCalledWith('Failed to generate characters with images:', expect.any(Error));
    expect(mockPollinations.llm.generateTextGet).toHaveBeenCalledWith({
      prompt: expect.stringContaining('Dungeons & Dragons 5th Edition'),
      model: 'openai',
      jsonMode: true,
    });
  });

  test('should handle error when getAvailableModels fails', async () => {
    // Mock error
    const Pollinations = require('pollinations');
    const mockPollinations = new Pollinations();
    mockPollinations.images.getModels.mockRejectedValue(new Error('API Error'));

    await expect(getAvailableModels()).rejects.toThrow('Failed to get available models from Pollinations API.');
    
    expect(console.error).toHaveBeenCalledWith('Failed to get available models:', expect.any(Error));
    expect(mockPollinations.images.getModels).toHaveBeenCalled();
    expect(mockPollinations.llm.getModels).toHaveBeenCalled();
  });

  test('should handle error when generateCharacterSuggestions fails', async () => {
    // Mock error
    const Pollinations = require('pollinations');
    const mockPollinations = new Pollinations();
    mockPollinations.llm.generateTextGet.mockRejectedValue(new Error('API Error'));

    await expect(generateCharacterSuggestions(GameSystem.DND5E)).rejects.toThrow('Failed to generate character suggestions with Pollinations API.');
    
    expect(console.error).toHaveBeenCalledWith('Failed to generate character suggestions:', expect.any(Error));
    expect(mockPollinations.llm.generateTextGet).toHaveBeenCalledWith({
      prompt: expect.stringContaining('Dungeons & Dragons 5th Edition'),
      model: 'openai',
      jsonMode: true,
    });
  });

  test('should handle error when parsing JSON response fails', async () => {
    // Mock invalid JSON response
    const mockResponse = '{ invalid json }';
    
    const Pollinations = require('pollinations');
    const mockPollinations = new Pollinations();
    mockPollinations.llm.generateTextGet.mockResolvedValue(mockResponse);

    await expect(
      generateCharacterWithImage(
        GameSystem.DND5E,
        'A brave warrior who is afraid of the dark'
      )
    ).rejects.toThrow('Received an invalid format from the API.');
    
    expect(console.error).toHaveBeenCalledWith('Failed to parse JSON response:', mockResponse, expect.any(Error));
    expect(mockPollinations.llm.generateTextGet).toHaveBeenCalledWith({
      prompt: expect.stringContaining('Dungeons & Dragons 5th Edition'),
      model: 'openai',
      jsonMode: true,
    });
  });

  test('should handle error when generating character image fails', async () => {
    // Mock return value for character generation but error for image generation
    const mockResponse = `
{
  "name": "Aragorn",
  "race": "Human",
  "class": "Fighter",
  "background": "Soldier",
  "alignment": "Lawful Good",
  "hitPoints": 20,
  "armorClass": 18,
  "speed": "30 ft",
  "stats": {
    "strength": 16,
    "dexterity": 14,
    "constitution": 15,
    "intelligence": 10,
    "wisdom": 12,
    "charisma": 13
  },
  "skills": ["Athletics", "Survival"],
  "proficiencies": {
    "weapons": ["Longsword", "Shield"],
    "armor": ["Chain Mail"],
    "tools": ["Smith's tools"]
  },
  "attacks": [
    {
      "name": "Longsword",
      "bonus": "+6",
      "damage": "1d8+3"
    }
  ],
  "backstory": ["Saved a village from bandits", "Travels with a mysterious elf"],
  "appearance": ["Tall and muscular", "Wears chain mail"],
  "personality": ["Brave and honorable", "Protects the innocent"],
  "equipment": ["Longsword", "Shield", "Chain Mail"]
}`;

    const Pollinations = require('pollinations');
    const mockPollinations = new Pollinations();
    mockPollinations.llm.generateTextGet.mockResolvedValue(mockResponse);
    mockPollinations.images.generateImage.mockRejectedValue(new Error('Image generation failed'));

    const result = await generateCharacterWithImage(
      GameSystem.DND5E,
      'A brave warrior who is afraid of the dark'
    );
    
    // Should still return character data even if image generation fails
    expect(result.character).toEqual({
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
    });
    expect(result.imageBuffer).toBeUndefined();
    expect(console.warn).toHaveBeenCalledWith('Failed to generate character image:', expect.any(Error));
    expect(mockPollinations.llm.generateTextGet).toHaveBeenCalledWith({
      prompt: expect.stringContaining('Dungeons & Dragons 5th Edition'),
      model: 'openai',
      jsonMode: true,
    });
    expect(mockPollinations.images.generateImage).toHaveBeenCalledWith({
      prompt: expect.stringContaining('Aragorn'),
      model: 'flux',
      width: 512,
      height: 512,
    });
  });
});