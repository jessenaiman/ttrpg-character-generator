# Optimized AI Content Generation in TTRPG Character Generator

## Overview
This document outlines the optimizations made to the AI content generation in the TTRPG Character Generator app. The goal is to reduce the number of API calls while maintaining robust templates for character generation.

## Key Improvements

### 1. Schema Optimization
- **Common Properties Extraction**: Identified common properties across different game systems (D&D 5e, Pathfinder 2e, Blades in the Dark) and extracted them into shared schema definitions
- **Single Field Definition**: Attack schema and appearance schema are now defined once and reused across all systems
- **Modular Schema Structure**: Each game system schema now builds on a common set of properties

### 2. Batch Generation Capability
- **Combined Character/NPC Schema**: Created schemas that allow generating a main character and related NPCs in a single API call
- **generateCharacterWithNpcs Function**: New function that can generate both main character and associated NPCs in one request
- **Fallback Mechanism**: Maintains backward compatibility with single character generation if batch generation fails

### 3. Caching Implementation
- **In-Memory Cache**: Added a Map-based cache to store API responses for repeated requests
- **Cache Keys**: Uses system, prompt, and context to create unique cache keys
- **Suggestion Caching**: Character suggestions are now cached after first generation
- **Cache Invalidation**: Provides functions to clear specific cache entries

### 4. Enhanced Template Robustness
- **Improved JSON Schema Validation**: More detailed schema definitions ensure consistent data structure
- **Better Error Handling**: More graceful fallbacks when API calls fail
- **Consistent Field Definitions**: Each field now has clear descriptions for the AI model

## Usage Changes

### For Single Character Generation
```typescript
// Original approach
const character = await generateCharacter(system, prompt);

// New approach (maintains backward compatibility)
const character = await generateSingleCharacter(system, prompt);
```

### For Character with NPCs (Optimized - Single API Call)
```typescript
// New optimized approach
const { character, npcs } = await generateCharacterWithNpcs(system, prompt, 2);
// This generates 1 main character and up to 2 NPCs in a single API call
```

### For Suggestions (Cached)
```typescript
// First call hits API, subsequent calls use cache
const suggestions = await getCharacterSuggestions(system);

// To refresh suggestions (clear cache)
refreshSuggestions(system);
```

## Performance Benefits

### API Call Reduction
1. **NPC Generation**: Originally required 2 API calls (1 for character, 1 for NPC), now can be done in 1 call
2. **Suggestion Generation**: Now cached, so repeated requests don't hit the API
3. **Template Reuse**: Less redundant schema definitions reduce payload size

### Response Time Improvements
1. **Caching**: Repeated requests for the same content return immediately from cache
2. **Batch Processing**: Single API call for multiple related entities reduces network overhead
3. **Optimized Schemas**: More efficient schema definitions lead to faster validation

## Implementation Details

### Schema Structure
The new schema structure leverages inheritance principles:
- Common properties are defined once and reused
- Game-system-specific properties are added on top of common base
- This reduces code duplication and maintenance overhead

### Caching Strategy
- Cache is in-memory and local to each client session
- Keys are based on system, prompt, and generation context
- TTL is not implemented as content is not expected to change
- Cache is cleared when needed with explicit functions

### Error Handling
- Maintains backward compatibility when new features fail
- Graceful fallbacks to single generation if batch generation fails
- Clear error messages for debugging

## Migration Guide

### For App Integration
1. Replace import from `geminiService` to `geminiServiceOptimized`
2. Use `generateSingleCharacter` for single character generation
3. Use `generateCharacterWithNpcs` when you need related NPCs
4. Consider implementing suggestion caching for better UX

### For Future Development
1. Consider using batch generation when related entities are needed
2. Leverage the caching for frequently requested content
3. Build on the modular schema design for new features