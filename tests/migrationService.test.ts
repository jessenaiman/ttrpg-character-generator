// Test for Migration service
import { 
  addVersionToCharacters, 
  normalizeCharacterNames, 
  addTagsToCharacters, 
  runMigrations, 
  resetDatabase, 
  backupDatabase, 
  restoreDatabase, 
  validateDatabase 
} from '../services/migrationService';

describe('Migration Service', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Mock console methods to avoid cluttering test output
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore console methods after each test
    jest.restoreAllMocks();
  });

  test('should export all migration functions', () => {
    // Just verify that all functions exist and are exported
    expect(typeof addVersionToCharacters).toBe('function');
    expect(typeof normalizeCharacterNames).toBe('function');
    expect(typeof addTagsToCharacters).toBe('function');
    expect(typeof runMigrations).toBe('function');
    expect(typeof resetDatabase).toBe('function');
    expect(typeof backupDatabase).toBe('function');
    expect(typeof restoreDatabase).toBe('function');
    expect(typeof validateDatabase).toBe('function');
  });
});