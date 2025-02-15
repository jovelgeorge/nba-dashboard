import { MinutesAdjuster } from "@/components/features/minutes-adjuster/minutes-adjuster";

export default function Home() {
  return (
    <main className="min-h-screen bg-background py-8">
      <div className="container mx-auto space-y-6">
        <MinutesAdjuster />
      </div>
    </main>
  );
}
