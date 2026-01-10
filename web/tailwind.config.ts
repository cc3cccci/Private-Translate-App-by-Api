import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                accent: "var(--accent)",
                "bg-secondary": "var(--bg-secondary)",
                "bg-tertiary": "var(--bg-tertiary)",
                "text-secondary": "var(--text-secondary)",
                border: "var(--border)",
            },
        },
    },
    plugins: [],
};
export default config;
