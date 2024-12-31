'use client'

import React, {useContext, useEffect, useRef, useState} from 'react';
import {AgentContext} from "@/contexts/AgentProvider";
import {fetchToken} from "@/api/fetchToken";
import {FaSpinner} from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import {FeaturedToken} from "@/types";
import {getTokenName} from "@/api/tokenName";
import {getBase64Audio} from "@/utils";

const HomePage: React.FC = () => {
    const {featuredTokens} = useContext(AgentContext);
    const responseRef = useRef<HTMLDivElement | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const [audioPlayed, setAudioPlayed] = useState(false);
    const [userMessage, setUserMessage] = useState('');
    const [tokenName, setTokenName] = useState("Palms");
    const [tokenImage, setTokenImage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [responseMessage, setResponseMessage] = useState<string | null>(null);
    const [displayedMessage, setDisplayedMessage] = useState('');
    const [loadingText, setLoadingText] = useState('fetching LLM data & processing model...');

    useEffect(() => {
        if (responseMessage && responseRef.current) {
            responseRef.current.scrollIntoView({behavior: 'smooth'});
        }
    }, [responseMessage]);

    const _stopAudio = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    }

    const _playAudio = (audioName: string, b64?: string) => {
        // stop audio
        _stopAudio()
        // build audio
        const audio = b64 ? getBase64Audio(b64) : new Audio(`./${audioName}.mp3`)

        // play audio
        audioRef.current = audio
        audio?.play()
            .then(() => setAudioPlayed(true))
            .catch((error) => {
                console.error(`Error playing audio ${audioName}:`, error);
            });
    }

    useEffect(() => {
        if (!audioPlayed) {
            const handleInteraction = () => {
                _playAudio('welcome')
                document.removeEventListener('click', handleInteraction);
                document.removeEventListener('keydown', handleInteraction);
            };

            document.addEventListener('click', handleInteraction);
            document.addEventListener('keydown', handleInteraction);

            return () => {
                document.removeEventListener('click', handleInteraction);
                document.removeEventListener('keydown', handleInteraction);
            };
        }
    }, [audioPlayed]);

    // simulates like the chat is writting itself
    useEffect(() => {
        if (!responseMessage) return;

        let currentIndex = 0;
        const interval = setInterval(() => {
            setDisplayedMessage(responseMessage.slice(0, currentIndex + 1));
            currentIndex++;

            if (currentIndex === responseMessage.length) {
                clearInterval(interval);
            }
        }, 10); // Adjust typing speed here

        return () => clearInterval(interval);
    }, [responseMessage]);

    useEffect(() => {
        let timeoutId: ReturnType<typeof setTimeout>; // Correctly type the timeout ID

        if (isLoading) {
            const texts = [
                'fetching LLM data & processing model...',
                'connecting to the blockchain...',
                'analyzing token trends...',
                'optimizing trade strategies...',
                'parsing data into human readable string...',
                'making sure we have a safe connection...',
                'did I told you I love cats?',
                'what come first, the chicken or the egg?',
                'do you like pina coladas?',
                'and get caught in the rain?',
                'careless whisper¡?'
            ];

            let currentIndex = 0;

            const updateText = () => {
                currentIndex = (currentIndex + 1) % texts.length; // Cycle through texts
                setLoadingText(texts[currentIndex]);

                // Calculate a random delay between 3 and 5 seconds
                const randomDelay = Math.floor(Math.random() * (5000 - 3000 + 1)) + 3000;

                // Set the next timeout
                timeoutId = setTimeout(updateText, randomDelay);
            };

            // Start the first update
            updateText();

            return () => clearTimeout(timeoutId); // Cleanup on unmount or when loading stops
        }
    }, [isLoading]);

    const handleSubmit = async (token?: FeaturedToken | undefined) => {
        try {
            if (isLoading) return;
            setIsLoading(true)
            const {
                image, name, symbol
            } = token ? {image: token.image, name: token.name, symbol: token.symbol}
                : await getTokenName(userMessage)

            const tokenmsg = token ? `Featured Token ${token.symbol}` : userMessage;
            const resp = await fetchToken({
                message: tokenmsg,
            });

            setTokenName(`${name} - ${symbol}`)
            setTokenImage(image || "")

            _stopAudio()
            if (resp.ok) {
                _playAudio('base64', resp.audioB64)
            } else {
                _playAudio("error")
            }
            setResponseMessage(resp?.text)
        } catch (error) {
            console.error('Error submitting message:', error);
            setResponseMessage("request failed - please provide a valid contract address")
        } finally {
            setIsLoading(false);
        }
    };

    const handleCardClick = async (token: FeaturedToken) => {
        await handleSubmit(token)
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Top Navigation Bar */}
            <nav className="flex justify-between items-center px-8 py-4 bg-gray-800">
                <div className="flex items-center">
                    <img src="/images/PalmsLogoWhite.png" alt="Logo" className="h-10 object-contain"/>
                </div>
                <div className="flex space-x-6">
                    <a href="https://aipalms.com" className="hover:text-purple-400">Home</a>
                    <a href="https://aipalms.com/#roadmap" className="hover:text-purple-400">Roadmap</a>
                    <a href="https://github.com/gableon/palms-open-api" className="hover:text-purple-400">Github</a>
                    <div className="relative group">
                        <a
                            href="#"
                            className="text-gray-500 cursor-not-allowed"
                            aria-disabled="true"
                        >
                            DeFi
                        </a>
                        <span
                            className="absolute top-full mt-2 hidden text-xs text-white bg-gray-800 px-2 py-1 rounded group-hover:block">
            Coming soon
        </span>
                    </div>
                </div>
                <div className="w-8 h-8 bg-purple-600 rounded-full"></div>
            </nav>

            {/* Main Hero Section */}
            <main>
                <div className="relative flex flex-col items-center justify-center px-4 py-16">
                    {/* Vibrant Soundwave Animation */}
                    <div className="absolute inset-0 flex items-center justify-center z-0">
                        <div
                            className="w-full h-64 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-xl blur-lg opacity-30"></div>
                        {/*<div className="absolute inset-0 flex items-center justify-center bg-no-repeat bg-cover bg-center bg-[url(/images/vibrant-sound-wave.jpeg)]"/>*/}
                    </div>
                    <div className="relative z-10 text-center">
                        <div className="w-full h-40 flex justify-center items-center mt-10">
                            <div className="relative z-10 text-center">
                                {/* Placeholder for Animation */}
                                <div className="w-80 h-80 flex justify-center items-center">
                                    <div
                                        className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full animate-pulse blur-lg w-full h-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Dynamic Carousel for Featured Tokens */}
                    {/*<div className="mt-0 max-w-full overflow-x-auto whitespace-nowrap">*/}
                    <div
                        className="relative mt-0 max-w-full overflow-x-auto whitespace-nowrap overscroll-contain scroll-touch">
                        <div className="flex space-x-6">
                            {featuredTokens.map((token, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleCardClick(token)}
                                    className="flex-shrink-0 p-4 bg-gradient-to-b from-purple-700 via-transparent to-transparent rounded-lg border border-purple-500 shadow-lg w-60 backdrop-blur-sm text-left"
                                >
                                    <div className="flex justify-center mb-2">
                                        <img
                                            src={token.image || '/placeholder.png'}
                                            alt={token.name}
                                            className="w-12 h-12 rounded-full"
                                        />
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-1">{token.name} <span
                                        className="text-purple-300">({token.symbol})</span></h3>
                                    <p className="text-sm text-purple-300 mb-1">💰
                                        Price: {token.price ? `$${token.price.toFixed(2)}` : 'N/A'}</p>
                                    <p className="text-sm text-purple-300 mb-1">📊
                                        Volume: {token.volume ? `$${token.volume.toLocaleString()}` : 'N/A'}</p>
                                    {/*<p className="text-sm text-purple-300 mb-1">🪙*/}
                                    {/*    Contract: {token.contractAddress || 'N/A'}</p>*/}
                                    <p className="text-sm text-purple-300 mb-1">
                                        📈 24h % Change: {token.change24h ? `${token.change24h.toFixed(2)}%` : 'N/A'}</p>
                                    <p className="text-sm text-purple-300 mb-1">
                                        🏔️ ATH %
                                        Change: {token.athChange ? `${token.athChange.toFixed(2)}%` : 'N/A'}</p>
                                    <p className="text-sm text-purple-300">💼 Market
                                        Cap: {token.marketCap ? `$${token.marketCap.toLocaleString()}` : 'N/A'}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* User Question Input Section */}
                    <div className="mt-16 w-full flex flex-col items-center z-10">
                        <h2 className="text-2xl font-bold text-purple-300 mb-4">Ask Palm</h2>
                        <div className="w-full max-w-2xl">
                            <input
                                type="text"
                                value={userMessage}
                                onChange={(e) => setUserMessage(e.target.value)}
                                placeholder="Contract Address..."
                                className="w-full p-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                disabled={isLoading}
                            />
                            <button
                                onClick={() => handleSubmit()}
                                className="mt-4 w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg shadow-lg transition duration-300"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="ml-4 flex items-center space-x-2">
                                        <FaSpinner className="animate-spin"/>
                                        {/*<b><i>fetching LLM data & processing model...</i></b>*/}
                                        <b><i>{loadingText}</i></b>
                                    </div>
                                ) : (
                                    'Send'
                                )}
                            </button>
                        </div>

                        {/*/!* AI Assistant Response Section *!/*/}
                        {responseMessage && (
                            <div ref={responseRef}
                                 className="mt-8 p-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-lg shadow-lg max-w-2xl overflow-auto break-words">
                                {tokenImage && (
                                    <img
                                        src={tokenImage}
                                        alt={`${tokenName} logo`}
                                        className="w-10 h-10 rounded-full border-2 border-purple-300"
                                    />
                                )}
                                <h3 className="text-lg font-bold text-purple-300">{tokenName}</h3>
                                <ReactMarkdown
                                    className="mt-2 whitespace-pre-wrap break-words">{displayedMessage}</ReactMarkdown>
                            </div>
                        )}

                    </div>

                </div>
            </main>

            {/* Footer Section */}
            <footer className="mt-16 py-6 bg-gray-800 text-center">
                <p className="text-gray-400">&copy; 2024 Palms AI. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default HomePage;
