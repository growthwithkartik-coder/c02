"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Order } from "@/types";
import { useStore } from "@/components/providers/StoreProvider";
import { readJSON, writeJSON, STORAGE_KEYS } from "@/lib/storage";
import { indianStates } from "@/data/india";
import { money } from "@/lib/utils";
import { MiyAccount } from "@/components/account/MiyAccount";
import { useSearchParams } from "next/navigation";

type Profile = { name: string; email: string; phone: string; line1: string; line2: string; city: string; state: string; pincode: string };

/* Account — details, order history and wishlist kept on this device.
   Hook up real sign-in (e.g. NextAuth/Clerk/Supabase Auth) when ready;
   the order history then comes from /api/orders. */
export function AccountView() {
  const { wishlist } = useStore();
  const sp = useSearchParams();
  const [tab, setTab] = useState<"orders" | "routines" | "details" | "lookup">(sp.get("tab") === "routines" ? "routines" : "orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [profile, setProfile] = useState<Profile>({ name: "", email: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "" });
  const [saved, setSaved] = useState(false);
  const [lookup, setLookup] = useState({ id: "", email: "" });
  const [found, setFound] = useState<Order | null | "none">(null);

  useEffect(() => {
    setOrders(readJSON<Order[]>(STORAGE_KEYS.orders, []));
    setProfile((p) => ({ ...p, ...readJSON<Partial<Profile>>(STORAGE_KEYS.profile, {}) }));
  }, []);

  const first = profile.name.split(" ")[0];

  return (
    <div className="container-site pb-section pt-[calc(var(--nav-h)+3rem)]">
      <p className="eyebrow text-taupe">Your account</p>
      <h1 className="mt-3 font-display text-display-md">{first ? <>Hello, {first}.</> : <>Welcome.</>}</h1>
      <p className="mt-3 max-w-xl text-sm text-ink-soft">Your details, orders and wishlist are saved on this device. Look up any order with its number and email.</p>

      <div className="no-scrollbar mt-10 flex gap-2 overflow-x-auto border-b border-line" role="tablist">
        {([["orders", `Orders (${orders.length})`], ["routines", "Routines & customizations"], ["details", "Details & address"], ["lookup", "Find an order"]] as const).map(([id, label]) => (
          <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)} className={`-mb-px shrink-0 border-b-2 px-1 pb-3 pr-6 text-sm uppercase tracking-[0.14em] ${tab === id ? "border-ink text-ink" : "border-transparent text-taupe hover:text-ink"}`}>
            {label}
          </button>
        ))}
        <Link href="/wishlist" className="-mb-px ml-auto border-b-2 border-transparent pb-3 text-sm uppercase tracking-[0.14em] text-taupe hover:text-ink">Wishlist ({wishlist.length})</Link>
      </div>

      <div className="mt-10">
        {tab === "routines" && <MiyAccount />}
        {tab === "orders" &&
          (orders.length ? (
            <ul className="divide-y divide-line border-y border-line">
              {orders.map((o) => (
                <li key={o.id}>
                  <Link href={`/order/${o.id}`} className="grid gap-2 py-5 hover:bg-bone-2 sm:grid-cols-5 sm:items-center sm:px-3">
                    <span className="font-medium">{o.id}</span>
                    <span className="text-sm text-ink-soft">{new Date(o.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}</span>
                    <span className="text-sm text-ink-soft">{o.items.reduce((s, i) => s + i.qty, 0)} items</span>
                    <span className="text-sm">{o.paymentStatus === "paid" ? "Paid" : o.paymentStatus === "failed" ? "Failed" : "Pending"}</span>
                    <span className="tabular-nums sm:text-right">{money(o.total)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-16 text-center">
              <p className="font-display text-3xl">No orders on this device yet.</p>
              <Link href="/shop" className="btn btn-primary mt-6">Start shopping</Link>
            </div>
          ))}

        {tab === "details" && (
          <form
            className="grid max-w-2xl gap-5 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              writeJSON(STORAGE_KEYS.profile, profile);
              setSaved(true);
              setTimeout(() => setSaved(false), 2000);
            }}
          >
            {([["name", "Full name", "name"], ["email", "Email", "email"], ["phone", "Mobile", "tel"], ["line1", "Address", "address-line1"], ["line2", "Landmark / area", "address-line2"], ["city", "City", "address-level2"], ["pincode", "PIN code", "postal-code"]] as const).map(([k, label, ac]) => (
              <div key={k} className={`field ${k === "line1" || k === "line2" ? "sm:col-span-2" : ""}`}>
                <label htmlFor={`p-${k}`} className="label">{label}</label>
                <input id={`p-${k}`} className="input" autoComplete={ac} value={profile[k]} onChange={(e) => setProfile({ ...profile, [k]: e.target.value })} />
              </div>
            ))}
            <div className="field">
              <label htmlFor="p-state" className="label">State</label>
              <select id="p-state" className="input" value={profile.state} onChange={(e) => setProfile({ ...profile, state: e.target.value })}>
                <option value="">Select…</option>
                {indianStates.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-4 sm:col-span-2">
              <button className="btn btn-primary">Save details</button>
              {saved && <span className="text-sm text-leaf" role="status">Saved</span>}
              <button
                type="button"
                className="ml-auto text-xs uppercase tracking-[0.14em] text-taupe hover:text-ink"
                onClick={() => {
                  writeJSON(STORAGE_KEYS.profile, {});
                  writeJSON(STORAGE_KEYS.orders, []);
                  setOrders([]);
                  setProfile({ name: "", email: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "" });
                }}
              >
                Clear data on this device
              </button>
            </div>
          </form>
        )}

        {tab === "lookup" && (
          <div className="max-w-xl">
            <form
              className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
              onSubmit={async (e) => {
                e.preventDefault();
                const r = await fetch(`/api/orders/${encodeURIComponent(lookup.id.trim().toUpperCase())}?email=${encodeURIComponent(lookup.email.trim())}`).catch(() => null);
                const d = await r?.json().catch(() => null);
                setFound(r?.ok && d?.order ? d.order : "none");
              }}
            >
              <div className="field"><label htmlFor="l-id" className="label">Order number</label><input id="l-id" className="input" placeholder="CO2-261008-XXXXXX" value={lookup.id} onChange={(e) => setLookup({ ...lookup, id: e.target.value })} required /></div>
              <div className="field"><label htmlFor="l-em" className="label">Email</label><input id="l-em" type="email" className="input" value={lookup.email} onChange={(e) => setLookup({ ...lookup, email: e.target.value })} required /></div>
              <button className="btn btn-primary">Find</button>
            </form>
            {found === "none" && <p className="mt-6 text-sm text-red-700" role="alert">No order found with those details.</p>}
            {found && found !== "none" && (
              <Link href={`/order/${found.id}`} className="mt-6 block border border-line p-5 hover:border-ink">
                <p className="font-medium">{found.id}</p>
                <p className="text-sm text-ink-soft">{money(found.total)} · {found.paymentStatus === "paid" ? "Paid" : "Pending"} · View details →</p>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
