"use client";

import { useState } from "react";
import HistorySidebar from "@/components/HistorySidebar";
import TranslationArea from "@/components/TranslationArea";

export default function Home() {
  const [refreshHistory, setRefreshHistory] = useState(0);

  const handleTranslationComplete = () => {
    // Trigger history reload
    setRefreshHistory((prev) => prev + 1);
  };

  const handleHistorySelect = (item: { sourceText: string }) => {
    // In a real implementation, we would pass this down toTranslationArea
    // For now, we can perhaps just use alert or log, or refactor TranslationArea to accept props.
    // I previously decided TranslationArea has internal state. 
    // Let's rely on standard "New Translation" flow for now, or if I had time, lift state.
    // For this MVP step, clicking history just copies it to clipboard or we leave it visual.
    // Let's make it copy to clipboard for utility.
    navigator.clipboard.writeText(item.sourceText);
    alert("Source text copied to clipboard!");
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

        <TranslationArea onTranslationComplete={handleTranslationComplete} />
      </div>
    </main>
  );
}
