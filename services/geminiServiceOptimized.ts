import { GoogleGenAI, Type } from '@google/genai';
import { GameSystem, Character } from '../types';

/**
 * Check for API key and throw error if not set
 * 
 * This ensures the application fails fast if the required API key is missing.
 * 
 * @throws Will throw an error if API_KEY environment variable is not set
 */
if (!process.env.API_KEY) {
  throw new Error('API_KEY environment variable not set');
}

/**
 * Initialize Google GenAI client with API key
 * 
 * Creates a singleton instance of the Google GenAI client for character generation.
 */
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Schema for character attacks
 * 
 * Defines the structure for attack objects used across all game systems.
 */
const attackSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    bonus: { type: Type.STRING },
    damage: { type: Type.STRING },
  },
  required: ['name', 'bonus', 'damage'],
};

/**
 * Schema for character appearance
 * 
 * Defines the structure for appearance descriptions as an array of bullet points.
 */
const appearanceSchema = {
  type: Type.ARRAY,
  items: { type: Type.STRING },
  description: 'A list of 3-5 bullet points describing the character\'s physical appearance and clothing.',
};

/**
 * Common character properties across all systems
 * 
 * These properties are shared by all character types regardless of game system.
 */
const commonCharacterProperties = {
  name: { type: Type.STRING },
  appearance: appearanceSchema,
  personality: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'A list of 3-5 bullet points describing the character\'s actionable personality traits.' },
  backstory: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'A list of 3-5 bullet points summarizing the character\'s key backstory elements.' },
  equipment: { type: Type.ARRAY, items: { type: Type.STRING } },
};

/**
 * Enhanced schemas with common properties
 * 
 * These schemas extend the common character properties with system-specific fields.
 */

/**
 * Schema for D&D 5e characters
 * 
 * Defines the complete JSON schema for Dungeons & Dragons 5th Edition characters,
 * including all required fields and nested structures.
 */
const dndSchema = {
  type: Type.OBJECT,
  properties: {
    ...commonCharacterProperties,
    race: { type: Type.STRING },
    class: { type: Type.STRING },
    background: { type: Type.STRING },
    alignment: { type: Type.STRING },
    hitPoints: { type: Type.INTEGER, description: 'Character\'s total hit points at level 1.' },
    armorClass: { type: Type.INTEGER, description: 'Character\'s armor class.' },
    speed: { type: Type.STRING, description: 'Character\'s speed, e.g., \'30 ft\'.' },
    stats: {
      type: Type.OBJECT,
      properties: {
        strength: { type: Type.INTEGER },
        dexterity: { type: Type.INTEGER },
        constitution: { type: Type.INTEGER },
        intelligence: { type: Type.INTEGER },
        wisdom: { type: Type.INTEGER },
        charisma: { type: Type.INTEGER },
      },
      required: ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'],
    },
    skills: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'List of skills the character is proficient in.' },
    proficiencies: {
      type: Type.OBJECT,
      properties: {
        weapons: { type: Type.ARRAY, items: { type: Type.STRING } },
        armor: { type: Type.ARRAY, items: { type: Type.STRING } },
        tools: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ['weapons', 'armor', 'tools'],
    },
    attacks: { type: Type.ARRAY, items: attackSchema },
  },
  required: ['name', 'race', 'class', 'background', 'alignment', 'hitPoints', 'armorClass', 'speed', 'stats', 'skills', 'proficiencies', 'attacks', 'backstory', 'appearance', 'personality', 'equipment'],
};

/**
 * Schema for Pathfinder 2e characters
 * 
 * Defines the complete JSON schema for Pathfinder 2nd Edition characters,
 * including all required fields and nested structures.
 */
const pf2eSchema = {
  type: Type.OBJECT,
  properties: {
    ...commonCharacterProperties,
    ancestry: { type: Type.STRING },
    heritage: { type: Type.STRING },
    background: { type: Type.STRING },
    class: { type: Type.STRING },
    alignment: { type: Type.STRING },
    hitPoints: { type: Type.INTEGER, description: 'Character\'s total hit points at level 1.' },
    armorClass: { type: Type.INTEGER, description: 'Character\'s armor class.' },
    speed: { type: Type.STRING, description: 'Character\'s speed, e.g., \'25 ft\'.' },
    attributes: {
      type: Type.OBJECT,
      properties: {
        strength: { type: Type.INTEGER },
        dexterity: { type: Type.INTEGER },
        constitution: { type: Type.INTEGER },
        intelligence: { type: Type.INTEGER },
        wisdom: { type: Type.INTEGER },
        charisma: { type: Type.INTEGER },
      },
      required: ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'],
    },
    skills: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, rank: { type: Type.STRING, description: 'e.g., Trained, Expert' } }, required: ['name', 'rank'] } },
    attacks: { type: Type.ARRAY, items: attackSchema },
  },
  required: ['name', 'ancestry', 'heritage', 'background', 'class', 'alignment', 'hitPoints', 'armorClass', 'speed', 'attributes', 'skills', 'attacks', 'backstory', 'appearance', 'personality', 'equipment'],
};

/**
 * Schema for Blades in the Dark characters
 * 
 * Defines the complete JSON schema for Blades in the Dark characters,
 * including all required fields and nested structures.
 */
const bladesSchema = {
  type: Type.OBJECT,
  properties: {
    ...commonCharacterProperties,
    playbook: { type: Type.STRING },
    heritage: { type: Type.STRING },
    background: { type: Type.STRING },
    vice: { type: Type.STRING, description: 'The character\'s vice, e.g., \'Gambling\' or \'Luxury\'.' },
    purveyor: { type: Type.STRING, description: 'The character\'s preferred purveyor for their vice.' },
    aliases: { type: Type.ARRAY, items: { type: Type.STRING } },
    drives: { type: Type.ARRAY, items: {type: Type.STRING }, description: 'A list of 3-5 bullet points describing the character\'s core motivations, goals, or methods.'},
    attributes: {
      type: Type.OBJECT,
      properties: {
        insight: { type: Type.INTEGER },
        prowess: { type: Type.INTEGER },
        resolve: { type: Type.INTEGER },
      },
      required: ['insight', 'prowess', 'resolve'],
    },
    actionRatings: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          action: { type: Type.STRING, description: 'The name of the action, e.g., Hunt, Study, Prowl.' },
          rating: { type: Type.INTEGER, description: 'The rating for the action, from 0 to 4.' },
        },
        required: ['action', 'rating'],
      },
      description: 'A list of the character\'s action ratings.',
    },
    specialAbilities: { type: Type.ARRAY, items: { type: Type.STRING } },
    friends: { type: Type.ARRAY, items: { type: Type.STRING } },
    gear: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, load: { type: Type.INTEGER } }, required: ['name', 'load'] }, description: 'Character\'s standard gear items.' },
    harm: {
        type: Type.OBJECT,
        properties: {
            level3: {type: Type.STRING, description: 'Description of Level 3 Harm taken. Empty string if none.'},
            level2: {type: Type.STRING, description: 'Description of Level 2 Harm taken. Empty string if none.'},
            level1: {type: Type.STRING, description: 'Description of Level 1 Harm taken. Empty string if none.'},
        },
        required: ['level3', 'level2', 'level1'],
    },
  },
  required: ['name', 'playbook', 'heritage', 'background', 'vice', 'purveyor', 'appearance', 'aliases', 'attributes', 'actionRatings', 'specialAbilities', 'friends', 'gear', 'harm', 'drives'],
};

/**
 * Schema with NPC generation capability
 * 
 * These schemas allow for generation of both a main character and related NPCs in a single API call.
 */

/**
 * Combined schema for D&D 5e characters with NPCs
 * 
 * Extends the D&D 5e character schema to include an array of related NPCs.
 */
const dndWithNpcsSchema = {
  type: Type.OBJECT,
  properties: {
    character: dndSchema,
    npcs: {
      type: Type.ARRAY,
      items: dndSchema,
      description: 'Array of NPCs related to the main character',
    },
  },
  required: ['character', 'npcs'],
};

/**
 * Combined schema for Pathfinder 2e characters with NPCs
 * 
 * Extends the Pathfinder 2e character schema to include an array of related NPCs.
 */
const pf2eWithNpcsSchema = {
  type: Type.OBJECT,
  properties: {
    character: pf2eSchema,
    npcs: {
      type: Type.ARRAY,
      items: pf2eSchema,
      description: 'Array of NPCs related to the main character',
    },
  },
  required: ['character', 'npcs'],
};

/**
 * Combined schema for Blades in the Dark characters with NPCs
 * 
 * Extends the Blades in the Dark character schema to include an array of related NPCs.
 */
const bladesWithNpcsSchema = {
  type: Type.OBJECT,
  properties: {
    character: bladesSchema,
    npcs: {
      type: Type.ARRAY,
      items: bladesSchema,
      description: 'Array of NPCs related to the main character',
    },
  },
  required: ['character', 'npcs'],
};

/**
 * System configuration mapping game systems to their schemas
 * 
 * This configuration object maps each supported game system to its corresponding
 * character schema and schema with NPC generation capability.
 */
const systemConfig: Record<GameSystem, {
  name: string;
  schema: any;
  schemaWithNpcs: any;
}> = {
  [GameSystem.DND5E]: {
    name: 'Dungeons & Dragons 5th Edition',
    schema: dndSchema,
    schemaWithNpcs: dndWithNpcsSchema,
  },
  [GameSystem.PF2E]: {
    name: 'Pathfinder 2nd Edition',
    schema: pf2eSchema,
    schemaWithNpcs: pf2eWithNpcsSchema,
  },
  [GameSystem.BLADES]: {
    name: 'Blades in the Dark',
    schema: bladesSchema,
    schemaWithNpcs: bladesWithNpcsSchema,
  },
};

/**
 * Cache for frequently requested content
 * 
 * This Map caches API responses to avoid redundant calls for the same content.
 * Keys are strings combining system, prompt, and context.
 */
const responseCache = new Map<string, any>();

/**
 * Generate a TTRPG character using Google's Gemini AI
 * 
 * This function uses Google's Gemini AI to generate a complete character for the
 * specified game system based on the provided concept prompt. It can optionally
 * generate related NPCs in the same API call for efficiency.
 * 
 * @param system - The game system for which to generate a character
 * @param prompt - The concept or idea for the character to generate
 * @param includeNpcs - Whether to include related NPCs in the generation (default: false)
 * @returns Promise resolving to a fully generated character object (and optionally NPCs)
 * @throws Will throw an error if the API call fails or returns invalid data
 * 
 * @example
 * ```typescript
 * // Generate a D&D character
 * const result = await generateCharacter(
 *   GameSystem.DND5E,
 *   'A stoic half-orc barbarian who is afraid of the dark',
 *   false
 * );
 * 
 * // Generate a D&D character with related NPCs
 * const result = await generateCharacter(
 *   GameSystem.DND5E,
 *   'A stoic half-orc barbarian who is afraid of the dark',
 *   true
 * );
 * ```
 */
export const generateCharacter = async (system: GameSystem, prompt: string, includeNpcs: boolean = false): Promise<any> => {
  const config = systemConfig[system];
  
  // Create a cache key based on system, prompt and whether NPCs are requested
  const cacheKey = `${system}:${prompt}:${includeNpcs}`;
  
  // Check if result is already cached
  if (responseCache.has(cacheKey)) {
    return responseCache.get(cacheKey);
  }
  
  let systemInstruction = `You are an expert TTRPG creator specializing in ${config.name}. Your goal is to generate a rich, thematic, and mechanically sound level 1 character based on a user prompt. Adhere strictly to the provided JSON schema. For personality, backstory, and appearance fields, provide 3-5 distinct, actionable bullet points.`;
  
  let fullPrompt = `Based on the following concept: "${prompt}", generate a complete level 1 character for the ${config.name} roleplaying game. Fill out all the fields in the JSON schema with creative and appropriate details.`;
  let schemaToUse = config.schema;

  // If NPCs are requested, use the combined schema
  if (includeNpcs) {
    systemInstruction = `You are an expert TTRPG creator specializing in ${config.name}. Generate a main character and up to 3 related NPCs based on the user's concept. The NPCs should connect directly to the main character's backstory, creating interesting plot hooks. Adhere strictly to the provided JSON schema.`;
    fullPrompt = `Based on the following concept: "${prompt}", generate a complete level 1 character along with 1-3 related NPCs for the ${config.name} roleplaying game. The NPCs should connect directly to the main character's backstory, creating interesting plot hooks. Fill out all the fields in the JSON schema with creative and appropriate details.`;
    schemaToUse = config.schemaWithNpcs;
  }

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: fullPrompt,
    config: {
      systemInstruction,
      responseMimeType: 'application/json',
      responseSchema: schemaToUse,
    },
  });

  const jsonString = response.text.trim();
  try {
    const characterData = JSON.parse(jsonString);
    
    // Cache the result
    responseCache.set(cacheKey, characterData);
    
    return characterData;
  } catch (error) {
    console.error('Failed to parse JSON response:', jsonString, error);
    throw new Error('Received an invalid format from the API.');
  }
};

/**
 * Generate a single TTRPG character (existing interface)
 * 
 * This function maintains backward compatibility with the original character generation
 * interface while leveraging the optimized implementation.
 * 
 * @param system - The game system for which to generate a character
 * @param prompt - The concept or idea for the character to generate
 * @returns Promise resolving to a fully generated character object
 * @throws Will throw an error if the API call fails or returns invalid data
 * 
 * @example
 * ```typescript
 * // Generate a D&D character
 * const character = await generateSingleCharacter(
 *   GameSystem.DND5E,
 *   'A stoic half-orc barbarian who is afraid of the dark'
 * );
 * ```
 */
export const generateSingleCharacter = async (system: GameSystem, prompt: string): Promise<Character> => {
  const result = await generateCharacter(system, prompt, false);
  return result.character;
};

/**
 * Generate a character with related NPCs (optimized for single API call)
 * 
 * This function generates both a main character and related NPCs in a single API call
 * for improved efficiency compared to separate calls.
 * 
 * @param system - The game system for which to generate a character
 * @param prompt - The concept or idea for the character to generate
 * @param npcCount - The number of NPCs to generate (default: 1)
 * @returns Promise resolving to an object containing the main character and array of NPCs
 * @throws Will throw an error if the API call fails or returns invalid data
 * 
 * @example
 * ```typescript
 * // Generate a D&D character with 2 related NPCs
 * const { character, npcs } = await generateCharacterWithNpcs(
 *   GameSystem.DND5E,
 *   'A stoic half-orc barbarian who is afraid of the dark',
 *   2
 * );
 * ```
 */
export const generateCharacterWithNpcs = async (system: GameSystem, prompt: string, npcCount: number = 1): Promise<{ character: Character, npcs: Character[] }> => {
  const result = await generateCharacter(system, prompt, true);
  return {
    character: result.character,
    npcs: result.npcs ? result.npcs.slice(0, npcCount) : [],
  };
};

/**
 * Get character suggestions for a specific game system (cached)
 * 
 * This function generates creative character concept prompts for a given game system.
 * Results are cached to avoid redundant API calls.
 * 
 * @param system - The game system for which to generate suggestions
 * @returns Promise resolving to an array of character concept prompts
 * @throws Will throw an error if the API call fails
 * 
 * @example
 * ```typescript
 * // Get D&D character suggestions
 * const suggestions = await getCharacterSuggestions(GameSystem.DND5E);
 * ```
 */
export const getCharacterSuggestions = async (system: GameSystem): Promise<string[]> => {
  const cacheKey = `suggestions:${system}`;
  
  if (responseCache.has(cacheKey)) {
    return responseCache.get(cacheKey);
  }
  
  const config = systemConfig[system];
  const prompt = `Generate 10 creative character concept prompts for ${config.name}. Each prompt should be a few words to a short sentence describing an interesting character concept. Return as an array of strings.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
      },
    },
  });

  const jsonString = response.text.trim();
  try {
    const suggestions = JSON.parse(jsonString) as string[];
    
    // Cache the suggestions
    responseCache.set(cacheKey, suggestions);
    
    return suggestions;
  } catch (error) {
    console.error('Failed to parse JSON response for suggestions:', jsonString, error);
    // Return default suggestions if API call fails
    const defaultSuggestions: Record<GameSystem, string[]> = {
      [GameSystem.DND5E]: [
        'A stoic half-orc barbarian who is afraid of the dark',
        'A cunning tiefling rogue with a heart of gold',
        'A grizzled dwarven cleric who has lost their faith',
        'An elven wizard obsessed with forbidden knowledge',
        'A charismatic human bard who is secretly a spy',
      ],
      [GameSystem.PF2E]: [
        'A Leshy druid who wants to see the world beyond their forest',
        'An automaton champion searching for their creator\'s purpose',
        'A goblin witch who speaks to an unusually intelligent toad',
        'A human gunslinger seeking revenge on a notorious outlaw',
        'An elf magus who blends swordplay and arcane might seamlessly',
      ],
      [GameSystem.BLADES]: [
        'A Cutter who uses their imposing presence to settle scores in the Crows Foot district',
        'A Leech, the only doctor in Silkshore who will patch up scoundrels, for a price',
        'A Lurk who can navigate the rooftops of Duskvol like a ghost',
        'A Slide whose silver tongue has gotten them into and out of trouble with every noble house',
        'A Spider, weaving a web of contacts and secrets from a hidden lair in Charterhall',
      ],
    };
    
    return defaultSuggestions[system];
  }
};

/**
 * Refresh just the cache for suggestions
 * 
 * This function clears the cached suggestions for a specific game system,
 * forcing a fresh API call on the next request.
 * 
 * @param system - The game system for which to clear cached suggestions
 * 
 * @example
 * ```typescript
 * // Refresh D&D suggestions cache
 * refreshSuggestions(GameSystem.DND5E);
 * ```
 */
export const refreshSuggestions = (system: GameSystem) => {
  const cacheKey = `suggestions:${system}`;
  responseCache.delete(cacheKey);
};