import React from 'react';

import './globals.css';

import ThemeProvider from '@/contexts/ThemeProvider';
import AgentProvider from "@/contexts/AgentProvider";
import WalletProvider from '@/contexts/WalletProvider';

// Providers

/**
 *
 * @param Children --> This will be the rendered component in the current page
 * @returns --> A wrapper of providers such as Session, WalletContext around the Children param
 */
type LayoutWrapperProps = {
    children: React.ReactNode;
};

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children }) => {
    return (
        <WalletProvider>
            <ThemeProvider >
                <AgentProvider>
                    {children}
                </AgentProvider>
            </ThemeProvider>
        </WalletProvider>

    );
};

export default LayoutWrapper;
