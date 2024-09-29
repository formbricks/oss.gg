"use server"

import { revalidateTag } from "next/cache"
import type { CacheTags } from "./tags"

export async function revalidate(tags: CacheTags): Promise<void>{

  await Promise.all(tags.map(tag=>revalidateTag(tag)))

}
