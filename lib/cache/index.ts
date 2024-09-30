import { unstable_cache as cache } from "next/cache"


// utility function to cache a function with tags and optional revalidation
export async function withCache<T>(fn: () => Promise<T>, tags: string[], opts?: { revalidate?: number }): Promise<T> {
  return cache(fn, tags, { tags, revalidate: opts?.revalidate })()
}
