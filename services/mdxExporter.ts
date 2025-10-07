import { LocalStoredCharacter as StoredCharacter, GameSystem, DndCharacter, Pf2eCharacter, BladesCharacter } from '../types';

/**
 * Sanitize a filename by replacing non-alphanumeric characters with underscores
 * 
 * This function ensures filenames are safe for download and filesystem compatibility.
 * 
 * @param name - The original name to sanitize
 * @returns A sanitized version of the name with only alphanumeric characters and underscores
 */
const sanitizeFilename = (name: string): string => {
  return name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
};

/**
 * Generate MDX content for a D&D 5e character
 * 
 * This function creates a complete MDX document with frontmatter and character details
 * formatted specifically for D&D 5e characters.
 * 
 * @param char - The D&D 5e character to convert to MDX
 * @returns A string containing the complete MDX document
 */
const generateDndMdx = (char: DndCharacter): string => `---
title: "${char.name}"
system: "D&D 5e"
race: "${char.race}"
class: "${char.class}"
background: "${char.background}"
alignment: "${char.alignment}"
---

# ${char.name}
*${char.alignment} ${char.race} ${char.class}*

## Vitals
| Armor Class | Hit Points | Speed |
|:-----------:|:----------:|:-----:|
| ${char.armorClass} | ${char.hitPoints} | ${char.speed} |

## Ability Scores
| STR | DEX | CON | INT | WIS | CHA |
|:---:|:---:|:---:|:---:|:---:|:---:|
| ${char.stats.strength} | ${char.stats.dexterity} | ${char.stats.constitution} | ${char.stats.intelligence} | ${char.stats.wisdom} | ${char.stats.charisma} |

## Skills & Proficiencies
**Skills:** ${char.skills.join(', ')}

**Armor:** ${char.proficiencies.armor.join(', ')}
**Weapons:** ${char.proficiencies.weapons.join(', ')}
**Tools:** ${char.proficiencies.tools.join(', ')}

## Attacks
${char.attacks.map(a => `- **${a.name}:** ${a.bonus} to hit, ${a.damage}.`).join('\n')}

## Appearance
${char.appearance.map(item => `- ${item}`).join('\n')}

## Personality
${char.personality.map(item => `- ${item}`).join('\n')}

## Backstory
${char.backstory.map(item => `- ${item}`).join('\n')}

## Equipment
${char.equipment.map(item => `- ${item}`).join('\n')}
`;

/**
 * Generate MDX content for a Pathfinder 2e character
 * 
 * This function creates a complete MDX document with frontmatter and character details
 * formatted specifically for Pathfinder 2e characters.
 * 
 * @param char - The Pathfinder 2e character to convert to MDX
 * @returns A string containing the complete MDX document
 */
const generatePf2eMdx = (char: Pf2eCharacter): string => `---
title: "${char.name}"
system: "Pathfinder 2e"
ancestry: "${char.ancestry}"
heritage: "${char.heritage}"
class: "${char.class}"
background: "${char.background}"
alignment: "${char.alignment}"
---

# ${char.name}
*${char.alignment} ${char.ancestry} ${char.class}*

## Vitals
| Armor Class | Hit Points | Speed |
|:-----------:|:----------:|:-----:|
| ${char.armorClass} | ${char.hitPoints} | ${char.speed} |

## Attributes
| STR | DEX | CON | INT | WIS | CHA |
|:---:|:---:|:---:|:---:|:---:|:---:|
| ${char.attributes.strength} | ${char.attributes.dexterity} | ${char.attributes.constitution} | ${char.attributes.intelligence} | ${char.attributes.wisdom} | ${char.attributes.charisma} |

## Skills
${char.skills.map(s => `- ${s.name} (${s.rank})`).join('\n')}

## Attacks
${char.attacks.map(a => `- **${a.name}:** ${a.bonus} to hit, ${a.damage}.`).join('\n')}

## Appearance
${char.appearance.map(item => `- ${item}`).join('\n')}

## Personality
${char.personality.map(item => `- ${item}`).join('\n')}

## Backstory
${char.backstory.map(item => `- ${item}`).join('\n')}

## Equipment
${char.equipment.map(item => `- ${item}`).join('\n')}
`;

/**
 * Generate MDX content for a Blades in the Dark character
 * 
 * This function creates a complete MDX document with frontmatter and character details
 * formatted specifically for Blades in the Dark characters.
 * 
 * @param char - The Blades in the Dark character to convert to MDX
 * @returns A string containing the complete MDX document
 */
const generateBladesMdx = (char: BladesCharacter): string => `---
title: "${char.name}"
system: "Blades in the Dark"
playbook: "${char.playbook}"
heritage: "${char.heritage}"
background: "${char.background}"
vice: "${char.vice}"
---

# ${char.name}
*A ${char.heritage} ${char.playbook} from a ${char.background} background.*

**Vice:** ${char.vice} (Purveyor: ${char.purveyor})
**Aliases:** ${char.aliases.join(', ')}

## Attributes
| Insight | Prowess | Resolve |
|:-------:|:-------:|:-------:|
| ${char.attributes.insight} | ${char.attributes.prowess} | ${char.attributes.resolve} |

## Action Ratings
${char.actionRatings.map(ar => `- **${ar.action}:** ${ar.rating}`).join('\n')}

## Appearance
${char.appearance.map(item => `- ${item}`).join('\n')}

## Drives
${char.drives.map(item => `- ${item}`).join('\n')}

## Special Abilities
${char.specialAbilities.map(item => `- ${item}`).join('\n')}

## Friends / Rivals
${char.friends.map(item => `- ${item}`).join('\n')}

## Gear
${char.gear.map(item => `- ${item.name} (Load ${item.load})`).join('\n')}

## Harm
- **Level 3:** ${char.harm.level3 || ' '}
- **Level 2:** ${char.harm.level2 || ' '}
- **Level 1:** ${char.harm.level1 || ' '}
`;

/**
 * Export a character as an MDX file for download
 * 
 * This function generates MDX content based on the character's game system and triggers
 * a browser download of the file.
 * 
 * @param storedCharacter - The character to export, including metadata
 * @param storedCharacter.character - The character data object
 * @param storedCharacter.system - The game system for this character
 * @param storedCharacter.id - The unique identifier for this character
 * @param storedCharacter.prompt - The original prompt used to generate this character
 * @param storedCharacter.isNpc - Whether this character is an NPC
 * @param storedCharacter.createdAt - When this character was created
 * @param storedCharacter.updatedAt - When this character was last updated
 * 
 * @example
 * ```typescript
 * // Export a D&D 5e character
 * exportCharacterAsMdx({
 *   character: dndCharacter,
 *   system: GameSystem.DND5E,
 *   id: '123',
 *   prompt: 'A brave warrior',
 *   isNpc: false,
 *   createdAt: new Date(),
 *   updatedAt: new Date()
 * });
 * ```
 */
export const exportCharacterAsMdx = (storedCharacter: StoredCharacter) => {
  const { character, system } = storedCharacter;
  let mdxContent = '';
  let charName = 'character';

  switch (system) {
    case GameSystem.DND5E: {
      const dndChar = character as DndCharacter;
      mdxContent = generateDndMdx(dndChar);
      charName = dndChar.name;
      break;
    }
    case GameSystem.PF2E: {
      const pf2eChar = character as Pf2eCharacter;
      mdxContent = generatePf2eMdx(pf2eChar);
      charName = pf2eChar.name;
      break;
    }
    case GameSystem.BLADES: {
      const bladesChar = character as BladesCharacter;
      mdxContent = generateBladesMdx(bladesChar);
      charName = bladesChar.name;
      break;
    }
    default:
      console.error('Unknown system for MDX export');
      return;
  }

  const blob = new Blob([mdxContent], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${sanitizeFilename(charName)}.mdx`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};