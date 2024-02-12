import { buttonVariants } from "@/components/ui/button";
import { UserAuthForm } from "@/components/user-auth-form";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const metadata = {
  title: "Create an account",
  description: "Create an account to get started.",
};

export default function RegisterPage() {
  return (
    <div className="container grid h-screen w-screen flex-col items-center justify-center  lg:px-0">
      <Link
        href="/login"
        className={cn(buttonVariants({ variant: "ghost" }), "absolute right-4 top-4 md:right-8 md:top-8")}>
        Login
      </Link>

      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col items-center justify-center space-y-2 text-center">
            <h1 className="mb-3 text-7xl">🕹️</h1>
            <p className="text-sm text-muted-foreground">
              Use Github to <b>create</b> your account
            </p>
          </div>
          <UserAuthForm />
        </div>
      </div>
    </div>
  );
}
