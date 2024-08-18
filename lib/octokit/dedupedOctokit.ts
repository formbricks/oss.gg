import { Octokit } from "@octokit/rest";

interface CacheEntry {
  sent: boolean;
  lastAttempt: number;
  timeoutId: NodeJS.Timeout;
}

class CommentCache {
  private cache: Map<string, CacheEntry> = new Map();
  private readonly TTL: number = 5 * 1000; // 24 hours in milliseconds

  set(key: string, value: Omit<CacheEntry, "timeoutId">): void {
    const timeoutId = setTimeout(() => this.cache.delete(key), this.TTL);
    this.cache.set(key, { ...value, timeoutId });
  }

  get(key: string): Omit<CacheEntry, "timeoutId"> | undefined {
    const entry = this.cache.get(key);
    if (entry) {
      const { timeoutId, ...rest } = entry;
      return rest;
    }
    return undefined;
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  delete(key: string): void {
    const entry = this.cache.get(key);
    if (entry) {
      clearTimeout(entry.timeoutId);
      this.cache.delete(key);
    }
  }
}

const commentCache = new CommentCache();

export function createDedupedOctokit(octokit: Octokit): Octokit {
  return new Proxy(octokit, {
    get(target, prop) {
      if (prop === "issues") {
        return new Proxy(target.issues, {
          get(issuesTarget, issuesProp) {
            if (issuesProp === "createComment") {
              return async (params: any) => {
                const cacheKey = `${params.owner}:${params.repo}:${params.issue_number}:${params.body}`;

                const entry = commentCache.get(cacheKey);
                const now = Date.now();

                if (entry && entry.sent) {
                  console.log("Duplicate comment prevented:", cacheKey);
                  return null;
                }

                try {
                  const result = await issuesTarget.createComment(params);
                  commentCache.set(cacheKey, { sent: true, lastAttempt: now });
                  console.log("Comment sent successfully:", cacheKey);
                  return result;
                } catch (error) {
                  console.error("Failed to send comment:", cacheKey, error);
                  commentCache.set(cacheKey, { sent: false, lastAttempt: now });
                  throw error;
                }
              };
            }
            return Reflect.get(issuesTarget, issuesProp);
          },
        });
      }
      return Reflect.get(target, prop);
    },
  });
}
