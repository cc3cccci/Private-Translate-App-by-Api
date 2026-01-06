import { prisma } from "@/lib/db";
import { PhotoGrid } from "@/components/PhotoGrid";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const photos = await prisma.photo.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-zinc-950 transition-colors">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <HeroSection />
        <PhotoGrid photos={photos} />
      </div>
    </main>
  );
}
