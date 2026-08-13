import { Search } from "lucide-react";
import { Link } from "react-router-dom";

function SearchBar() {
  return (
    <section className="relative -mt-7 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/5">

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
            <Search size={20} />
          </div>

          <input
            type="text"
            placeholder="Cari makanan atau minuman..."
            className="min-w-0 flex-1 bg-transparent px-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 sm:text-base"
          />

          <Link
            to="/products"
            className="hidden rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700 sm:block"
          >
            Cari
          </Link>

        </div>
      </div>
    </section>
  );
}

export default SearchBar;
