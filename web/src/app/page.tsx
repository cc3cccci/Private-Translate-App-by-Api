"use client";

import { useState } from "react";
import HistorySidebar from "@/components/HistorySidebar";
import TranslationArea from "@/components/TranslationArea";

export default function Home() {
  const [historyItem, setHistoryItem] = useState<{ sourceText: string; translatedText: string; sourceLang: string; targetLang: string } | null>(null);
  const [refreshHistory, setRefreshHistory] = useState(0);

  const handleTranslationComplete = () => {
    // Trigger history reload
    setRefreshHistory((prev) => prev + 1);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleHistorySelect = (item: any) => {
    setHistoryItem(item);
  };

  const handleExportAnki = () => {
    window.location.href = "/api/vocabulary?export=anki";
  };

  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.body.setAttribute('data-theme', newTheme);
  }

  return (
    <main style={{ display: "flex", height: "100vh" }}>
      <HistorySidebar
        onSelect={handleHistorySelect}
        refreshTrigger={refreshHistory}
      />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <header style={{
          padding: "1rem",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <h1 style={{ margin: 0, fontSize: "1.5rem" }}>Private Translate</h1>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button onClick={toggleTheme}>
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </button>
            <button onClick={handleExportAnki}>
              Export Anki (TSV)
            </button>
          </div>
        </header>

        <TranslationArea
          onTranslationComplete={handleTranslationComplete}
          selectedItem={historyItem}
        />
      </div>
    </main>
  );
}
