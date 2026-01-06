'use client'

import { Download } from "lucide-react";
import type { Photo } from "@prisma/client";

export function PhotoCard({ photo }: { photo: Photo }) {
    return (
        <div className="relative group mb-6 break-inside-avoid rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800">
            <div className="relative w-full">
                <img
                    src={photo.url}
                    alt={photo.title || "Photo"}
                    className="w-full h-auto"
                />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-white font-bold text-lg truncate drop-shadow-md">{photo.title}</h3>
                    <p className="text-white text-sm mb-4 font-medium drop-shadow-md">{photo.category}</p>
                    <a
                        href={photo.url}
                        download
                        target="_blank"
                        className="inline-flex items-center gap-2 bg-white text-gray-900 px-4 py-2 rounded-full font-medium hover:bg-gray-100 transition-colors"
                    >
                        <Download size={16} />
                        Download
                    </a>
                </div>
            </div>
        </div>
    );
}
