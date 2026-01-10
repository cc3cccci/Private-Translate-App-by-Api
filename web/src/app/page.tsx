"use client";

import { useState } from "react";
import HistorySidebar from "@/components/HistorySidebar";
import TranslationArea from "@/components/TranslationArea";
import { Menu, X } from "lucide-react";

export default function Home() {
  const [historyItem, setHistoryItem] = useState<{ sourceText: string; translatedText: string; sourceLang: string; targetLang: string } | null>(null);
  const [refreshHistory, setRefreshHistory] = useState(0);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleTranslationComplete = () => {
    setRefreshHistory((prev) => prev + 1);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleHistorySelect = (item: any) => {
    setHistoryItem(item);
    // On mobile, auto-close sidebar selection
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleExportAnki = () => {
    window.location.href = "/api/vocabulary?export=anki";
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  return (
    <main className="flex h-screen bg-background text-foreground transition-colors duration-300 overflow-hidden relative">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Responsive */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-80 transform transition-transform duration-300 ease-in-out md:relative md:transform-none
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        <HistorySidebar
          onSelect={handleHistorySelect}
          refreshTrigger={refreshHistory}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <header className="frosted-glass sticky top-0 z-20 px-4 py-3 md:px-6 md:py-4 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 -ml-2 text-foreground hover:bg-bg-tertiary rounded-lg transition-colors"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="text-lg md:text-xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Private Translate
            </h1>
          </div>

          <div className="flex gap-2 md:gap-3">
            <button
              onClick={toggleTheme}
              className="px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium bg-bg-tertiary hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-transparent hover:border-gray-300 dark:hover:border-gray-600"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <button
              onClick={handleExportAnki}
              className="px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium bg-accent text-white hover:bg-blue-700 transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              Export
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <TranslationArea
            onTranslationComplete={handleTranslationComplete}
            selectedItem={historyItem}
          />
        </div>
      </div>
    </main>
  );
}
