"use client";

import { useEffect, useState } from "react";

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
        } finally {
            setLoading(false);
        }
    };

    return (
        <aside
            style={{
                width: "25%",
                borderRight: "1px solid var(--border)",
                height: "100%",
                overflowY: "auto",
                padding: "1rem",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <h3 style={{ marginBottom: "1rem" }}>History</h3>

            {loading && <p>Loading...</p>}

            {!loading && history.length === 0 && (
                <p style={{ opacity: 0.5 }}>No history yet.</p>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {history.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => onSelect(item)}
                        style={{
                            padding: "0.5rem",
                            border: "1px solid var(--border)",
                            cursor: "pointer",
                            fontSize: "0.9rem",
                        }}
                    >
                        <div style={{ fontWeight: "bold", marginBottom: "0.2rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {item.sourceText}
                        </div>
                        <div style={{ opacity: 0.8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {item.translatedText}
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
}
