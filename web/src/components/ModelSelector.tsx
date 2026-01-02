"use client";



const MODELS = [
    { id: "gpt-3.5-turbo", name: "OpenAI GPT-3.5" },
    { id: "gpt-4-turbo", name: "OpenAI GPT-4" },
    { id: "deepseek-chat", name: "DeepSeek Chat" },
    { id: "grok-beta", name: "Grok Beta" },
    { id: "qwen-turbo", name: "Qwen Turbo" },
];

interface ModelSelectorProps {
    currentModel: string;
    onModelChange: (model: string) => void;
}

export default function ModelSelector({ currentModel, onModelChange }: ModelSelectorProps) {
    return (
        <div style={{ marginBottom: "1rem" }}>
            <label
                htmlFor="model-select"
                style={{ marginRight: "0.5rem", fontWeight: "bold" }}
            >
                Engine:
            </label>
            <select
                id="model-select"
                value={currentModel}
                onChange={(e) => onModelChange(e.target.value)}
                style={{ minWidth: "200px" }}
            >
                {MODELS.map((m) => (
                    <option key={m.id} value={m.id}>
                        {m.name}
                    </option>
                ))}
            </select>
        </div>
    );
}
