import { useState } from "react";
import type { FormEvent } from "react";

type LoginPageProps = {
  onSubmit: (credentials: { userName: string; password: string }) => Promise<void>;
  loading: boolean;
  errorMessage: string;
};

export function LoginPage({ onSubmit, loading, errorMessage }: LoginPageProps) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmit({ userName, password });
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,#dbeafe_0%,#f8fafc_40%,#eef2ff_100%)] px-5 py-10">
      <div className="pointer-events-none absolute -left-14 top-12 h-72 w-72 rounded-full bg-blue-300/45 blur-3xl" />
      <div className="pointer-events-none absolute -right-12 bottom-6 h-80 w-80 rounded-full bg-indigo-300/40 blur-3xl" />

      <section className="relative w-full max-w-md rounded-2xl border border-white/70 bg-white/85 p-7 shadow-xl backdrop-blur md:p-8">
        <p className="mb-3 inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-indigo-700">
          TypeCMS Admin
        </p>
        <h1 className="text-3xl font-semibold text-slate-900">Login Dashboard</h1>
        <p className="mt-2 text-sm text-slate-600">Silakan masuk untuk mengakses panel CMS.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="userName">
              Username
            </label>
            <input
              id="userName"
              type="text"
              autoComplete="username"
              value={userName}
              onChange={(event) => setUserName(event.target.value)}
              placeholder="Masukkan username"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Masukkan password"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              required
            />
          </div>

          {errorMessage ? (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{errorMessage}</p>
          ) : null}

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={loading}
          >
            {loading ? "Sedang login..." : "Login"}
          </button>
        </form>
      </section>
    </main>
  );
}
