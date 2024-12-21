import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useBackgroundLines } from '~/hooks/useBackgroundLines';

interface LinesContextType {
    cyanLines: Line[];
    fuchsiaLines: Line[];
}

const LinesContext = createContext<LinesContextType | undefined>(undefined);

export function LinesProvider({ children }: { children: ReactNode }) {
    const cyanLines = useBackgroundLines('cyan');
    const fuchsiaLines = useBackgroundLines('fuchsia');

    return (
        <LinesContext.Provider value={{ cyanLines, fuchsiaLines }}>
            {children}
        </LinesContext.Provider>
    );
}

export function useLines(color: 'cyan' | 'fuchsia') {
    const context = useContext(LinesContext);
    if (!context) {
        throw new Error('useLines must be used within a LinesProvider');
    }
    return color === 'cyan' ? context.cyanLines : context.fuchsiaLines;
} 