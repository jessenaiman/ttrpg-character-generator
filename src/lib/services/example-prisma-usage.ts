// Example usage of the Prisma service for TTRPG character storage
import { PrismaService } from './services/prismaService';
import { GameSystem } from './types';

/**
 * Example: Add a new character to the database
 */
async function addNewCharacter() {
  try {
    const newCharacter = await PrismaService.addCharacter({
      system: GameSystem.DND5E,
      prompt: 'A brave warrior who fears the dark',
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
        backstory: [
          'Saved a village from bandits',
          'Travels with a mysterious elf companion',
        ],
        appearance: [
          'Tall and muscular',
          'Wears chain mail',
        ],
        personality: [
          'Brave and honorable',
          'Protects the innocent',
        ],
        equipment: ['Longsword', 'Shield', 'Chain Mail'],
      },
      isNpc: false,
    });
    
    console.log('New character added with ID:', newCharacter.id);
    return newCharacter;
  } catch (error) {
    console.error('Failed to add character:', error);
    throw error;
  }
}

/**
 * Example: Get all characters from the database
 */
async function getAllCharacters() {
  try {
    const characters = await PrismaService.getAllCharacters();
    console.log(`Retrieved ${characters.length} characters from database`);
    return characters;
  } catch (error) {
    console.error('Failed to retrieve characters:', error);
    throw error;
  }
}

/**
 * Example: Get characters filtered by system
 */
async function getCharactersBySystem(system: GameSystem) {
  try {
    const characters = await PrismaService.getCharactersBySystem(system);
    console.log(`Retrieved ${characters.length} ${system} characters from database`);
    return characters;
  } catch (error) {
    console.error('Failed to retrieve characters by system:', error);
    throw error;
  }
}

/**
 * Example: Get the first PC (non-NPC character) from the database
 */
async function getFirstPC() {
  try {
    const firstPC = await PrismaService.getFirstPC();
    if (firstPC) {
      console.log('First PC retrieved:', firstPC.character.name);
      return firstPC;
    } else {
      console.log('No PCs found in database');
      return null;
    }
  } catch (error) {
    console.error('Failed to retrieve first PC:', error);
    throw error;
  }
}

/**
 * Example: Update an existing character
 */
async function updateCharacter(id: string, updates: Partial<any>) {
  try {
    const updatedCharacter = await PrismaService.updateCharacter(id, updates);
    console.log('Character updated successfully');
    return updatedCharacter;
  } catch (error) {
    console.error('Failed to update character:', error);
    throw error;
  }
}

/**
 * Example: Delete a character
 */
async function deleteCharacter(id: string) {
  try {
    await PrismaService.deleteCharacter(id);
    console.log('Character deleted successfully');
  } catch (error) {
    console.error('Failed to delete character:', error);
    throw error;
  }
}

/**
 * Example: Get character count
 */
async function getCharacterCount() {
  try {
    const count = await PrismaService.getCharacterCount();
    console.log(`Total characters in database: ${count}`);
    return count;
  } catch (error) {
    console.error('Failed to get character count:', error);
    throw error;
  }
}

/**
 * Example: Search characters
 */
async function searchCharacters(searchTerm: string) {
  try {
    const results = await PrismaService.searchCharacters(searchTerm);
    console.log(`Found ${results.length} characters matching "${searchTerm}"`);
    return results;
  } catch (error) {
    console.error('Failed to search characters:', error);
    throw error;
  }
}

// Demonstrate usage
async function demonstrateUsage() {
  console.log('=== TTRPG Character Database Demo ===');
  
  // Add a new character
  const newCharacter = await addNewCharacter();
  
  // Get all characters
  await getAllCharacters();
  
  // Get characters by system
  await getCharactersBySystem(GameSystem.DND5E);
  
  // Get the first PC
  await getFirstPC();
  
  // Update the character
  await updateCharacter(newCharacter.id, {
    prompt: 'A brave warrior who conquered their fear of the dark',
  });
  
  // Search for characters
  await searchCharacters('brave');
  
  // Get character count
  await getCharacterCount();
  
  // Delete the character (optional)
  // await deleteCharacter(newCharacter.id);
  
  console.log('=== Demo Complete ===');
}

// Run the demonstration
// demonstrateUsage().catch(console.error);

export {
  addNewCharacter,
  getAllCharacters,
  getCharactersBySystem,
  getFirstPC,
  updateCharacter,
  deleteCharacter,
  getCharacterCount,
  searchCharacters,
  demonstrateUsage,
};