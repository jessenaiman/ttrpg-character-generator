export enum GameSystem {
  DND5E = 'dnd5e',
  PF2E = 'pf2e',
  BLADES = 'blades',
}

export interface Attack {
  name: string;
  bonus: string;
  damage: string;
}

export interface DndCharacter {
  name: string;
  race: string;
  class: string;
  background: string;
  alignment: string;
  hitPoints: number;
  armorClass: number;
  speed: string;
  stats: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  skills: string[];
  proficiencies: {
    weapons: string[];
    armor: string[];
    tools: string[];
  };
  attacks: Attack[];
  backstory: string[];
  appearance: string[];
  personality: string[];
  equipment: string[];
}

export interface Pf2eCharacter {
  name: string;
  ancestry: string;
  heritage: string;
  background: string;
  class: string;
  alignment: string;
  hitPoints: number;
  armorClass: number;
  speed: string;
  attributes: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  skills: { name: string; rank: string }[];
  attacks: Attack[];
  backstory: string[];
  appearance: string[];
  personality: string[];
  equipment: string[];
}

export interface BladesCharacter {
  name: string;
  playbook: string;
  heritage: string;
  background: string;
  vice: string;
  purveyor: string;
  appearance: string[];
  aliases: string[];
  attributes: {
    insight: number;
    prowess: number;
    resolve: number;
  };
  actionRatings: { action: string; rating: number }[];
  specialAbilities: string[];
  friends: string[];
  drives: string[];
  gear: { name: string; load: number }[];
  harm: {
    level3: string;
    level2: string;
    level1: string;
  };
}

export type Character = DndCharacter | Pf2eCharacter | BladesCharacter;

// New type to hold a generated character with its metadata
export interface LocalStoredCharacter {
  id: string;
  system: GameSystem;
  prompt: string;
  character: Character;
  isNpc: boolean;
}
