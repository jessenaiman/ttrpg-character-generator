# TTRPG Character Generator Architecture Documentation

## Overview
The TTRPG Character Generator is a web application that allows users to generate characters for various tabletop RPG systems using AI. The application uses a combination of technologies to provide a seamless user experience.

## Architecture Components

### Frontend
- **React 19.1.1**: Modern UI framework with TypeScript support
- **Vite 6.2.0**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Shadcn UI Components**: Pre-built accessible UI components

### Backend Services
- **Google GenAI**: AI service for character generation
- **Pollinations**: Alternative free AI service with image and audio capabilities
- **Prisma ORM**: Database abstraction layer for SQLite persistence
- **Dexie.js**: Client-side database for localStorage replacement (deprecated but maintained for backward compatibility)

### Database
- **SQLite**: Lightweight, file-based database
- **Prisma**: ORM for type-safe database operations
- **Schema Migration**: Versioned schema updates with automatic migration

### Testing
- **Jest**: Unit testing framework
- **Playwright**: End-to-end testing framework
- **ESLint**: Code quality enforcement
- **Prettier**: Code formatting tool
- **Husky**: Git hooks for pre-commit checks

## Data Flow

### Character Generation
1. User selects game system and enters character concept
2. Application sends request to Google GenAI or Pollinations API
3. AI service generates character data based on schema
4. Generated character is saved to SQLite database via Prisma ORM
5. Character is displayed in UI with export options

### Character Storage
1. Characters are persisted in SQLite database using Prisma ORM
2. Schema enforces data structure and relationships
3. Automatic migrations handle schema evolution
4. Characters can be retrieved, updated, and deleted

### Character Export
1. Characters can be exported as MDX files for documentation
2. Export service formats character data appropriately for each system
3. Download is triggered via browser APIs

## Architecture Concerns and Considerations

### 1. Dual Database Approach
The application currently maintains two database approaches:
- **Prisma with SQLite**: Primary persistence layer
- **Dexie.js**: Legacy localStorage replacement (deprecated but maintained)

This dual approach provides redundancy but increases complexity. Future consideration should be given to migrating completely to Prisma.

### 2. API Service Redundancy
The application has multiple AI service implementations:
- **Google GenAI**: Primary service
- **Pollinations**: Alternative free service with additional capabilities (image/audio)

This redundancy provides flexibility but requires maintaining multiple service implementations.

### 3. Testing Coverage
While unit test coverage has been improved to 36.14%, end-to-end testing with Playwright is still limited. Additional E2E tests would improve confidence in the complete workflow.

### 4. Data Migration
The application includes migration utilities for transitioning from localStorage to IndexedDB and now to SQLite. These migrations need to be carefully maintained to prevent data loss during upgrades.

## Future Improvements

### 1. Consolidate Database Approaches
- Migrate completely to Prisma ORM with SQLite
- Remove legacy Dexie.js implementation
- Simplify data access patterns

### 2. Enhance Pollinations Integration
- Fully implement image generation capabilities
- Add audio generation for character voices
- Integrate visual and audio assets into character sheets

### 3. Improve Testing
- Expand Playwright E2E test coverage
- Add integration tests for API services
- Implement snapshot testing for UI components

### 4. Performance Optimization
- Add database indexing for common queries
- Implement caching for frequently requested data
- Optimize character generation prompts for faster responses

### 5. User Experience Enhancements
- Add character customization options
- Implement character sharing functionality
- Add campaign management features
- Include character progression tracking

## Deployment Considerations

### Environment Variables
The application requires the following environment variables:
- `API_KEY`: Google GenAI API key for character generation
- `GEMINI_API_KEY`: Alternative Gemini API key (if used)
- `LANGFUSE_SECRET_KEY`: Langfuse secret key for observability
- `LANGFUSE_PUBLIC_KEY`: Langfuse public key for observability
- `LANGFUSE_HOST`: Langfuse host for observability

### Database Management
- SQLite database file is stored in the application directory
- Schema migrations are handled automatically by Prisma
- Regular backups are recommended for production deployments

### Scaling Considerations
- SQLite is suitable for single-user applications
- For multi-user deployments, consider upgrading to PostgreSQL
- Prisma makes database migration straightforward
- CDN hosting recommended for static assets

## Security Considerations

### Data Privacy
- All character data is stored locally in SQLite database
- No character data is transmitted to external servers except for AI generation
- Users should be aware of data storage location and backup responsibilities

### API Security
- API keys should be kept secure and not committed to version control
- Rate limiting should be considered for high-volume usage
- Error handling should prevent leaking sensitive information

### Input Validation
- Character generation prompts are sanitized before API submission
- Database inputs are validated through Prisma schema
- File exports use safe filename generation to prevent path traversal

## Maintenance Guidelines

### Code Quality
- ESLint and Prettier enforce consistent code style
- Husky Git hooks prevent poor quality commits
- TypeScript provides strong typing throughout the application

### Updates
- Prisma schema updates require migration scripts
- Dependency updates should be tested thoroughly
- Breaking changes in AI APIs require service updates

### Testing
- Unit tests cover core functionality
- E2E tests verify complete workflows
- Coverage thresholds ensure quality maintenance