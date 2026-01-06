'use client'

import { useFormState } from "react-dom";
import { useTransition, useState, useEffect, useRef } from "react";
import { uploadPhoto, deletePhoto, logout } from "@/app/actions";
import type { Photo } from "@prisma/client";
import { Trash2, LogOut, Upload, Image as ImageIcon } from "lucide-react";
import { useLanguage } from "./Providers";

export function AdminPanel({ photos }: { photos: Photo[] }) {
    const [uploadState, uploadAction] = useFormState(uploadPhoto, { success: false });
    const [isPending, startTransition] = useTransition();
    const [preview, setPreview] = useState<string | null>(null);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (uploadState.success) {
            formRef.current?.reset();
            setPreview(null);
        }
    }, [uploadState.success]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreview(url);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
                <form action={logout}>
                    <button className="flex items-center gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-lg transition-colors font-medium">
                        <LogOut size={18} /> Logout
                    </button>
                </form>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 mb-10 transition-colors">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
                    <Upload className="text-blue-600" size={24} /> Upload New Photo
                </h3>
                {uploadState?.error && <p className="text-red-500 mb-4 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">{uploadState.error}</p>}

                <form ref={formRef} action={uploadAction} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input name="title" placeholder="Photo Title" className="w-full p-3 border dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent dark:text-white dark:placeholder-gray-400" required />
                        <input name="category" placeholder="Category (e.g. Matte, Gloss)" className="w-full p-3 border dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent dark:text-white dark:placeholder-gray-400" required />
                    </div>
                    <div className="border-2 border-dashed border-gray-200 dark:border-zinc-700 rounded-xl p-8 text-center hover:border-blue-400 dark:hover:border-blue-400 transition-colors cursor-pointer relative bg-gray-50/50 dark:bg-zinc-800/50 overflow-hidden group">
                        <input
                            type="file"
                            name="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full h-full"
                            required
                        />
                        {preview ? (
                            <div className="relative h-64 w-full flex items-center justify-center">
                                <img src={preview} alt="Preview" className="max-h-full max-w-full object-contain rounded-lg shadow-sm" />
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    <p className="text-white font-medium">Click to change</p>
                                </div>
                            </div>
                        ) : (
                            <div className="pointer-events-none py-8">
                                <ImageIcon className="mx-auto text-gray-600 dark:text-gray-400 mb-2" size={32} />
                                <p className="text-gray-700 dark:text-gray-300 font-medium">Drag & drop or click to select image</p>
                            </div>
                        )}
                    </div>
                    <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors w-full md:w-auto shadow-lg shadow-blue-600/20">
                        Upload to Feed
                    </button>
                </form>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors">
                <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Manage Photos ({photos.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {photos.map(p => (
                        <div key={p.id} className="flex items-center gap-4 p-4 border dark:border-zinc-700 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                            <img src={p.url} className="w-16 h-16 object-cover rounded-lg bg-gray-100 dark:bg-zinc-800" alt={p.title || "thumbnail"} />
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-gray-900 dark:text-white truncate">{p.title}</h4>
                                <p className="text-xs text-gray-700 dark:text-gray-400 font-medium truncate">{p.category}</p>
                            </div>
                            <button
                                onClick={() => startTransition(() => deletePhoto(p.id, p.url))}
                                disabled={isPending}
                                className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 p-2 rounded-lg transition-colors disabled:opacity-50"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
