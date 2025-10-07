import React, { useState, useRef, useEffect } from 'react';
import { SpeakerIcon } from './icons';

interface ChatMessageProps {
  message: { role: 'user' | 'model', content: string };
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
    const isUser = message.role === 'user';
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const objectUrlRef = useRef<string | null>(null);

    const cleanupAudio = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.removeEventListener('ended', cleanupAudio);
            audioRef.current.removeEventListener('error', cleanupAudio);
            audioRef.current.removeAttribute('src'); // Detach source
            audioRef.current = null;
        }
        if (objectUrlRef.current) {
            URL.revokeObjectURL(objectUrlRef.current);
            objectUrlRef.current = null;
        }
        setIsPlaying(false);
    };

    // Cleanup audio on component unmount
    useEffect(() => {
        return cleanupAudio;
    }, []);

    const playAudio = async () => {
        if (isPlaying) {
            cleanupAudio();
            return;
        }

        // Clean up any previous audio state before starting a new one
        cleanupAudio(); 
        setIsPlaying(true);
        
        // The Pollinations API has issues with certain characters in the URL path, like '/'.
        // We replace it to avoid a "Not Found" error from their server.
        const sanitizedContent = message.content.replace(/\//g, ' slash ');
        const url = `https://text.pollinations.ai/${encodeURIComponent(sanitizedContent)}?model=openai-audio&voice=onyx`;

        try {
            const response = await fetch(url);

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Audio API request failed with status ${response.status}:`, errorText.substring(0, 500));
                throw new Error(`API returned status ${response.status}`);
            }

            const contentType = response.headers.get('Content-Type');
            if (!contentType || !contentType.startsWith('audio/')) {
                const responseSample = await response.text();
                console.error('Unexpected content type:', contentType, 'Response body:', responseSample.substring(0, 500));
                throw new Error('Response was not an audio file');
            }

            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);
            objectUrlRef.current = objectUrl;
            
            const audio = new Audio(objectUrl);
            audioRef.current = audio;
            
            audio.play().catch((err) => {
                console.error('Audio play() failed:', err);
                cleanupAudio();
            });
            
            audio.addEventListener('ended', cleanupAudio);
            audio.addEventListener('error', cleanupAudio);

        } catch (error) {
            console.error('Failed to fetch or play audio:', error);
            cleanupAudio();
        }
    };

    return (
        <div className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
             {!isUser && (
                <button 
                    onClick={playAudio} 
                    className={`self-center p-1.5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 ${isPlaying ? 'text-amber-400 bg-gray-600 animate-pulse' : 'text-gray-400 hover:bg-gray-600'}`}
                    aria-label={isPlaying ? 'Stop audio' : 'Play audio response'}
                >
                    <SpeakerIcon />
                </button>
            )}
            <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg text-white ${isUser ? 'bg-amber-800' : 'bg-gray-700'}`}>
                <p className="text-sm break-words">{message.content}</p>
            </div>
        </div>
    );
};

export default ChatMessage;
