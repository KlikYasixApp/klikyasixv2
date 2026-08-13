import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

function HomeCTA() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-3xl bg-green-600 px-6 py-12 text-center shadow-xl shadow-green-600/20 sm:px-12">

        <h2 className="text-3xl font-black text-white sm:text-4xl">
          Lapar? Jangan antre lama.
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-green-50">
          Pesan menu favoritmu sekarang dan ambil ketika pesanan sudah siap.
        </p>

        <Link
          to="/products"
          className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-green-700 transition hover:bg-green-50"
        >
          Mulai Pesan
          <ArrowRight size={19} />
        </Link>

      </div>
    </section>
  );
}

export default HomeCTA;
