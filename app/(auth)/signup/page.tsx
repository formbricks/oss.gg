import { UserAuthForm } from "@/components/user-auth-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

export default function LoginPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col items-center justify-center space-y-2 text-center">
          <h1 className="mb-3 text-7xl">🕹️</h1>
          <p>shall we play a game?</p>
        </div>
        <UserAuthForm />
      </div>
    </div>
  );
}
