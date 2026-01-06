'use client';

import { useLanguage } from "./Providers";

export function HeroSection() {
    const { t } = useLanguage();

    return (
        <div className="max-w-2xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
                {t('title_start')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">{t('title_end')}</span>
            </h1>
            <p className="text-xl text-gray-800 dark:text-gray-300 font-medium">
                {t('subtitle')}
            </p>
        </div>
    );
}
