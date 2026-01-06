"use client";

import { useState, useEffect } from "react";
import ModelSelector from "./ModelSelector";

interface TranslationAreaProps {
    onTranslationComplete: () => void;
    selectedItem?: { sourceText: string; translatedText: string; sourceLang: string; targetLang: string; } | null;
}

export default function TranslationArea({ onTranslationComplete, selectedItem }: TranslationAreaProps) {
    const [sourceText, setSourceText] = useState("");
    const [translatedText, setTranslatedText] = useState("");
    const [synonyms, setSynonyms] = useState<string[]>([]);
    const [similar, setSimilar] = useState<string[]>([]);
    const [definition, setDefinition] = useState("");
    const [vocabSaved, setVocabSaved] = useState(false);
    const [sourceLang, setSourceLang] = useState("auto");
    const [targetLang, setTargetLang] = useState("en"); // Default to English or keep it logical
    const [model, setModel] = useState("gpt-3.5-turbo"); // Default key from adapter
    const [loading, setLoading] = useState(false);

    // Load history item when selected
    useEffect(() => {
        if (selectedItem) {
            setSourceText(selectedItem.sourceText);
            setTranslatedText(selectedItem.translatedText);
            setSourceLang(selectedItem.sourceLang);
            setTargetLang(selectedItem.targetLang);
            // Reset rich data since we don't store it in history yet (MVP limitation)
            setSynonyms([]);
            setSimilar([]);
            setDefinition("");
        }
    }, [selectedItem]);

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
                // Handle rich data defaults
                setSynonyms(data.synonyms || []);
                setSimilar(data.similar || []);
                setDefinition(data.definition || "");
                setVocabSaved(false); // Reset save state for new translation
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

    const saveToVocab = async (word: string, def: string, context: string) => {
        try {
            const res = await fetch("/api/vocabulary", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    word,
                    definition: def || definition, // Use API definition if available
                    contextSentence: context,
                    sourceLang,
                    targetLang,
                }),
            });
            if (res.ok) {
                setVocabSaved(true);
                setTimeout(() => setVocabSaved(false), 3000); // Reset after 3s
            }
        } catch (e) {
            console.error("Save vocab error", e);
        }
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

            {/* Rich Content Display */}
            {(synonyms.length > 0 || similar.length > 0) && (
                <div style={{
                    marginTop: "1.5rem",
                    padding: "1rem",
                    backgroundColor: "var(--bg-secondary, #f5f5f5)",
                    borderRadius: "8px",
                    border: "1px solid var(--border)"
                }}>
                    {synonyms.length > 0 && (
                        <div style={{ marginBottom: "1rem" }}>
                            <h4 style={{ margin: "0 0 0.5rem 0", opacity: 0.8 }}>Synonyms / Keywords</h4>
                            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                                {synonyms.map((s, i) => (
                                    <span key={i} style={{
                                        padding: "0.2rem 0.6rem",
                                        backgroundColor: "var(--bg-tertiary, #e0e0e0)",
                                        borderRadius: "12px",
                                        fontSize: "0.9rem"
                                    }}>{s}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {similar.length > 0 && (
                        <div>
                            <h4 style={{ margin: "0 0 0.5rem 0", opacity: 0.8 }}>Similar Expressions</h4>
                            <ul style={{ margin: 0, paddingLeft: "1.2rem" }}>
                                {similar.map((s, i) => (
                                    <li key={i} style={{ marginBottom: "0.3rem" }}>{s}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            {/* Vocabulary Action */}
            {translatedText && (
                <div style={{ marginTop: '1rem', textAlign: 'right', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem' }}>
                    {definition && <span style={{ fontSize: '0.9rem', opacity: 0.7, fontStyle: 'italic', maxWidth: '300px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>Def: {definition}</span>}
                    <button
                        onClick={() => saveToVocab(sourceText, definition || translatedText, "")}
                        disabled={vocabSaved}
                        style={{
                            fontSize: '0.9rem',
                            padding: '0.5rem 1rem',
                            backgroundColor: vocabSaved ? '#4CAF50' : '',
                            color: vocabSaved ? 'white' : '',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {vocabSaved ? "✓ Saved" : "Add to Vocab"}
                    </button>
                </div>
            )}
        </div>
    );
}
