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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h3 style={{ margin: 0 }}>History</h3>
                <button onClick={fetchHistory} style={{ fontSize: "0.8rem", padding: "0.2rem 0.5rem" }}>
                    ↻
                </button>
            </div>

            {error && <p style={{ color: "red", fontSize: "0.8rem" }}>{error}</p>}

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
