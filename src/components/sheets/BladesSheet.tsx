import React from 'react';
import { BladesCharacter } from '../../types';
import { StatBlock, SheetSection, IconListItem } from './SheetComponents';
import { ScrollIcon, BackpackIcon } from '../icons';

interface BladesSheetProps {
  character: BladesCharacter;
}

const HarmTrack: React.FC<{harm: BladesCharacter['harm']}> = ({harm}) => (
    <div className="space-y-2">
        <div className="border border-gray-600 p-2 rounded bg-gray-900 print-bg-white print-border-gray">
            <label className="text-xs uppercase text-gray-400 print-text-black">Level 3 Harm (Fatal)</label>
            <p className="text-sm text-red-400 h-6 print-text-black">{harm.level3 || ' '}</p>
        </div>
        <div className="border border-gray-600 p-2 rounded bg-gray-900 print-bg-white print-border-gray">
            <label className="text-xs uppercase text-gray-400 print-text-black">Level 2 Harm (Severe)</label>
            <p className="text-sm text-orange-400 h-6 print-text-black">{harm.level2 || ' '}</p>
        </div>
        <div className="border border-gray-600 p-2 rounded bg-gray-900 print-bg-white print-border-gray">
            <label className="text-xs uppercase text-gray-400 print-text-black">Level 1 Harm (Less Severe)</label>
            <p className="text-sm text-yellow-400 h-6 print-text-black">{harm.level1 || ' '}</p>
        </div>
    </div>
);

const BladesSheet: React.FC<BladesSheetProps> = ({ character: char }) => (
    <div className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
            <StatBlock label="Insight" value={char.attributes.insight} />
            <StatBlock label="Prowess" value={char.attributes.prowess} />
            <StatBlock label="Resolve" value={char.attributes.resolve} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SheetSection title="Core Info" className="md:col-span-1">
                <p className="text-sm"><strong className="text-gray-400 print-text-black">Heritage:</strong> {char.heritage}</p>
                <p className="text-sm"><strong className="text-gray-400 print-text-black">Background:</strong> {char.background}</p>
                <p className="text-sm"><strong className="text-gray-400 print-text-black">Vice:</strong> {char.vice} ({char.purveyor})</p>
                <p className="text-sm"><strong className="text-gray-400 print-text-black">Aliases:</strong> {char.aliases.join(', ')}</p>
            </SheetSection>
            
            <SheetSection title="Action Ratings" className="md:col-span-2">
                <div className="columns-2 md:columns-3 text-sm">
                    {char.actionRatings.map(({ action, rating }) => (
                        <p key={action} className="mb-1"><strong className="text-gray-400 print-text-black">{action}:</strong> {'●'.repeat(rating)}{'○'.repeat(4-rating)}</p>
                    ))}
                </div>
            </SheetSection>

            <SheetSection title="Appearance" className="md:col-span-3">
                <ul className="space-y-2 text-sm">
                    {char.appearance.map((item, i) => <IconListItem key={i} icon={<ScrollIcon />}>{item}</IconListItem>)}
                </ul>
            </SheetSection>

            <SheetSection title="Drives" className="md:col-span-3">
                <ul className="space-y-2 text-sm">
                    {char.drives.map((item, i) => <IconListItem key={i} icon={<ScrollIcon />}>{item}</IconListItem>)}
                </ul>
            </SheetSection>
            
            <SheetSection title="Special Abilities" className="md:col-span-2">
                <ul className="text-sm space-y-2">
                    {char.specialAbilities.map((item, i) => <IconListItem key={i} icon={<ScrollIcon />}>{item}</IconListItem>)}
                </ul>
            </SheetSection>
            
             <SheetSection title="Harm">
                <HarmTrack harm={char.harm} />
            </SheetSection>
            
             <SheetSection title="Friends / Rivals">
                 <ul className="list-disc list-inside text-gray-300 text-sm space-y-1 print-text-black">
                    {char.friends.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
            </SheetSection>

            <SheetSection title="Gear">
                 <ul className="text-sm space-y-2">
                    {char.gear.map((item, i) => <IconListItem key={i} icon={<BackpackIcon />}><strong>{item.name}</strong> (Load: {item.load})</IconListItem>)}
                </ul>
            </SheetSection>
        </div>
    </div>
);

export default BladesSheet;