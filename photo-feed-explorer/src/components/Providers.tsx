'use client';

import { ThemeProvider } from "next-themes";
import { createContext, useContext, useState } from "react";

import { content, ContentKey } from "@/config/content";

type Language = 'en' | 'zh';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function Providers({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>('en');

    const t = (key: string) => {
        // @ts-ignore
        return content[language][key] || key;
    };

    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <LanguageContext.Provider value={{ language, setLanguage, t }}>
                {children}
            </LanguageContext.Provider>
        </ThemeProvider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a Providers');
    }
    return context;
}
