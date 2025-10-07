# ORM and Database Migration System

## Overview
This document explains the ORM (Object-Relational Mapping) implementation and database migration system added to the TTRPG Character Generator application. The solution uses Dexie.js, a wrapper for IndexedDB that provides an ORM-like interface with robust migration capabilities.

## Components

### 1. Database Schema (`database.ts`)
- **Backend**: IndexedDB (browser-based database)
- **ORM Layer**: Dexie.js
- **Schema Versioning**: Versioned schema changes with migration support
- **Data Model**: `StoredCharacter` interface with timestamps

### 2. Service Layer (`services/databaseService.ts`)
- **CRUD Operations**: Create, Read, Update, Delete operations
- **Query Methods**: Search, filter, and sort operations
- **Batch Operations**: Bulk upsert operations for efficiency

### 3. Migration System (`services/migrationService.ts`)
- **Schema Migrations**: Structured approach to database schema changes
- **Data Migrations**: Transform existing data when schemas change
- **Utility Functions**: Backup, restore, validation, and reset capabilities

## Schema Versioning

The database schema is versioned to handle changes over time:

### Version 1
- Basic character storage with indexes on `id`, `system`, and `isNpc`

### Version 2
- Migration from localStorage to IndexedDB
- Added `createdAt` and `updatedAt` timestamp fields
- Preserves all existing character data

### Future Versions
- New schema versions can be added with migration logic
- Example migration patterns are provided in the service

## Data Model

The `StoredCharacter` interface includes:
- `id`: Unique identifier (UUID)
- `system`: Game system (DND5E, PF2E, BLADES)
- `prompt`: Original generation prompt
- `character`: The generated character data (specific to game system)
- `isNpc`: Boolean indicating if character is an NPC
- `createdAt`: Timestamp when character was created
- `updatedAt`: Timestamp when character was last modified

## Migration Process

### Automatic Migration
- Schema version 2 automatically migrates data from localStorage on first application load
- This ensures no data loss when users update to the new version

### Manual Migration Process
For future schema changes:
1. Increment the database version number
2. Define the new schema in the version call
3. Provide upgrade logic in the `.upgrade()` method
4. Test migration with sample data

## Service Methods

### DatabaseService
- `getAllCharacters()` - Get all characters sorted by creation date
- `getCharactersBySystem(system)` - Get characters filtered by game system
- `getCharactersByNpcStatus(isNpc)` - Get characters filtered by NPC status
- `getCharacterById(id)` - Get a specific character by ID
- `addCharacter(character)` - Add a new character to the database
- `updateCharacter(id, updates)` - Update an existing character
- `deleteCharacter(id)` - Delete a character by ID
- `bulkUpsert(characters)` - Bulk update or insert multiple characters
- `clearAllCharacters()` - Clear all characters (use with caution)
- `getCharacterCount()` - Get the total number of characters
- `searchCharacters(searchTerm)` - Search characters by name, prompt, or details
- `getCharactersByDateRange(startDate, endDate)` - Get characters created in a date range

### MigrationService
- `runMigrations()` - Execute all pending migrations
- `backupDatabase()` - Create a backup of all characters
- `restoreDatabase(backupData)` - Restore database from backup
- `validateDatabase()` - Validate database integrity
- `resetDatabase()` - Reset the database (clears all data)
- Custom migration functions for specific schema changes

## Usage

### Reading Data
```typescript
import { DatabaseService } from './services/databaseService';

// Get all characters
const characters = await DatabaseService.getAllCharacters();

// Get characters by system
const dndCharacters = await DatabaseService.getCharactersBySystem(GameSystem.DND5E);
```

### Writing Data
```typescript
import { DatabaseService } from './services/databaseService';

// Add a new character
const characterId = await DatabaseService.addCharacter({
  id: crypto.randomUUID(),
  system: GameSystem.DND5E,
  prompt: 'A wise old wizard',
  character: generatedCharacterData,
  isNpc: false,
  createdAt: new Date(),
  updatedAt: new Date(),
});
```

### Migrating Data
When schema changes are needed, the migration system handles the transition automatically when the version is incremented.

## Benefits

1. **Structured Data Storage**: Replaces unstructured localStorage with a proper database
2. **Migration Support**: Handles schema changes and data transformations over time
3. **Query Capabilities**: Enables complex queries beyond simple key-value lookups
4. **Performance**: IndexedDB offers better performance for larger datasets
5. **Type Safety**: TypeScript interfaces ensure type safety throughout the application
6. **Scalability**: Can handle much larger datasets than localStorage

## Future Considerations

1. **Remote Sync**: Could be extended to sync with a backend service
2. **Advanced Queries**: Additional indexes could be added for more complex queries
3. **Encrypted Storage**: For sensitive user data, encryption could be added
4. **Schema Validation**: Additional validation could be added to ensure data integrity