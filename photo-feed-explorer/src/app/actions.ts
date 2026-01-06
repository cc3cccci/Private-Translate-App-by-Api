'use server'

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { writeFile, unlink } from "fs/promises";
import path from "path";
import { redirect } from "next/navigation";

const UPLOAD_DIR = path.join(process.cwd(), "public/uploads");

export async function login(prevState: any, formData: FormData) {
    const password = formData.get("password") as string;
    // Simple check against env var
    if (password === process.env.ADMIN_PASSWORD) {
        const cookieStore = await cookies();
        cookieStore.set("auth", "true", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24
        });
        return { success: true };
    }
    return { success: false, error: "Invalid password" };
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete("auth");
    redirect("/");
}

export async function uploadPhoto(prevState: any, formData: FormData) {
    const cookieStore = await cookies();
    const auth = cookieStore.get("auth");
    if (!auth) return { success: false, error: "Unauthorized" };

    const file = formData.get("file") as File;
    const title = formData.get("title") as string || "";
    const category = formData.get("category") as string || "General";

    if (!file || file.size === 0) return { success: false, error: "No file uploaded" };

    try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Simple unique filename
        const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
        const filepath = path.join(UPLOAD_DIR, filename);

        await writeFile(filepath, buffer);

        await prisma.photo.create({
            data: {
                url: `/uploads/${filename}`,
                title,
                category,
            },
        });

        revalidatePath("/");
        revalidatePath("/admin");
        return { success: true };
    } catch (error) {
        console.error("Upload error:", error);
        return { success: false, error: "Failed to upload photo" };
    }
}

export async function deletePhoto(id: number, url: string) {
    const cookieStore = await cookies();
    const auth = cookieStore.get("auth");
    if (!auth) throw new Error("Unauthorized");

    try {
        await prisma.photo.delete({ where: { id } });

        // Try to delete file
        const filepath = path.join(process.cwd(), "public", url);
        await unlink(filepath).catch(() => null); // Ignore file not found
    } catch (error) {
        console.error("Delete error:", error);
        throw error;
    }

    revalidatePath("/");
    revalidatePath("/admin");
}
