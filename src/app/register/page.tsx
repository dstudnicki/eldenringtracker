"use client";
import { useSession } from "next-auth/react";
import { UserAuthForm } from "@/components/user-auth-form";
import { redirect } from "next/navigation";

export default function RegisterPage() {
  const { data: session } = useSession();

  if (session) {
    redirect("/");
  }

  return (
    <main className="px-4 xl:container sm:px-8 lg:px-12 xl:px-0">
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email below to create your account
            </p>
          </div>
          <UserAuthForm />
        </div>
      </div>
    </main>
  );
}
