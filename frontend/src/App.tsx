import { useState } from 'react'

function App() {
  const [apiMessage, setApiMessage] = useState('Belum cek koneksi API')
  const [loading, setLoading] = useState(false)

  async function checkApi() {
    setLoading(true)

    try {
      const response = await fetch('/api/')
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = (await response.json()) as { message?: string }
      setApiMessage(data.message ?? 'API terhubung, tapi respons tidak punya pesan.')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Terjadi error tidak dikenal'
      setApiMessage(`Gagal terhubung ke API: ${message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_10%_20%,#fce7f3_0%,#f8fafc_45%,#ecfeff_100%)] px-6 py-14 text-slate-900">
      <div className="pointer-events-none absolute -left-24 top-20 h-80 w-80 rounded-full bg-pink-300/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-96 w-96 rounded-full bg-cyan-300/40 blur-3xl" />

      <section className="relative mx-auto max-w-4xl rounded-3xl border border-white/70 bg-white/70 p-8 shadow-xl backdrop-blur lg:p-12">
        <p className="mb-3 inline-flex rounded-full border border-pink-200 bg-pink-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-pink-700">
          TypeCMS Frontend
        </p>
        <h1 className="text-balance text-4xl font-bold leading-tight sm:text-5xl">
          Vite + Tailwind sudah terpasang dan siap dipakai
        </h1>
        <p className="mt-4 max-w-2xl text-base text-slate-700 sm:text-lg">
          Frontend ini terpisah dari Express backend. Semua request ke <span className="font-semibold">/api</span> akan diproxy ke server API kamu di port 7001.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Status Koneksi API</p>
            <p className="mt-2 text-sm leading-6 text-slate-800">{apiMessage}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Langkah Selanjutnya</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">Mulai bangun halaman admin atau landing page dari komponen React di sini.</p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={checkApi}
            disabled={loading}
            className="inline-flex items-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Mengecek API...' : 'Cek Koneksi API'}
          </button>
          <a
            href="http://localhost:7001/docs"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
          >
            Buka Swagger Docs
          </a>
        </div>
      </section>
    </main>
  )
}

export default App
