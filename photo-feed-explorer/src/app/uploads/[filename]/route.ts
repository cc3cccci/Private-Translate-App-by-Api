import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { existsSync } from "fs";

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ filename: string }> }
) {
    const { filename } = await context.params;

    // Sanitize filename to prevent directory traversal
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.\-_]/g, "");

    // Path to the file in public/uploads
    // In standalone mode, process.cwd() is the root of the standalone app
    const filePath = path.join(process.cwd(), "public", "uploads", sanitizedFilename);

    if (!existsSync(filePath)) {
        return new NextResponse(null, { status: 404 });
    }

    try {
        const fileBuffer = await fs.readFile(filePath);

        // Determine content type based on extension
        const ext = path.extname(sanitizedFilename).toLowerCase();
        let contentType = "application/octet-stream";
        if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
        else if (ext === ".png") contentType = "image/png";
        else if (ext === ".gif") contentType = "image/gif";
        else if (ext === ".webp") contentType = "image/webp";

        return new NextResponse(fileBuffer, {
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=0, must-revalidate", // Ensure freshness
            },
        });
    } catch (error) {
        console.error("Error serving file:", error);
        return new NextResponse(null, { status: 500 });
    }
}
