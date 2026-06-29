"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "~/trpc/react";

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  function getFormString(formData: FormData, key: string) {
    const value = formData.get(key);
    return typeof value === "string" ? value : "";
  }

  const registerGuest = api.auth.registerGuest.useMutation({
    async onSuccess(_, variables) {
      const result = await signIn("credentials", {
        email: variables.email,
        password: variables.password,
        redirect: false,
      });

      if (result?.error) {
        router.push("/login");
        return;
      }

      router.push("/guest/dashboard");
      router.refresh();
    },
    onError(error) {
      setError(error.message);
    },
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const phone = getFormString(formData, "phone");

    registerGuest.mutate({
      name: getFormString(formData, "name"),
      email: getFormString(formData, "email"),
      phone: phone.length ? phone : undefined,
      password: getFormString(formData, "password"),
    });
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div>
        <label className="text-sm font-medium text-stone-700" htmlFor="name">
          Name
        </label>
        <input
          className="mt-2 w-full rounded-md border border-stone-300 bg-white px-3 py-3 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          id="name"
          name="name"
          placeholder="Your full name"
          required
          type="text"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-stone-700" htmlFor="email">
          Email
        </label>
        <input
          className="mt-2 w-full rounded-md border border-stone-300 bg-white px-3 py-3 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          id="email"
          name="email"
          placeholder="you@example.com"
          required
          type="email"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-stone-700" htmlFor="phone">
          Phone
        </label>
        <input
          className="mt-2 w-full rounded-md border border-stone-300 bg-white px-3 py-3 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          id="phone"
          name="phone"
          placeholder="+62..."
          type="tel"
        />
      </div>

      <div>
        <label
          className="text-sm font-medium text-stone-700"
          htmlFor="password"
        >
          Password
        </label>
        <input
          className="mt-2 w-full rounded-md border border-stone-300 bg-white px-3 py-3 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          id="password"
          name="password"
          minLength={6}
          required
          type="password"
        />
      </div>

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        className="w-full rounded-md bg-emerald-700 px-4 py-3 font-medium text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-stone-400"
        disabled={registerGuest.isPending}
        type="submit"
      >
        {registerGuest.isPending ? "Creating account..." : "Create account"}
      </button>

      <p className="text-sm text-stone-600">
        Already registered?{" "}
        <Link className="font-medium text-emerald-700" href="/login">
          Sign in
        </Link>
      </p>
    </form>
  );
}
