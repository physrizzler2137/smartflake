'use client';

import React, { createContext, useState, useContext, ReactNode, useMemo, useEffect } from 'react';

const FONT_CLASS_TO_FAMILY: Record<string, string> = {
    'font-body': "'Inter', sans-serif",
    'font-headline': "'Space Grotesk', sans-serif",
    'font-merriweather': "'Merriweather', serif",
    'font-lora': "'Lora', serif",
    'font-playfair-display': "'Playfair Display', serif",
    'font-eb-garamond': "'EB Garamond', serif",
    'font-cormorant-garamond': "'Cormorant Garamond', serif",
    'font-libre-baskerville': "'Libre Baskerville', serif",
    'font-arvo': "'Arvo', serif",
    'font-pt-serif': "'PT Serif', serif",
    'font-cardo': "'Cardo', serif",
    'font-old-standard-tt': "'Old Standard TT', serif",
    'font-raleway': "'Raleway', sans-serif",
    'font-lato': "'Lato', sans-serif",
    'font-noto-serif': "'Noto Serif', serif",
    'font-source-serif-pro': "'Source Serif Pro', serif",
    'font-roboto-slab': "'Roboto Slab', serif",
    'font-orbitron': "'Orbitron', sans-serif",
    'font-electrolize': "'Electrolize', sans-serif",
    'font-audiowide': "'Audiowide', sans-serif",
    'font-chakra-petch': "'Chakra Petch', sans-serif",
    'font-share-tech-mono': "'Share Tech Mono', monospace",
    'font-roboto-mono': "'Roboto Mono', monospace",
    'font-nova-square': "'Nova Square', sans-serif",
    'font-bungee': "'Bungee', sans-serif",
    'font-cutive-mono': "'Cutive Mono', monospace",
    'font-fira-mono': "'Fira Mono', monospace",
    'font-gruppo': "'Gruppo', sans-serif",
    'font-syncopate': "'Syncopate', sans-serif",
    'font-vt323': "'VT323', monospace",
    'font-tomorrow': "'Tomorrow', sans-serif",
    'font-russo-one': "'Russo One', sans-serif",
    'font-roboto': "'Roboto', sans-serif",
    'font-roboto-condensed': "'Roboto Condensed', sans-serif",
    'font-roboto-serif': "'Roboto Serif', serif",
    'font-zilla-slab': "'Zilla Slab', serif",
    'font-rokkitt': "'Rokkitt', serif",
    'font-josefin-slab': "'Josefin Slab', serif",
    'font-patua-one': "'Patua One', serif",
    'font-crete-round': "'Crete Round', serif",
};

type FontSize = 'text-size-default' | 'text-size-large' | 'text-size-larger' | 'text-size-huge' | 'text-size-humongous';

type FontContextType = {
    headlineFontClass: string;
    bodyFontClass: string;
    isHighContrast: boolean;
    fontSize: FontSize;
    theme: string;
    setHeadlineFontClass: (fontClass: string) => void;
    setBodyFontClass: (fontClass: string) => void;
    setIsHighContrast: (isHigh: boolean) => void;
    setFontSize: (size: FontSize) => void;
    setTheme: (theme: string) => void;
};

const FontContext = createContext<FontContextType | undefined>(undefined);

export function useFont() {
    const context = useContext(FontContext);
    if (context === undefined) {
        throw new Error('useFont must be used within a FontProvider');
    }
    return context;
}

const ALL_THEMES = ['dark', 'theme-ocean', 'theme-forest', 'theme-sunset', 'high-contrast', 'theme-amber', 'theme-poppy', 'theme-bialowieza', 'theme-warsaw-neon', 'theme-kyoto-garden', 'theme-seoul-night', 'theme-hanok-village', 'theme-tokyo-night', 'theme-osaka-downtown', 'theme-classic-rw', 'theme-cyberpunk-2077', 'theme-cyberpunk-yellow-glitch'];

export function FontProvider({ children }: { children: ReactNode }) {
    const [headlineFontClass, setHeadlineFontClass] = useState('font-headline');
    const [bodyFontClass, setBodyFontClass] = useState('font-body');
    const [isHighContrast, setIsHighContrast] = useState(false);
    const [fontSize, setFontSize] = useState<FontSize>('text-size-default');
    const [theme, setTheme] = useState('dark');
    const [previousBodyFont, setPreviousBodyFont] = useState('font-body');

    useEffect(() => {
        if (previousBodyFont) {
            document.body.classList.remove(previousBodyFont);
        }
        document.body.classList.add(bodyFontClass);
        setPreviousBodyFont(bodyFontClass);
    }, [bodyFontClass, previousBodyFont]);

    useEffect(() => {
        const headlineFontFamily = FONT_CLASS_TO_FAMILY[headlineFontClass] ?? FONT_CLASS_TO_FAMILY['font-headline'];
        let styleTag = document.getElementById('headline-font-override');
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'headline-font-override';
            document.head.appendChild(styleTag);
        }
        styleTag.innerHTML = `.font-headline { font-family: ${headlineFontFamily}; }`;
    }, [headlineFontClass]);

    useEffect(() => {
        ALL_THEMES.forEach(t => document.documentElement.classList.remove(t));
        
        if (isHighContrast) {
            document.documentElement.classList.add('dark', 'high-contrast');
        } else {
            document.documentElement.classList.add(theme);
        }
    }, [isHighContrast, theme]);

    useEffect(() => {
        const sizes: FontSize[] = ['text-size-default', 'text-size-large', 'text-size-larger', 'text-size-huge', 'text-size-humongous'];
        sizes.forEach(size => {
            document.documentElement.classList.remove(size);
        });
        document.documentElement.classList.add(fontSize);
    }, [fontSize]);

    const value = useMemo(() => ({
        headlineFontClass,
        bodyFontClass,
        isHighContrast,
        fontSize,
        theme,
        setHeadlineFontClass,
        setBodyFontClass,
        setIsHighContrast,
        setFontSize,
        setTheme,
    }), [headlineFontClass, bodyFontClass, isHighContrast, fontSize, theme]);

    return (
        <FontContext.Provider value={value}>
            {children}
        </FontContext.Provider>
    );
}
