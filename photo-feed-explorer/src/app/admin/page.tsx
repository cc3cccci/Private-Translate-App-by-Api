import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { AdminPanel } from "@/components/AdminPanel";
import { LoginForm } from "@/components/LoginForm";
import { Navbar } from "@/components/Navbar";

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
    const cookieStore = await cookies();
    const auth = cookieStore.get("auth");

    // If not authenticated, show login form
    if (!auth) {
        return (
            <main className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="container mx-auto px-4 py-20">
                    <LoginForm />
                </div>
            </main>
        );
    }

    // Authenticated: Fetch photos and show dashboard
    const photos = await prisma.photo.findMany({ orderBy: { createdAt: 'desc' } });

    return (
        <main className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-4 py-12">
                <AdminPanel photos={photos} />
            </div>
        </main>
    );
}
