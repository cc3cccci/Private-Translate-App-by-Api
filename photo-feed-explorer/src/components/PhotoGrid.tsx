'use client'

import type { Photo } from "@prisma/client";
import { PhotoCard } from "./PhotoCard";

export function PhotoGrid({ photos }: { photos: Photo[] }) {
    if (photos.length === 0) {
        return (
            <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-3xl border-2 border-dashed border-gray-200 dark:border-zinc-800 transition-colors">
                <p className="text-gray-800 dark:text-gray-200 text-lg font-medium">No photos yet. Visit admin panel to upload.</p>
            </div>
        );
    }

    return (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
            {photos.map((photo) => (
                <PhotoCard key={photo.id} photo={photo} />
            ))}
        </div>
    );
}
