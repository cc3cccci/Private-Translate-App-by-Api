"use client";

import { useState } from "react";
import ModelSelector from "./ModelSelector";

interface TranslationAreaProps {
    onTranslationComplete: () => void;
    initialSource?: string;
    initialTarget?: string;
}

export default function TranslationArea({ onTranslationComplete }: TranslationAreaProps) {
    const [sourceText, setSourceText] = useState("");
    const [translatedText, setTranslatedText] = useState("");
    const [sourceLang, setSourceLang] = useState("auto");
    const [targetLang, setTargetLang] = useState("en"); // Default to English or keep it logical
    const [model, setModel] = useState("gpt-3.5-turbo"); // Default key from adapter
    const [loading, setLoading] = useState(false);

    // Expose a way to set text externally if needed (via ref or just prop updates, but strict react flow is better)
    // For now, if we want history selection to update this, we might need to lift state up to Page.
    // I will assume the parent passes props, but for now I'll implement local state handling.
    // Actually, to make "onSelect" from HistorySidebar work, Page needs to hold the state.
    // I will refactor Page to hold state and pass it down.
    // So this component should largely be controlled or have a `forceUpdate` mechanism.
    // I'll stick to props for values.

    const handleTranslate = async () => {
        if (!sourceText.trim()) return;
        setLoading(true);
        try {
            const res = await fetch("/api/translate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    text: sourceText,
                    sourceLang,
                    targetLang,
                    model,
                }),
            });
            const data = await res.json();
            if (data.result) {
                setTranslatedText(data.result);
                onTranslationComplete();
            } else if (data.error) {
                alert("Error: " + data.error);
            }
        } catch {

            alert("Translation failed");
        } finally {
            setLoading(false);
        }
    };

    const saveToVocab = async (word: string, definition: string, context: string) => {
        await fetch("/api/vocabulary", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                word,
                definition,
                contextSentence: context,
                sourceLang,
                targetLang,
            }),
        });
        alert("Saved to vocabulary");
    };

    return (
        <div style={{ flex: 1, padding: "2rem", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <ModelSelector currentModel={model} onModelChange={setModel} />
                <div>
                    {/* Theme Toggle could go here but it is app-wide. */}
                </div>
            </div>

            <div style={{ display: "flex", gap: "1rem", flex: 1 }}>
                {/* Source */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <select
                        value={sourceLang}
                        onChange={(e) => setSourceLang(e.target.value)}
                        style={{ marginBottom: "0.5rem" }}
                    >
                        <option value="auto">Auto Detect</option>
                        <option value="en">English</option>
                        <option value="zh">Chinese</option>
                        <option value="ja">Japanese</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                    </select>
                    <textarea
                        value={sourceText}
                        onChange={(e) => setSourceText(e.target.value)}
                        style={{ flex: 1, resize: "none", padding: "1rem", fontSize: "1.2rem" }}
                        placeholder="Enter text..."
                    />
                </div>

                {/* Target */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <select
                        value={targetLang}
                        onChange={(e) => setTargetLang(e.target.value)}
                        style={{ marginBottom: "0.5rem" }}
                    >
                        <option value="en">English</option>
                        <option value="zh">Chinese</option>
                        <option value="ja">Japanese</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                    </select>
                    <textarea
                        value={translatedText}
                        readOnly
                        style={{ flex: 1, resize: "none", padding: "1rem", fontSize: "1.2rem" }}
                        placeholder="Translation..."
                    />
                </div>
            </div>

            <div style={{ marginTop: "1rem", textAlign: "center" }}>
                <button
                    onClick={handleTranslate}
                    disabled={loading}
                    style={{ padding: "0.8rem 2rem", fontSize: "1.2rem", fontWeight: "bold" }}
                >
                    {loading ? "Translating..." : "Translate"}
                </button>
            </div>

            {/* Vocabulary Action (Mockup) */}
            {translatedText && (
                <div style={{ marginTop: '1rem', textAlign: 'right' }}>
                    <button onClick={() => saveToVocab(sourceText, translatedText, "")} style={{ fontSize: '0.8rem' }}>
                        Add to Vocab (Whole Sentence)
                    </button>
                </div>
            )}
        </div>
    );
}
