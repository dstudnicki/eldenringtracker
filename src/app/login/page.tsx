"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import LoginForm from "@/components/loginForm";

export default function LoginPage() {
    const { data: session } = useSession();

    if (session) {
        redirect("/");
    }

    return (
        <main className="px-4 sm:px-8 lg:px-12 xl:px-0 xl:container">
            <div className="lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">Log into your account.</h1>
                        <p className="text-sm text-muted-foreground">Please enter your credentials below.</p>
                    </div>
                    <LoginForm />
                </div>
            </div>
        </main>
    );
}
