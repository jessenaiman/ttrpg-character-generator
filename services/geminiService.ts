import { GoogleGenAI, Type } from "@google/genai";
import { GameSystem, Character } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const attackSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    bonus: { type: Type.STRING },
    damage: { type: Type.STRING },
  },
  required: ['name', 'bonus', 'damage'],
};

const dndSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    race: { type: Type.STRING },
    class: { type: Type.STRING },
    background: { type: Type.STRING },
    alignment: { type: Type.STRING },
    hitPoints: { type: Type.INTEGER, description: "Character's total hit points at level 1." },
    armorClass: { type: Type.INTEGER, description: "Character's armor class." },
    speed: { type: Type.STRING, description: "Character's speed, e.g., '30 ft'." },
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
    skills: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of skills the character is proficient in." },
    proficiencies: {
      type: Type.OBJECT,
      properties: {
        weapons: { type: Type.ARRAY, items: { type: Type.STRING } },
        armor: { type: Type.ARRAY, items: { type: Type.STRING } },
        tools: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ['weapons', 'armor', 'tools']
    },
    attacks: { type: Type.ARRAY, items: attackSchema },
    backstory: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of 3-5 bullet points summarizing the character's key backstory elements." },
    appearance: { type: Type.STRING },
    personality: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of 3-5 bullet points describing the character's actionable personality traits." },
    equipment: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
  required: ['name', 'race', 'class', 'background', 'alignment', 'hitPoints', 'armorClass', 'speed', 'stats', 'skills', 'proficiencies', 'attacks', 'backstory', 'appearance', 'personality', 'equipment'],
};

const pf2eSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    ancestry: { type: Type.STRING },
    heritage: { type: Type.STRING },
    background: { type: Type.STRING },
    class: { type: Type.STRING },
    alignment: { type: Type.STRING },
    hitPoints: { type: Type.INTEGER, description: "Character's total hit points at level 1." },
    armorClass: { type: Type.INTEGER, description: "Character's armor class." },
    speed: { type: Type.STRING, description: "Character's speed, e.g., '25 ft'." },
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
    skills: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, rank: { type: Type.STRING, description: "e.g., Trained, Expert" } }, required: ['name', 'rank'] } },
    attacks: { type: Type.ARRAY, items: attackSchema },
    backstory: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of 3-5 bullet points summarizing the character's key backstory elements." },
    appearance: { type: Type.STRING },
    personality: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of 3-5 bullet points describing the character's actionable personality traits." },
    equipment: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
  required: ['name', 'ancestry', 'heritage', 'background', 'class', 'alignment', 'hitPoints', 'armorClass', 'speed', 'attributes', 'skills', 'attacks', 'backstory', 'appearance', 'personality', 'equipment'],
};


const bladesSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    playbook: { type: Type.STRING },
    heritage: { type: Type.STRING },
    background: { type: Type.STRING },
    vice: { type: Type.STRING, description: "The character's vice, e.g., 'Gambling' or 'Luxury'." },
    purveyor: { type: Type.STRING, description: "The character's preferred purveyor for their vice." },
    look: { type: Type.STRING, description: "A description of the character's appearance." },
    aliases: { type: Type.ARRAY, items: { type: Type.STRING } },
    drives: { type: Type.ARRAY, items: {type: Type.STRING }, description: "A list of 3-5 bullet points describing the character's core motivations, goals, or methods."},
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
          action: { type: Type.STRING, description: "The name of the action, e.g., Hunt, Study, Prowl." },
          rating: { type: Type.INTEGER, description: "The rating for the action, from 0 to 4." }
        },
        required: ['action', 'rating']
      },
      description: "A list of the character's action ratings."
    },
    specialAbilities: { type: Type.ARRAY, items: { type: Type.STRING } },
    friends: { type: Type.ARRAY, items: { type: Type.STRING } },
    gear: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, load: { type: Type.INTEGER } }, required: ['name', 'load'] }, description: "Character's standard gear items." },
    harm: {
        type: Type.OBJECT,
        properties: {
            level3: {type: Type.STRING, description: "Description of Level 3 Harm taken. Empty string if none."},
            level2: {type: Type.STRING, description: "Description of Level 2 Harm taken. Empty string if none."},
            level1: {type: Type.STRING, description: "Description of Level 1 Harm taken. Empty string if none."},
        },
        required: ['level3', 'level2', 'level1']
    }
  },
  required: ['name', 'playbook', 'heritage', 'background', 'vice', 'purveyor', 'look', 'aliases', 'attributes', 'actionRatings', 'specialAbilities', 'friends', 'gear', 'harm', 'drives'],
};


const systemConfig = {
  [GameSystem.DND5E]: {
    name: "Dungeons & Dragons 5th Edition",
    schema: dndSchema,
  },
  [GameSystem.PF2E]: {
    name: "Pathfinder 2nd Edition",
    schema: pf2eSchema,
  },
  [GameSystem.BLADES]: {
    name: "Blades in the Dark",
    schema: bladesSchema,
  },
};

export const generateCharacter = async (system: GameSystem, prompt: string): Promise<Character> => {
  const config = systemConfig[system];
  const systemInstruction = `You are an expert TTRPG creator specializing in ${config.name}. Your goal is to generate a rich, thematic, and mechanically sound level 1 character based on a user prompt. Adhere strictly to the provided JSON schema. For personality and backstory fields, provide 3-5 distinct, actionable bullet points.`;
  const fullPrompt = `Based on the following concept: "${prompt}", generate a complete level 1 character for the ${config.name} roleplaying game. Fill out all the fields in the JSON schema with creative and appropriate details.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: fullPrompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: config.schema,
    },
  });

  const jsonString = response.text.trim();
  try {
    const characterData = JSON.parse(jsonString);
    return characterData as Character;
  } catch (e) {
    console.error("Failed to parse JSON response:", jsonString);
    throw new Error("Received an invalid format from the API.");
  }
};