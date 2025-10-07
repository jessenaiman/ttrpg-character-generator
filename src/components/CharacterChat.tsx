import React, { useState, useRef, useEffect } from 'react';
import { LocalStoredCharacter as StoredCharacter, Character, DndCharacter, Pf2eCharacter, BladesCharacter } from '../types';
import { GoogleGenAI, Chat, GenerateContentResponse } from '@google/genai';
import { Langfuse } from 'langfuse';
import { SendIcon } from './icons';
import ChatMessage from './ChatMessage';
import { SheetSection } from './sheets/SheetComponents';

const CharacterChat: React.FC<{ storedCharacter: StoredCharacter }> = ({ storedCharacter }) => {
    const chatRef = useRef<Chat | null>(null);
    const [messages, setMessages] = useState<{ role: 'user' | 'model', content: string }[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);
    const langfuseRef = useRef<Langfuse | null>(null);

    // Get langfuse instance, initializing if it doesn't exist.
    const getLangfuse = (): Langfuse => {
        if (langfuseRef.current === null) {
            langfuseRef.current = new Langfuse({
                publicKey: 'pk-lf-2944db31-be9f-4383-87aa-152317d8c0f1',
                baseUrl: 'https://langfuse.omega-spiral.com',
            });
        }
        return langfuseRef.current;
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        // Reset state for new character
        setIsInitializing(true);
        setMessages([{ role: 'model', content: 'Thinking of something to ask you...' }]);
        setUserInput('');
        chatRef.current = null;
        
        const initializeChat = async (): Promise<void> => {
            const langfuse = getLangfuse();
            try {
                const trace = langfuse.trace({ name: 'character-chat-initialization', userId: storedCharacter.id });
                const generation = trace.generation({ name: 'initial-message-generation' });

                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                
                // 1. Generate initial message
                const initialPrompt = `You are roleplaying as a character. Based on the following character data: ${JSON.stringify(storedCharacter.character, null, 2)}. Your task is to generate a single, brief, in-character opening line (under 30 words). This line must be a question that invites the user to explore a specific part of your character sheet, such as your backstory, a skill, a personality trait, or a piece of equipment. The goal is to spark a conversation that could lead to the user wanting to add more detail to your character. Example questions: 'This old sword has seen many battles... I wonder, does its story interest you?' or 'They say I'm proficient with thieves' tools. Do you believe that's a skill for a hero, or a scoundrel?' Do not add any conversational filler, just provide the single question.`;
                generation.update({ input: initialPrompt });
                
                const result = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: initialPrompt,
                });
                const initialMessage = result.text.trim();
                generation.end({ output: initialMessage });

                setMessages([{ role: 'model', content: initialMessage }]);

                // 2. Setup the actual chat instance for conversation
                const systemInstruction = generateCharacterSystemPrompt(storedCharacter.character);
                const newChat = ai.chats.create({
                    model: 'gemini-2.5-flash',
                    config: { systemInstruction },
                });
                chatRef.current = newChat;

            } catch (err) {
                console.error('Failed to initialize character chat:', err);
                setMessages([{ role: 'model', content: 'Greetings. I\'m ready to talk when you are. What\'s on your mind?' }]);
            } finally {
                setIsInitializing(false);
                langfuse.flush();
            }
        };

        initializeChat();
    }, [storedCharacter]);

    const handleSendMessage = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        const chat = chatRef.current;
        if (!chat || !userInput.trim() || isLoading) return;
        
        const userMessage = { role: 'user' as const, content: userInput };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setUserInput('');
        setIsLoading(true);

        const langfuse = getLangfuse();
        const trace = langfuse.trace({ name: 'character-chat-turn', userId: storedCharacter.id });
        const generation = trace.generation({
            name: 'character-response',
            input: newMessages, // Pass full history
            metadata: { system: storedCharacter.system },
        });

        try {
            const response: GenerateContentResponse = await chat.sendMessage({ message: userMessage.content });
            const modelMessage = { role: 'model' as const, content: response.text };
            generation.end({ output: modelMessage.content });
            setMessages(prev => [...prev, modelMessage]);
        } catch (error) {
            console.error('Chat error:', error);
            generation.end({ level: 'ERROR', statusMessage: (error as Error).message });
            const errorMessage = { role: 'model' as const, content: '(I\'m sorry, I seem to be at a loss for words right now. Please try again in a moment.)' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
            langfuse.flush();
        }
    };
    
    return (
        <SheetSection title="Speak with this Character" className="mt-8 no-print">
            <div className="h-96 flex flex-col bg-gray-900 rounded-lg p-2 sm:p-4 border border-gray-700">
                <div className="flex-grow overflow-y-auto pr-2 space-y-4">
                {messages.map((msg, index) => (
                    <ChatMessage key={index} message={msg} />
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-700 rounded-lg px-4 py-2 text-white max-w-xs md:max-w-md">
                            <span className="animate-pulse">...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSendMessage} className="mt-4 flex items-center space-x-2">
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        className="flex-grow bg-gray-800 border-2 border-gray-600 rounded-lg p-2 text-gray-200 focus:ring-amber-400 focus:border-amber-400 transition-colors"
                        placeholder="Ask a question..."
                        disabled={isLoading || isInitializing}
                        aria-label="Your message"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || isInitializing || !userInput.trim()}
                        className="bg-amber-600 text-gray-900 p-2 rounded-lg hover:bg-amber-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex-shrink-0"
                        aria-label="Send message"
                    >
                        <SendIcon />
                    </button>
                </form>
            </div>
        </SheetSection>
    );
};

const generateCharacterSystemPrompt = (character: Character): string => {
    const parts: string[] = [];
    if ('name' in character) {
        parts.push(`You are to roleplay as ${character.name}. You must respond in the first person as this character.`);
    }

    if ('class' in character && 'race' in character) { // D&D
        const dnd = character as DndCharacter;
        parts.push(`You are a ${dnd.race} ${dnd.class}.`);
        if(dnd.alignment) parts.push(`Your alignment is ${dnd.alignment}.`);
        if(dnd.personality) parts.push(`Your core personality traits are: ${dnd.personality.join(', ')}.`);
        if(dnd.backstory) parts.push(`Your backstory includes these key points: ${dnd.backstory.join(' ')}.`);
    } else if ('class' in character && 'ancestry' in character) { // PF2E
        const pf2e = character as Pf2eCharacter;
        parts.push(`You are a ${pf2e.ancestry} ${pf2e.class}.`);
        if(pf2e.alignment) parts.push(`Your alignment is ${pf2e.alignment}.`);
        if(pf2e.personality) parts.push(`Your core personality traits are: ${pf2e.personality.join(', ')}.`);
        if(pf2e.backstory) parts.push(`Your backstory includes these key points: ${pf2e.backstory.join(' ')}.`);
    } else if ('playbook' in character) { // Blades
        const blades = character as BladesCharacter;
        parts.push(`You are a ${blades.playbook} in a grim, industrial city.`);
        if(blades.heritage) parts.push(`Your heritage is ${blades.heritage}.`);
        if(blades.background) parts.push(`Your background is as a ${blades.background}.`);
        if(blades.drives) parts.push(`Your drives and motivations are: ${blades.drives.join(' ')}.`);
        if(blades.vice) parts.push(`You have a vice: ${blades.vice}.`);
    }

    parts.push('Maintain this persona consistently. Do not break character or refer to yourself as an AI. Keep your responses brief, under 50 words, and always end with a question to encourage conversation and help the user flesh out your character details. Answer as if you are speaking directly to someone asking you questions.');
    return parts.join(' ');
};

export default CharacterChat;