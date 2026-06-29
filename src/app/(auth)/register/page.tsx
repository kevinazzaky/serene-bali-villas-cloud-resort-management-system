import Link from "next/link";

import { RegisterForm } from "./register-form";

export default async function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-100 px-6 py-12">
      <section className="w-full max-w-md rounded-lg bg-white p-8 shadow-sm">
        <Link className="text-sm font-medium text-emerald-700" href="/">
          Serene Bali Villas
        </Link>
        <h1 className="mt-6 text-3xl font-semibold text-stone-950">
          Register Guest
        </h1>
        <p className="mt-2 text-sm text-stone-600">
          Create a guest profile for bookings and concierge service.
        </p>
        <div className="mt-8">
          <RegisterForm />
        </div>
      </section>
    </main>
  );
}
