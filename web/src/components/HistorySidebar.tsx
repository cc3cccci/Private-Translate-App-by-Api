"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

interface HistoryItem {
    id: string;
    sourceText: string;
    translatedText: string;
    sourceLang: string;
    targetLang: string;
    createdAt: string;
}

interface HistorySidebarProps {
    onSelect: (item: HistoryItem) => void;
    refreshTrigger: number; // Increment to reload
}

export default function HistorySidebar({ onSelect, refreshTrigger }: HistorySidebarProps) {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchHistory();
    }, [refreshTrigger]);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/history?t=${Date.now()}`); // Cache busting
            if (res.ok) {
                const data = await res.json();
                setHistory(data);
            }
        } catch (e) {
            console.error(e);
            setError("Failed to load");
        } finally {
            setLoading(false);
        }
    };

    const clearHistory = async () => {
        if (!confirm("Are you sure you want to clear all history?")) return;
        setLoading(true);
        try {
            const res = await fetch("/api/history", { method: "DELETE" });
            if (res.ok) {
                setHistory([]);
            }
        } catch (e) {
            console.error(e);
            setError("Failed to delete");
        } finally {
            setLoading(false);
        }
    };

    return (
        <aside className="w-80 h-full border-r border-border bg-bg-secondary/50 dark:bg-black/20 flex flex-col border-r shadow-sm backdrop-blur-sm z-10 transition-transform duration-300">
            <div className="p-4 border-b border-border flex justify-between items-center bg-transparent">
                <h3 className="font-semibold text-text-secondary uppercase text-xs tracking-wider">History</h3>
                <div className="flex gap-1">
                    <button
                        onClick={clearHistory}
                        className="p-1 hover:bg-red-100 hover:text-red-500 rounded-md transition-colors"
                        title="Clear All"
                    >
                        <Trash2 size={16} />
                    </button>
                    <button
                        onClick={fetchHistory}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-md transition-colors"
                        title="Refresh"
                    >
                        ↻
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                {error && <p className="text-red-500 text-sm px-2">{error}</p>}
                {loading && <p className="text-text-secondary text-sm px-2 animate-pulse">Loading...</p>}
                {!loading && history.length === 0 && (
                    <div className="text-center py-10 opacity-50">
                        <p className="text-sm">No history yet</p>
                    </div>
                )}

                {history.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => onSelect(item)}
                        className="group p-3 rounded-lg border border-transparent hover:border-border hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm cursor-pointer transition-all duration-200"
                    >
                        <div className="font-medium text-sm text-foreground mb-1 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            {item.sourceText}
                        </div>
                        <div className="text-xs text-text-secondary line-clamp-1">
                            {item.translatedText}
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
}
