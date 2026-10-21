/** Builds a link into the Make It Yours builder with an optional pre-fill. */
export function buildHref(buildId: string, opts: { from?: string; prefill?: Record<string, string>; next?: string[] } = {}) {
  const sp = new URLSearchParams({ product: buildId });
  if (opts.from) sp.set("from", opts.from);
  if (opts.next?.length) sp.set("next", opts.next.join(","));
  if (opts.prefill) {
    const clean = Object.fromEntries(Object.entries(opts.prefill).filter(([, v]) => v));
    if (Object.keys(clean).length) sp.set("pf", JSON.stringify(clean));
  }
  return `/make-it-yours/build?${sp.toString()}`;
}
