"use client";

import { useState, useEffect } from "react";
import ModelSelector from "./ModelSelector";
import { Copy, RefreshCw, ArrowRight } from "lucide-react";

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
        <div className="flex-1 p-6 md:p-8 flex flex-col max-w-6xl mx-auto w-full">
            {/* Top Bar: Model Selector & Controls */}
            <div className="flex justify-between items-center mb-6">
                <ModelSelector currentModel={model} onModelChange={setModel} />
                {/* Additional controls like clear or copy could go here */}
            </div>

            {/* Translation Main Area: Grid */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 flex-1 min-h-[400px]">
                {/* Source Input */}
                <div className="flex-1 flex flex-col bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-border transition-all focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500/50">
                    <div className="p-4 border-b border-border bg-bg-secondary/50 rounded-t-2xl flex justify-between items-center">
                        <select
                            value={sourceLang}
                            onChange={(e) => setSourceLang(e.target.value)}
                            className="bg-transparent text-sm font-semibold text-text-secondary focus:outline-none cursor-pointer hover:text-foreground transition-colors"
                        >
                            <option value="auto">Auto Detect</option>
                            <option value="en">English</option>
                            <option value="zh">Chinese</option>
                            <option value="ja">Japanese</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                        </select>
                        {/* Placeholder for toolbar icons (Mic, etc.) */}
                    </div>
                    <textarea
                        value={sourceText}
                        onChange={(e) => setSourceText(e.target.value)}
                        className="flex-1 w-full bg-transparent p-6 text-lg md:text-xl resize-none focus:outline-none placeholder:text-gray-300 dark:placeholder:text-gray-700"
                        placeholder="Enter text to translate..."
                        spellCheck={false}
                    />
                    <div className="p-4 flex justify-end">
                        {/* Character count or limit could go here */}
                    </div>
                </div>

                {/* Translate Action (Vertical Centered on Desktop, Horizontal on Mobile) */}
                <div className="flex items-center justify-center">
                    <button
                        onClick={handleTranslate}
                        disabled={loading}
                        className="p-4 rounded-full bg-accent hover:bg-blue-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                        title="Translate"
                    >
                        {loading ? <RefreshCw className="animate-spin" size={24} /> : <ArrowRight size={24} />}
                    </button>
                </div>

                {/* Target Output */}
                <div className="flex-1 flex flex-col bg-bg-secondary/30 dark:bg-black/40 rounded-2xl border border-border">
                    <div className="p-4 border-b border-border bg-bg-secondary/50 rounded-t-2xl flex justify-between items-center">
                        <select
                            value={targetLang}
                            onChange={(e) => setTargetLang(e.target.value)}
                            className="bg-transparent text-sm font-semibold text-text-secondary focus:outline-none cursor-pointer hover:text-foreground transition-colors"
                        >
                            <option value="en">English</option>
                            <option value="zh">Chinese</option>
                            <option value="ja">Japanese</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                        </select>
                        <div className="flex gap-2">
                            <button className="text-gray-400 hover:text-foreground transition-colors" title="Copy">
                                <Copy size={16} />
                            </button>
                        </div>
                    </div>
                    <textarea
                        value={translatedText}
                        readOnly
                        className="flex-1 w-full bg-transparent p-6 text-lg md:text-xl resize-none focus:outline-none text-foreground"
                        placeholder="Translation..."
                    />
                </div>
            </div>

            {/* Rich Content & Actions */}
            {(synonyms.length > 0 || similar.length > 0 || translatedText) && (
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

                    {/* Rich Data Panel */}
                    {(synonyms.length > 0 || similar.length > 0) ? (
                        <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-border shadow-sm">
                            {synonyms.length > 0 && (
                                <div className="mb-6">
                                    <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">Synonyms & Keywords</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {synonyms.map((s, i) => (
                                            <span key={i} className="px-3 py-1 bg-bg-tertiary text-text-secondary rounded-full text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-default">
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {similar.length > 0 && (
                                <div>
                                    <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">Context & Usage</h4>
                                    <ul className="space-y-2">
                                        {similar.map((s, i) => (
                                            <li key={i} className="text-sm text-foreground pl-3 border-l-2 border-accent/20">
                                                {s}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div /> /* Spacer if no rich data */
                    )}

                    {/* Vocabulary Action Panel */}
                    {translatedText && (
                        <div className="flex flex-col justify-end items-end gap-4">
                            {definition && (
                                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-lg text-sm border border-yellow-100 dark:border-yellow-900/30 max-w-full">
                                    <span className="font-semibold mr-1">Definition:</span> {definition}
                                </div>
                            )}

                            <button
                                onClick={() => saveToVocab(sourceText, definition || translatedText, "")}
                                disabled={vocabSaved}
                                className={`
                                    flex items-center gap-2 px-6 py-3 rounded-full font-bold shadow-md transition-all
                                    ${vocabSaved
                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 cursor-default'
                                        : 'bg-foreground text-background hover:opacity-90 hover:shadow-lg hover:-translate-y-1'
                                    }
                                `}
                            >
                                {vocabSaved ? "Saved to Vocabulary" : "Add to Vocabulary"}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
