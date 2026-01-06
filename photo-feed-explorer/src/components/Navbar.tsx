'use client';

import Link from "next/link";

import { useTheme } from "next-themes";
import { useLanguage } from "./Providers";
import { Sun, Moon, Languages } from "lucide-react";
import { useEffect, useState } from "react";

export function Navbar() {
    const { theme, setTheme } = useTheme();
    const { language, setLanguage, t } = useLanguage();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <nav className="bg-white dark:bg-zinc-950 shadow-sm border-b dark:border-zinc-800 transition-colors">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Photo Feed Explorer
                </Link>
                <div className="flex items-center gap-6">
                    <div className="flex gap-4">
                        <Link href="/" className="text-gray-900 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
                            {t('gallery')}
                        </Link>
                        <Link href="/admin" className="text-gray-900 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
                            {t('admin')}
                        </Link>
                    </div>

                    <div className="flex items-center gap-2 border-l pl-6 border-gray-200 dark:border-gray-800">
                        <button
                            onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors text-gray-600 dark:text-gray-300 flex items-center gap-1 text-sm font-medium"
                            aria-label="Toggle Language"
                        >
                            <Languages size={20} />
                            <span>{language === 'en' ? 'CN' : 'EN'}</span>
                        </button>

                        <button
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors text-gray-600 dark:text-gray-300"
                            aria-label="Toggle Theme"
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
