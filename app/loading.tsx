import { Molecule } from "@/components/ui/Logo";

export default function Loading() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center text-gold" aria-label="Loading">
      <Molecule animate className="h-3" />
    </div>
  );
}
