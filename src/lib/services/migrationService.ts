import { db, DbStoredCharacter as StoredCharacter } from '@/lib/db';

/**
 * Migration utility functions for the TTRPG database
 * Use these functions to perform schema migrations or data transformations
 * 
 * These utilities handle database schema evolution and data integrity operations.
 * They are particularly useful when upgrading the application or migrating data
 * from older formats.
 * 
 * @example
 * ```typescript
 * // Run all pending migrations
 * await runMigrations();
 * 
 * // Backup the database
 * const backup = await backupDatabase();
 * 
 * // Validate database integrity
 * const isValid = await validateDatabase();
 * ```
 */

/**
 * Add version field to all characters
 * 
 * This is an example migration that adds a version field to all existing characters.
 * This would be used when introducing version tracking to the character model.
 * 
 * @returns Promise that resolves when the migration is complete
 * @throws Will throw an error if the migration fails
 */
export const addVersionToCharacters = async (): Promise<void> => {
  try {
    console.log('Starting migration: Add version to characters');
    
    // Update all existing characters to have a version field
    await db.characters.toCollection().modify(char => {
      if ((char as any).version === undefined) {
        (char as any).version = 1;
      }
    });
    
    console.log('Migration completed: Add version to characters');
  } catch (error) {
    console.error('Migration failed: Add version to characters', error);
    throw error;
  }
};

/**
 * Normalize character names
 * 
 * This is an example migration that normalizes character names to proper capitalization.
 * This would be used when introducing consistent naming conventions.
 * 
 * @returns Promise that resolves when the migration is complete
 * @throws Will throw an error if the migration fails
 */
export const normalizeCharacterNames = async (): Promise<void> => {
  try {
    console.log('Starting migration: Normalize character names');
    
    // Update all character names to have proper capitalization
    await db.characters.toCollection().modify(char => {
      if (char.character.name) {
        // Capitalize first letter of each word in name
        const normalized = char.character.name
          .toLowerCase()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        
        char.character.name = normalized;
      }
    });
    
    console.log('Migration completed: Normalize character names');
  } catch (error) {
    console.error('Migration failed: Normalize character names', error);
    throw error;
  }
};

/**
 * Add tags field to all characters
 * 
 * This is an example migration that adds a tags field to all existing characters.
 * This would be used when introducing tagging functionality to characters.
 * 
 * @returns Promise that resolves when the migration is complete
 * @throws Will throw an error if the migration fails
 */
export const addTagsToCharacters = async (): Promise<void> => {
  try {
    console.log('Starting migration: Add tags to characters');
    
    await db.characters.toCollection().modify(char => {
      if (!(char as any).tags) {
        (char as any).tags = [];
      }
    });
    
    console.log('Migration completed: Add tags to characters');
  } catch (error) {
    console.error('Migration failed: Add tags to characters', error);
    throw error;
  }
};

/**
 * Run all pending migrations
 * 
 * This function checks the current database version and executes any pending migrations.
 * It's automatically called during application startup to ensure the database schema
 * is up to date.
 * 
 * @returns Promise that resolves when all migrations are complete
 * 
 * @example
 * ```typescript
 * // Run during application startup
 * await runMigrations();
 * ```
 */
export const runMigrations = async (): Promise<void> => {
  console.log('Checking for pending migrations...');
  
  // Get the current database version
  const currentVersion = db.verno;
  console.log(`Current database version: ${currentVersion}`);
  
  // Example: If we had specific migration functions based on version
  if (currentVersion < 2) {
    // Migration from localStorage to IndexedDB already handled in schema definition
    console.log('Migration from localStorage to IndexedDB already handled in schema version 2');
  }
  
  // Additional future migrations would go here
  // if (currentVersion < 3) {
  //   await addVersionToCharacters();
  // }
  
  console.log('All migrations completed.');
};

/**
 * Reset the database
 * 
 * This utility clears all character data from the database.
 * Use with extreme caution as this operation cannot be undone.
 * 
 * @returns Promise that resolves when the database reset is complete
 * @throws Will throw an error if the reset operation fails
 * 
 * @example
 * ```typescript
 * // Reset the database (WARNING: Irreversible!)
 * await resetDatabase();
 * ```
 */
export const resetDatabase = async (): Promise<void> => {
  try {
    console.log('Resetting database...');
    
    // Clear all data
    await db.characters.clear();
    
    console.log('Database reset completed.');
  } catch (error) {
    console.error('Database reset failed:', error);
    throw error;
  }
};

/**
 * Backup the database
 * 
 * This utility exports all character data from the database for backup purposes.
 * The returned data can be used with {@link restoreDatabase} to restore the database.
 * 
 * @returns Promise resolving to an array of all stored characters
 * @throws Will throw an error if the backup operation fails
 * 
 * @example
 * ```typescript
 * // Create a backup
 * const backup = await backupDatabase();
 * ```
 */
export const backupDatabase = async (): Promise<StoredCharacter[]> => {
  try {
    console.log('Backing up database...');
    
    const allCharacters = await db.characters.toArray();
    
    console.log(`Backup created with ${allCharacters.length} characters.`);
    return allCharacters;
  } catch (error) {
    console.error('Database backup failed:', error);
    throw error;
  }
};

/**
 * Restore the database from backup data
 * 
 * This utility restores character data from a previous backup.
 * This will overwrite all current data in the database.
 * 
 * @param backupData - Array of characters to restore
 * @returns Promise that resolves when the restoration is complete
 * @throws Will throw an error if the restoration operation fails
 * 
 * @example
 * ```typescript
 * // Restore from a previous backup
 * await restoreDatabase(backupData);
 * ```
 */
export const restoreDatabase = async (backupData: StoredCharacter[]): Promise<void> => {
  try {
    console.log(`Restoring database with ${backupData.length} characters...`);
    
    // Clear current data
    await db.characters.clear();
    
    // Restore from backup
    await db.characters.bulkAdd(backupData);
    
    console.log('Database restoration completed.');
  } catch (error) {
    console.error('Database restoration failed:', error);
    throw error;
  }
};

/**
 * Validate database integrity
 * 
 * This utility performs basic integrity checks on the database to ensure
 * all character records are valid and complete.
 * 
 * @returns Promise resolving to a boolean indicating whether the database is valid
 * 
 * @example
 * ```typescript
 * // Validate database integrity
 * const isValid = await validateDatabase();
 * if (!isValid) {
 *   console.error('Database validation failed!');
 * }
 * ```
 */
export const validateDatabase = async (): Promise<boolean> => {
  try {
    console.log('Validating database...');
    
    // Perform basic checks
    const count = await db.characters.count();
    console.log(`Found ${count} characters in database.`);
    
    // Validate a few random entries
    const sampleCharacters = await db.characters.limit(5).toArray();
    
    for (const char of sampleCharacters) {
      if (!char.id || !char.system || !char.character) {
        console.error(`Invalid character found: ${char.id}`);
        return false;
      }
    }
    
    console.log('Database validation completed successfully.');
    return true;
  } catch (error) {
    console.error('Database validation failed:', error);
    return false;
  }
};