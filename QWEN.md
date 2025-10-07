# TTRPG Character Generator

## Project Overview

The TTRPG Character Generator is a web application built with React and TypeScript that uses Google's Gemini AI to automatically generate detailed characters for tabletop role-playing games (TTRPGs). The application supports three major game systems: Dungeons & Dragons 5e, Pathfinder 2e, and Blades in the Dark.

The application provides a user-friendly interface where users can input character concepts and receive fully fleshed-out characters with all relevant game statistics, personality traits, backstories, and other details appropriate to the selected TTRPG system. Generated characters are stored in browser local storage and can be viewed, exported, or deleted as needed.

### Key Technologies
- React 19.1.1 (with TypeScript)
- Google GenAI SDK (@google/genai 1.14.0)
- Vite 6.2.0 (bundler/build tool)
- Langfuse 3.13.2 (for observability)
- Tailwind CSS (for styling, inferred from class names)

### Architecture Components
- **App.tsx**: Main application component that manages state and orchestrates components
- **geminiService.ts**: Service that communicates with Google's Gemini API to generate character data
- **types.ts**: Defines TypeScript interfaces for different character types and game systems
- **components/**: Contains all reusable UI components
- **services/**: Contains business logic and external service integrations

## Building and Running

### Prerequisites
- Node.js (version compatible with the project dependencies)

### Setup and Execution
1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up your environment variables:
   - Create a `.env` file with your Gemini API key:
   ```
   GEMINI_API_KEY="your_api_key_here"
   ```
   (Note: The project already includes a .env file with sample keys)

3. Run the development server:
   ```bash
   npm run dev
   ```

4. For production build:
   ```bash
   npm run build
   ```
   
5. To preview the production build:
   ```bash
   npm run preview
   ```

## Development Conventions

### Project Structure
- `/components`: React UI components (organized by functionality)
  - `/sheets`: Character sheet components for different game systems
  - `/icons`: SVG icon components
- `/services`: Business logic and external API integrations
- Root level: Main application files (App.tsx, index.tsx, types.ts, etc.)

### State Management
- The application uses React hooks (useState, useEffect, useCallback) for state management
- Character data is stored in browser local storage under the key 'ttrpg-characters'
- The main App component manages the application state (selected system, characters list, etc.)

### Character Generation Process
1. User selects a game system and provides a character prompt
2. The geminiService makes an API call to Google's Gemini model (gemini-2.5-flash)
3. The API returns structured JSON data based on the game system's schema
4. The generated character is stored in local storage and displayed to the user

### Game Systems Supported
1. **Dungeons & Dragons 5e (DND5E)**: Complete character with race, class, attributes, skills, proficiencies, etc.
2. **Pathfinder 2e (PF2E)**: Character with ancestry, heritage, class, attributes, and skill ranks
3. **Blades in the Dark (BLADES)**: Character with playbook, vice, attributes, and action ratings

### Key Features
- Character generation with rich backstories and personality traits
- NPC generation based on existing characters
- Local storage persistence of generated characters
- Character export functionality (MDX format)
- Responsive UI with character compendium
- Loading indicators and error handling
- System-specific character suggestions

### Code Style
- Uses functional React components with TypeScript
- Follows React best practices with proper use of hooks
- Consistent naming conventions (camelCase for variables, PascalCase for components)
- TypeScript interfaces for type safety across different TTRPG systems
- Component-based architecture with clear separation of concerns

### Naming Conventions
- React components use PascalCase (e.g., CharacterGenerator.tsx)
- Utility functions use camelCase (e.g., generateCharacter)
- Constants use UPPER_SNAKE_CASE (e.g., GAME_SYSTEMS)
- Enums use PascalCase (e.g., GameSystem)

### External Dependencies
- Google GenAI for AI-powered character creation
- Langfuse for AI observability and tracing
- React ecosystem for UI development