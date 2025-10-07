// Pollinations service for TTRPG character generation
import Pollinations from 'pollinations';
import { GameSystem, Character } from '@/types';

// Initialize Pollinations client
const pollinations = new Pollinations();

/**
 * Service for generating TTRPG characters using Pollinations API
 * 
 * This service provides an alternative to the existing Gemini-based character generation
 * by leveraging the free Pollinations API for text and image generation.
 * 
 * @example
 * ```typescript
 * // Generate a D&D character using Pollinations
 * const character = await PollinationsService.generateCharacter(
 *   GameSystem.DND5E,
 *   'A brave warrior who is afraid of the dark'
 * );
 * 
 * // Generate a character image
 * const imageBuffer = await PollinationsService.generateCharacterImage(
 *   'A brave fantasy warrior with intricate armor and a glowing sword'
 * );
 * ```
 */
export class PollinationsService {
  /**
   * Generate a TTRPG character using Pollinations API
   * 
   * This function uses the Pollinations API to generate a complete character for the
   * specified game system based on the provided concept prompt. The character is
   * generated according to a strict JSON schema to ensure consistency and completeness.
   * 
   * @param system - The game system for which to generate a character
   * @param prompt - The concept or idea for the character to generate
   * @returns Promise resolving to a fully generated character object
   * @throws Will throw an error if the API call fails or returns invalid data
   * 
   * @example
   * ```typescript
   * // Generate a D&D character
   * const character = await PollinationsService.generateCharacter(
   *   GameSystem.DND5E,
   *   'A stoic half-orc barbarian who is afraid of the dark'
   * );
   * ```
   */
  static async generateCharacter(system: GameSystem, prompt: string): Promise<Character> {
    try {
      // Create system-specific prompt
      let systemInstruction = '';
      let fullPrompt = '';
      
      switch (system) {
        case GameSystem.DND5E:
          systemInstruction = 'You are an expert TTRPG creator specializing in Dungeons & Dragons 5th Edition. Your goal is to generate a rich, thematic, and mechanically sound level 1 character based on a user prompt. Adhere strictly to the provided JSON schema. For personality, backstory, and appearance fields, provide 3-5 distinct, actionable bullet points.';
          fullPrompt = `Based on the following concept: "${prompt}", generate a complete level 1 character for the Dungeons & Dragons 5th Edition roleplaying game. Fill out all the fields in the JSON schema with creative and appropriate details.`;
          break;
          
        case GameSystem.PF2E:
          systemInstruction = 'You are an expert TTRPG creator specializing in Pathfinder 2nd Edition. Your goal is to generate a rich, thematic, and mechanically sound level 1 character based on a user prompt. Adhere strictly to the provided JSON schema. For personality, backstory, and appearance fields, provide 3-5 distinct, actionable bullet points.';
          fullPrompt = `Based on the following concept: "${prompt}", generate a complete level 1 character for the Pathfinder 2nd Edition roleplaying game. Fill out all the fields in the JSON schema with creative and appropriate details.`;
          break;
          
        case GameSystem.BLADES:
          systemInstruction = 'You are an expert TTRPG creator specializing in Blades in the Dark. Your goal is to generate a rich, thematic, and mechanically sound level 1 character based on a user prompt. Adhere strictly to the provided JSON schema. For personality, backstory, and appearance fields, provide 3-5 distinct, actionable bullet points.';
          fullPrompt = `Based on the following concept: "${prompt}", generate a complete level 1 character for the Blades in the Dark roleplaying game. Fill out all the fields in the JSON schema with creative and appropriate details.`;
          break;
          
        default:
          throw new Error(`Unsupported game system: ${system}`);
      }
      
      // Generate character using Pollinations LLM
      const response = await pollinations.llm.generateTextGet({
        prompt: `${systemInstruction}\n\n${fullPrompt}`,
        model: 'openai',
        jsonMode: true,
      });
      
      const jsonString = response.trim();
      try {
        const characterData = JSON.parse(jsonString);
        return characterData as Character;
      } catch (parseError) {
        console.error('Failed to parse JSON response:', jsonString, parseError);
        throw new Error('Received an invalid format from the API.');
      }
    } catch (error) {
      console.error('Failed to generate character with Pollinations:', error);
      throw new Error('Failed to generate character with Pollinations API.');
    }
  }

  /**
   * Generate a character image using Pollinations API
   * 
   * This function uses the Pollinations API to generate a visual representation
   * of a character based on a textual description.
   * 
   * @param prompt - The description of the character to visualize
   * @param model - The image generation model to use (default: 'flux')
   * @param width - Width of the generated image in pixels (default: 512)
   * @param height - Height of the generated image in pixels (default: 512)
   * @returns Promise resolving to an image buffer
   * @throws Will throw an error if the API call fails
   * 
   * @example
   * ```typescript
   * // Generate a character image
   * const imageBuffer = await PollinationsService.generateCharacterImage(
   *   'A brave fantasy warrior with intricate armor and a glowing sword',
   *   'flux',
   *   512,
   *   512
   * );
   * ```
   */
  static async generateCharacterImage(
    prompt: string,
    model: string = 'flux',
    width: number = 512,
    height: number = 512,
  ): Promise<Buffer> {
    try {
      // Generate image using Pollinations
      const imageBuffer = await pollinations.images.generateImage({
        prompt,
        model,
        width,
        height,
      });
      
      return imageBuffer;
    } catch (error) {
      console.error('Failed to generate character image with Pollinations:', error);
      throw new Error('Failed to generate character image with Pollinations API.');
    }
  }

  /**
   * Get available image generation models
   * 
   * This function retrieves a list of available image generation models
   * from the Pollinations API.
   * 
   * @returns Promise resolving to an array of available image models
   * @throws Will throw an error if the API call fails
   * 
   * @example
   * ```typescript
   * // Get available image models
   * const models = await PollinationsService.getImageModels();
   * console.log('Available image models:', models);
   * ```
   */
  static async getImageModels(): Promise<string[]> {
    try {
      const models = await pollinations.images.getModels();
      return models;
    } catch (error) {
      console.error('Failed to get image models from Pollinations:', error);
      throw new Error('Failed to get image models from Pollinations API.');
    }
  }

  /**
   * Get available text generation models
   * 
   * This function retrieves a list of available text generation models
   * from the Pollinations API.
   * 
   * @returns Promise resolving to an array of available text models
   * @throws Will throw an error if the API call fails
   * 
   * @example
   * ```typescript
   * // Get available text models
   * const models = await PollinationsService.getTextModels();
   * console.log('Available text models:', models);
   * ```
   */
  static async getTextModels(): Promise<any[]> {
    try {
      const models = await pollinations.llm.getModels();
      return models;
    } catch (error) {
      console.error('Failed to get text models from Pollinations:', error);
      throw new Error('Failed to get text models from Pollinations API.');
    }
  }

  /**
   * Generate character audio using Pollinations API (if available)
   * 
   * This function attempts to generate audio for a character using the Pollinations API.
   * Note that this feature may require special access or credits.
   * 
   * @param character - The character to generate audio for
   * @param voiceLine - The voice line for the character to speak
   * @param voice - The voice to use for generation (default: 'alloy')
   * @returns Promise resolving to audio data or null if not available
   * @throws Will throw an error if the API call fails
   * 
   * @example
   * ```typescript
   * // Generate character audio
   * const audioData = await PollinationsService.generateCharacterAudio(
   *   character,
   *   'I will protect the innocent.',
   *   'alloy'
   * );
   * ```
   */
  static async generateCharacterAudio(
    character: Character,
    voiceLine: string,
    voice: string = 'alloy',
  ): Promise<any> {
    try {
      // Check if audio model is available
      const models = await this.getTextModels();
      const audioModel = models.find(m => m.name === 'openai-audio' && m.audio);
      
      if (!audioModel) {
        console.warn('Audio model not available in Pollinations');
        return null;
      }
      
      // Generate audio using Pollinations
      const audioResponse = await pollinations.llm.generateTextPost({
        messages: [
          { 
            role: 'user', 
            content: `Generate audio for a character named ${character.name} saying: "${voiceLine}". Use voice: ${voice}.`, 
          },
        ],
        model: 'openai-audio',
        jsonMode: false,
      });
      
      return audioResponse;
    } catch (error: any) {
      // Handle the 402 Payment Required error specifically
      if (error.response && error.response.status === 402) {
        console.warn('Audio generation requires payment or special access');
        return null;
      }
      
      console.error('Failed to generate character audio with Pollinations:', error);
      throw new Error('Failed to generate character audio with Pollinations API.');
    }
  }
}