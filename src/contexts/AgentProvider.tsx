'use client'

import React, {createContext, useState, ReactNode, Dispatch, SetStateAction, useEffect} from 'react';
import { Message, FeaturedToken } from "@/types";
import {fetchTopSolanaTokens} from "@/api/trendingTokens";

//*
// Defines Agent global states and actions
//*
interface AgentContextProps {
    messages: Message[];
    setMessages: Dispatch<SetStateAction<Message[]>>;
    featuredTokens: FeaturedToken[];
    setFeaturedTokens: Dispatch<SetStateAction<FeaturedToken[]>>;
}

export const AgentContext = createContext<AgentContextProps>({
    messages: [],
    setMessages: () => { },
    featuredTokens: [],
    setFeaturedTokens: () => { },
});

interface AgentProviderProps {
    children: ReactNode;
}

const AgentProvider: React.FC<AgentProviderProps> = ({ children }) => {
    const [messages, setMessages] = useState<Message[]>([])
    const [featuredTokens, setFeaturedTokens] = useState<FeaturedToken[]>([])


    useEffect(() => {
        console.log("reload!")
        // todo: load featured tokens properly!
        fetchTopSolanaTokens().then(tokens => {
            setFeaturedTokens(tokens)
        }).catch(err => console.error("Error getting trending tokens", err))
    }, [])

    return (
        <AgentContext.Provider value={{
            messages,
            setMessages,
            featuredTokens,
            setFeaturedTokens
        }}>
            {children}
        </AgentContext.Provider>
    );
};

export default AgentProvider;
