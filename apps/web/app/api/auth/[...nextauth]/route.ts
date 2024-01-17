import { authOptions } from "@ossgg/lib/auth/authOptions";
import NextAuth from "next-auth";

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- NextAuth not offering return types */
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
