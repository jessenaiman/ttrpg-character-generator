# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Project Overview
TTRPG character generator supporting D&D 5e, Pathfinder 2e, and Blades in the Dark systems using AI-powered generation and local database storage.

## Critical Database Patterns
- Database automatically migrates from localStorage to IndexedDB on version 2 (services/databaseService.ts)
- Dexie.js schema uses compound indexes on system, isNpc, createdAt, updatedAt fields
- Always use DatabaseService methods instead of direct db access for proper error handling

## Character Generation Requirements
- Character prompts must generate 3-5 distinct bullet points for personality, backstory, and appearance arrays
- Pollinations API requires strict JSON schema adherence with specific system instructions
- Audio generation returns null on 402 payment errors (requires special access/credits)

## Service Layer Architecture
- Use DatabaseService for all database operations (never access db directly)
- PollinationsService handles AI character/image generation with fallback error handling
- Services use static methods with comprehensive JSDoc documentation

## Testing Setup
- Tests run from both tests/ and services/ directories with Jest
- Coverage thresholds set at 20% (unusually low - maintain this requirement)
- E2E tests use Playwright with UI mode available for debugging

## Code Quality Standards
- Explicit return types required on all functions (@typescript-eslint/explicit-function-return-type: warn)
- Single quotes and trailing commas mandatory (prettier/.eslintrc.json)
- no-explicit-any warnings must be addressed (not disabled)
- Semi-colons always required, console warnings allowed but not errors