"use client";

import Link from "next/link";
import { useMiy, miy } from "@/lib/customize/store";
import type { FlowId } from "@/lib/customize/flows";

/** Shows "Resume" / "View your routine" on a category card when this browser has progress. */
export function FlowStatus({ flow }: { flow: FlowId }) {
  const s = useMiy(() => ({ draft: miy.draft(flow), result: miy.result(flow) }), [flow]);
  if (!s) return null;
  if (s.result)
    return (
      <Link href={`/make-it-yours/${flow}/results`} className="relative z-10 mt-3 inline-flex text-xs underline underline-offset-4">
        View your saved routine →
      </Link>
    );
  if (s.draft && Object.keys(s.draft.answers).length)
    return <span className="mt-3 inline-flex text-xs text-gold-deep">In progress · resume where you left off</span>;
  return null;
}
