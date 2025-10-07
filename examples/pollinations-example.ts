// Example usage of Pollinations as a free alternative for character generation
import { GameSystem, Character, DndCharacter, Pf2eCharacter, BladesCharacter } from '../types';
import { PollinationsService } from '../services/pollinationsService';

/**
 * Example usage of Pollinations as a free alternative for character generation
 * 
 * This module demonstrates how to use the Pollinations API as a cost-effective
 * alternative to commercial APIs for TTRPG character generation.
 * 
 * @example
 * ```typescript
 * // Generate a D&D character with image and audio using Pollinations
 * const character = await generateCharacterWithMedia(
 *   GameSystem.DND5E,
 *   'A brave warrior who is afraid of the dark'
 * );
 * ```
 */

/**
 * Generate a character with image and audio using Pollinations
 * 
 * This function demonstrates the full capabilities of Pollinations by generating
 * a complete character with both visual and audio representations.
 * 
 * @param system - The game system for which to generate a character
 * @param prompt - The concept or idea for the character to generate
 * @returns Promise resolving to a character with image and audio data
 * @throws Will throw an error if any part of the generation fails
 * 
 * @example
 * ```typescript
 * // Generate a complete character with media
 * const characterWithMedia = await generateCharacterWithMedia(
 *   GameSystem.DND5E,
 *   'A stoic half-orc barbarian who is afraid of the dark'
 * );
 * 
 * // Access the character data
 * console.log('Character name:', characterWithMedia.character.name);
 * console.log('Character image buffer length:', characterWithMedia.imageBuffer?.length);
 * console.log('Character audio data:', characterWithMedia.audioData);
 * ```
 */
export const generateCharacterWithMedia = async (
  system: GameSystem,
  prompt: string
): Promise<{
  character: Character;
  imageBuffer?: Buffer;
  audioData?: any;
}> => {
  try {
    // Generate the character using Pollinations
    const character = await PollinationsService.generateCharacter(system, prompt);
    
    // Generate character image using Pollinations
    let imageBuffer: Buffer | undefined;
    try {
      imageBuffer = await PollinationsService.generateCharacterImage(
        `Portrait of a ${character.name}, ${prompt}`
      );
    } catch (imageError) {
      console.warn('Failed to generate character image:', imageError);
      // Continue without image if generation fails
    }
    
    // Generate character audio using Pollinations (if available)
    let audioData: any | undefined;
    try {
      // Try to generate audio with a simple voice line
      const voiceLine = "I will protect the innocent.";
      audioData = await PollinationsService.generateCharacterAudio(
        character,
        voiceLine
      );
    } catch (audioError) {
      console.warn('Failed to generate character audio:', audioError);
      // Continue without audio if generation fails
    }
    
    return {
      character,
      imageBuffer,
      audioData,
    };
  } catch (error) {
    console.error('Failed to generate character with media:', error);
    throw new Error('Failed to generate character with Pollinations API.');
  }
};

/**
 * Generate multiple characters with images using Pollinations
 * 
 * This function demonstrates batch character generation with visual representations
 * using the Pollinations API.
 * 
 * @param system - The game system for which to generate characters
 * @param prompts - Array of character concepts to generate
 * @returns Promise resolving to an array of characters with image data
 * @throws Will throw an error if any part of the generation fails
 * 
 * @example
 * ```typescript
 * // Generate multiple characters with images
 * const charactersWithImages = await generateCharactersWithImages(
 *   GameSystem.DND5E,
 *   [
 *     'A brave warrior who is afraid of the dark',
 *     'A cunning tiefling rogue with a heart of gold',
 *     'A grizzled dwarven cleric who has lost their faith'
 *   ]
 * );
 * 
 * // Access the character data
 * charactersWithImages.forEach((charWithImage, index) => {
 *   console.log(`Character ${index + 1}:`, charWithImage.character.name);
 *   console.log(`Image buffer length:`, charWithImage.imageBuffer?.length);
 * });
 * ```
 */
export const generateCharactersWithImages = async (
  system: GameSystem,
  prompts: string[]
): Promise<Array<{ character: Character; imageBuffer?: Buffer }>> => {
  try {
    // Generate all characters in parallel
    const characterPromises = prompts.map(prompt =>
      PollinationsService.generateCharacter(system, prompt)
    );
    
    const characters = await Promise.all(characterPromises);
    
    // Generate images for all characters in parallel
    const imagePromises = characters.map(async (character, index) => {
      try {
        const imageBuffer = await PollinationsService.generateCharacterImage(
          `Portrait of a ${character.name}, ${prompts[index]}`
        );
        return imageBuffer;
      } catch (imageError) {
        console.warn(`Failed to generate image for character ${index}:`, imageError);
        return undefined;
      }
    });
    
    const imageBuffers = await Promise.all(imagePromises);
    
    // Combine characters with their images
    return characters.map((character, index) => ({
      character,
      imageBuffer: imageBuffers[index],
    }));
  } catch (error) {
    console.error('Failed to generate characters with images:', error);
    throw new Error('Failed to generate characters with Pollinations API.');
  }
};

/**
 * Get available models from Pollinations
 * 
 * This function retrieves information about available models from the Pollinations API.
 * 
 * @returns Promise resolving to information about available models
 * @throws Will throw an error if the API call fails
 * 
 * @example
 * ```typescript
 * // Get available models
 * const models = await getAvailableModels();
 * console.log('Image models:', models.imageModels);
 * console.log('Text models:', models.textModels);
 * ```
 */
export const getAvailableModels = async (): Promise<{
  imageModels: string[];
  textModels: any[];
}> => {
  try {
    // Get image models
    const imageModels = await PollinationsService.getImageModels();
    
    // Get text models
    const textModels = await PollinationsService.getTextModels();
    
    return {
      imageModels,
      textModels,
    };
  } catch (error) {
    console.error('Failed to get available models:', error);
    throw new Error('Failed to get available models from Pollinations API.');
  }
};

/**
 * Generate character suggestions using Pollinations
 * 
 * This function generates creative character concept prompts for a given game system
 * using the Pollinations API.
 * 
 * @param system - The game system for which to generate suggestions
 * @returns Promise resolving to an array of character concept prompts
 * @throws Will throw an error if the API call fails
 * 
 * @example
 * ```typescript
 * // Generate character suggestions
 * const suggestions = await generateCharacterSuggestions(GameSystem.DND5E);
 * console.log('Character suggestions:', suggestions);
 * ```
 */
export const generateCharacterSuggestions = async (
  system: GameSystem
): Promise<string[]> => {
  try {
    // Create system-specific prompt
    let systemName = '';
    switch (system) {
      case GameSystem.DND5E:
        systemName = 'Dungeons & Dragons 5th Edition';
        break;
      case GameSystem.PF2E:
        systemName = 'Pathfinder 2nd Edition';
        break;
      case GameSystem.BLADES:
        systemName = 'Blades in the Dark';
        break;
      default:
        systemName = 'the game';
    }
    
    // Generate suggestions using Pollinations
    const suggestions = await PollinationsService.generateTextGet({
      prompt: `Generate 10 creative character concept prompts for ${systemName}. Each prompt should be a few words to a short sentence describing an interesting character concept. Return as an array of strings.`,
      model: 'openai',
      jsonMode: true,
    });
    
    return suggestions as string[];
  } catch (error) {
    console.error('Failed to generate character suggestions:', error);
    throw new Error('Failed to generate character suggestions with Pollinations API.');
  }
};

// Example usage
if (require.main === module) {
  // Example: Generate a D&D character with media
  generateCharacterWithMedia(
    GameSystem.DND5E,
    'A brave warrior who is afraid of the dark'
  )
    .then(result => {
      console.log('Generated character with media:');
      console.log('- Name:', result.character.name);
      console.log('- System:', result.character.system);
      console.log('- Image buffer length:', result.imageBuffer?.length || 0);
      console.log('- Audio data:', result.audioData || 'Not available');
    })
    .catch(error => {
      console.error('Error generating character with media:', error);
    });
  
  // Example: Generate multiple characters with images
  generateCharactersWithImages(
    GameSystem.DND5E,
    [
      'A brave warrior who is afraid of the dark',
      'A cunning tiefling rogue with a heart of gold',
      'A grizzled dwarven cleric who has lost their faith',
    ]
  )
    .then(results => {
      console.log('Generated characters with images:');
      results.forEach((result, index) => {
        console.log(`- Character ${index + 1}: ${result.character.name}`);
        console.log(`  Image buffer length: ${result.imageBuffer?.length || 0}`);
      });
    })
    .catch(error => {
      console.error('Error generating characters with images:', error);
    });
  
  // Example: Get available models
  getAvailableModels()
    .then(models => {
      console.log('Available models:');
      console.log('- Image models:', models.imageModels);
      console.log('- Text models:', models.textModels.length);
    })
    .catch(error => {
      console.error('Error getting available models:', error);
    });
  
  // Example: Generate character suggestions
  generateCharacterSuggestions(GameSystem.DND5E)
    .then(suggestions => {
      console.log('Character suggestions:');
      suggestions.forEach((suggestion, index) => {
        console.log(`- ${index + 1}: ${suggestion}`);
      });
    })
    .catch(error => {
      console.error('Error generating character suggestions:', error);
    });
}