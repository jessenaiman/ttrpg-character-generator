// Test for Pollinations service
import { PollinationsService } from '../src/lib/services/pollinationsService';

describe('PollinationsService', () => {
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
    expect(typeof PollinationsService.generateCharacter).toBe('function');
    expect(typeof PollinationsService.generateCharacterImage).toBe('function');
    expect(typeof PollinationsService.getImageModels).toBe('function');
    expect(typeof PollinationsService.getTextModels).toBe('function');
    expect(typeof PollinationsService.generateCharacterAudio).toBe('function');
  });
});