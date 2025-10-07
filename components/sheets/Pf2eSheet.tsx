import React from 'react';
import { Pf2eCharacter } from '../../types';
import { StatBlock, SheetSection, ValueBox, IconListItem, Pill } from './SheetComponents';
import { BackpackIcon, ScrollIcon } from '../icons';

interface Pf2eSheetProps {
  character: Pf2eCharacter;
}

const PF2eSheet: React.FC<Pf2eSheetProps> = ({ character: char }) => {
    const getModifier = (score: number) => Math.floor((score - 10) / 2);
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                <StatBlock label="STR" value={char.attributes.strength} modifier={getModifier(char.attributes.strength)} />
                <StatBlock label="DEX" value={char.attributes.dexterity} modifier={getModifier(char.attributes.dexterity)} />
                <StatBlock label="CON" value={char.attributes.constitution} modifier={getModifier(char.attributes.constitution)} />
                <StatBlock label="INT" value={char.attributes.intelligence} modifier={getModifier(char.attributes.intelligence)} />
                <StatBlock label="WIS" value={char.attributes.wisdom} modifier={getModifier(char.attributes.wisdom)} />
                <StatBlock label="CHA" value={char.attributes.charisma} modifier={getModifier(char.attributes.charisma)} />
            </div>

            <div className="grid grid-cols-3 gap-2">
                <ValueBox label="Armor Class" value={char.armorClass} />
                <ValueBox label="Hit Points" value={char.hitPoints} />
                <ValueBox label="Speed" value={char.speed} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SheetSection title="Skills">
                    <div className="flex flex-wrap">
                        {char.skills.map(s => <Pill key={s.name}>{s.name} ({s.rank})</Pill>)}
                    </div>
                </SheetSection>
                
                <SheetSection title="Attacks & Equipment">
                     <h4 className="font-bold text-gray-400 mb-2 print-text-black">Attacks</h4>
                    <div className="space-y-2 mb-4">
                        {char.attacks.map((attack, i) => (
                            <div key={i} className="text-sm text-gray-300 print-text-black">
                                <span className="font-bold">{attack.name}:</span> {attack.bonus} to hit, {attack.damage}.
                            </div>
                        ))}
                    </div>
                    <h4 className="font-bold text-gray-400 mt-4 mb-2 print-text-black">Equipment</h4>
                    <ul className="list-inside text-gray-300 text-sm space-y-2">
                        {char.equipment.map((item, i) => <IconListItem key={i} icon={<BackpackIcon />}>{item}</IconListItem>)}
                    </ul>
                </SheetSection>

                <SheetSection title="Appearance">
                    <ul className="space-y-2 text-sm">
                        {char.appearance.map((item, i) => <IconListItem key={i} icon={<ScrollIcon/>}>{item}</IconListItem>)}
                    </ul>
                </SheetSection>
                
                <SheetSection title="Personality">
                    <ul className="space-y-2 text-sm">
                        {char.personality.map((item, i) => <IconListItem key={i} icon={<ScrollIcon/>}>{item}</IconListItem>)}
                    </ul>
                </SheetSection>
                
                <div className="md:col-span-2">
                    <SheetSection title="Backstory">
                        <ul className="space-y-2 text-sm">
                            {char.backstory.map((item, i) => <IconListItem key={i} icon={<ScrollIcon/>}>{item}</IconListItem>)}
                        </ul>
                    </SheetSection>
                </div>
            </div>
        </div>
    );
};

export default PF2eSheet;