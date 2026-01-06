'use client'

import { useFormState } from "react-dom";
import { login } from "@/app/actions";

const initialState = { success: false, error: "" };

export function LoginForm() {
    const [state, formAction] = useFormState(login, initialState);

    return (
        <form action={formAction} className="max-w-md mx-auto bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-zinc-800 transition-colors">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">Admin Login</h2>
            {state?.error && <p className="text-red-500 mb-4 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg text-sm text-center">{state.error}</p>}
            <input
                type="password"
                name="password"
                placeholder="Enter Password"
                className="w-full mb-4 p-3 border border-gray-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-transparent dark:text-white dark:placeholder-gray-400"
                required
            />
            <button type="submit" className="w-full bg-black dark:bg-white text-white dark:text-black p-3 rounded-xl font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
                Unlock Panel
            </button>
        </form>
    );
}
