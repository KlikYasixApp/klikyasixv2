import {
  ArrowRight,
  Clock3,
  Sparkles,
  Utensils,
} from "lucide-react";
import { Link } from "react-router-dom";

function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <div className="mx-auto grid min-h-[520px] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">

        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-200 bg-white px-4 py-2 text-sm font-medium text-green-700 shadow-sm">
            <Sparkles size={16} />
            Kantin sekolah jadi lebih mudah
          </div>

          <h1 className="text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Pesan makanan,
            <span className="block text-green-600">
              tinggal ambil.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
            Pilih makanan dan minuman favoritmu dari kantin sekolah.
            Pesan sekarang, lalu ambil ketika sudah siap.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700"
            >
              Lihat Menu
              <ArrowRight size={19} />
            </Link>

            <Link
              to="/orders"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <Clock3 size={19} />
              Cek Pesanan
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute -left-8 -top-8 h-32 w-32 rounded-full bg-green-200/60 blur-3xl" />
          <div className="absolute -bottom-8 -right-8 h-40 w-40 rounded-full bg-emerald-200/60 blur-3xl" />

          <div className="relative overflow-hidden rounded-[2rem] border border-white bg-white p-3 shadow-2xl shadow-slate-900/10">
            <div className="relative overflow-hidden rounded-[1.5rem]">
              <img
                src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1000&q=80"
                alt="Makanan kantin"
                className="h-[380px] w-full object-cover"
              />

              <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/30 bg-white/90 p-4 shadow-lg backdrop-blur">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      Favorit hari ini
                    </p>

                    <h3 className="mt-1 font-bold text-slate-900">
                      Menu Kantin Pilihan
                    </h3>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-600 text-white">
                    <Utensils size={19} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

export default HeroSection;
