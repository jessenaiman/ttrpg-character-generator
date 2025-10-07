/**
 * @jest-environment jsdom
 */

// Test for MDX Exporter service focusing on UI elements
import { exportCharacterAsMdx } from '../src/lib/services/mdxExporter';

describe('MDX Exporter Service', () => {
  // Mock DOM APIs before each test
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Mock Blob constructor
    global.Blob = jest.fn(() => ({}));
    
    // Mock URL.createObjectURL and URL.revokeObjectURL
    global.URL.createObjectURL = jest.fn(() => 'blob:test-url');
    global.URL.revokeObjectURL = jest.fn();
    
    // Mock document.createElement to return a proper DOM element
    const originalCreateElement = document.createElement;
    document.createElement = jest.fn((tagName) => {
      if (tagName === 'a') {
        // Create a real anchor element and mock its methods
        const element = originalCreateElement.call(document, 'a');
        element.setAttribute = jest.fn();
        element.click = jest.fn();
        return element;
      }
      return originalCreateElement.call(document, tagName);
    });
    
    // Mock document.body methods
    document.body.appendChild = jest.fn();
    document.body.removeChild = jest.fn();
  });

  test('should create a Blob when exporting character', async () => {
    // Create a mock character
    const mockCharacter = {
      id: '1',
      system: 'dnd5e',
      prompt: 'A brave warrior',
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
      isNpc: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    // Call the export function
    await exportCharacterAsMdx(mockCharacter);

    // Verify that Blob was created with the right parameters
    expect(global.Blob).toHaveBeenCalledWith([expect.any(String)], { type: 'text/markdown;charset=utf-8' });
    
    // Verify that URL.createObjectURL was called with the Blob
    expect(global.URL.createObjectURL).toHaveBeenCalled();
    
    // Verify that createElement was called with 'a'
    expect(document.createElement).toHaveBeenCalledWith('a');
    
    // Get the created link element
    const linkElement = (document.createElement as jest.Mock).mock.results[0].value;
    
    // Verify that setAttribute was called with href and download
    expect(linkElement.setAttribute).toHaveBeenCalledWith('href', expect.any(String));
    expect(linkElement.setAttribute).toHaveBeenCalledWith('download', expect.stringMatching(/\.mdx$/));
    
    // Verify that click was called
    expect(linkElement.click).toHaveBeenCalled();
    
    // Verify that appendChild and removeChild were called
    expect(document.body.appendChild).toHaveBeenCalledWith(linkElement);
    expect(document.body.removeChild).toHaveBeenCalledWith(linkElement);
  });

  test('should handle different game systems', async () => {
    // Create mock characters for different systems
    const mockDndCharacter = {
      id: '1',
      system: 'dnd5e',
      prompt: 'A brave warrior',
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
      isNpc: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const mockPf2eCharacter = {
      id: '2',
      system: 'pf2e',
      prompt: 'A brave warrior',
      character: {
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
      isNpc: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    // Test DND5E character export
    await exportCharacterAsMdx(mockDndCharacter);
    expect(global.Blob).toHaveBeenCalledWith([expect.any(String)], { type: 'text/markdown;charset=utf-8' });
    expect(global.URL.createObjectURL).toHaveBeenCalled();
    
    // Test PF2E character export
    await exportCharacterAsMdx(mockPf2eCharacter);
    expect(global.Blob).toHaveBeenCalledWith([expect.any(String)], { type: 'text/markdown;charset=utf-8' });
    expect(global.URL.createObjectURL).toHaveBeenCalled();
  });

  test('should handle Blades in the Dark characters', async () => {
    // Create a mock Blades character
    const mockBladesCharacter = {
      id: '3',
      system: 'blades',
      prompt: 'A skilled operative',
      character: {
        name: 'Scarlett',
        playbook: 'Cutter',
        heritage: 'Skovlander',
        background: 'Laborer',
        vice: 'Gambling',
        purveyor: 'Friendly bookie',
        appearance: ['Tattoos on arms', 'Scar across cheek'],
        aliases: ['Red'],
        attributes: {
          insight: 2,
          prowess: 3,
          resolve: 2,
        },
        actionRatings: [
          { action: 'Prowl', rating: 3 },
          { action: 'Skirmish', rating: 2 },
        ],
        specialAbilities: ['Dangerous Reflexes'],
        friends: ['Olivia the Whisper'],
        drives: ['Protect my crew', 'Get rich'],
        gear: [
          { name: 'Fine hand weapon', load: 1 },
          { name: 'Scary weapon or tool', load: 2 },
        ],
        harm: {
          level3: '',
          level2: 'Gut shot',
          level1: '',
        },
      },
      isNpc: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    // Test Blades character export
    await exportCharacterAsMdx(mockBladesCharacter);
    expect(global.Blob).toHaveBeenCalledWith([expect.any(String)], { type: 'text/markdown;charset=utf-8' });
    expect(global.URL.createObjectURL).toHaveBeenCalled();
  });
});