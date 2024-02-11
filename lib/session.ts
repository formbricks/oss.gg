import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  console.log("getcurrentuser check:", session?.user);

  return session?.user;
}
