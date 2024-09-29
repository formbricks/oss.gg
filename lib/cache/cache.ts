import { unstable_cache as cache } from "next/cache"
import type { CacheTags } from "./tags"


export async function withCache<T>(fn: () => Promise<T>, tags: CacheTags, opts?: { revalidate?: number }): Promise<T> {
  return cache(fn, tags, { tags, revalidate: opts?.revalidate })()
}
